import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lead_id } = body;

    if (!lead_id) {
      return NextResponse.json({ error: "Missing lead_id" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*, contact:contacts(*)')
      .eq('id', lead_id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const payload = {
      lead_id: lead.id,
      title: lead.title,
      budget: lead.price,
      contact: lead.contact ? lead.contact[0] || lead.contact : null,
      custom_fields: lead.custom_fields || {}
    };

    // Send payload to Make/Integromat generic webhook
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error("MAKE_WEBHOOK_URL is not configured.");
    }

    const makeResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!makeResponse.ok) {
      throw new Error(`External webhook failed with status ${makeResponse.status}`);
    }

    // Explicitly DB record of automation fire only if successfully pushed
    await supabase.from('activities').insert({
      lead_id: lead.id,
      user_id: user.id,
      type: 'task_created',
      content: 'Запущена генерация КП'
    });

    return NextResponse.json({ success: true, payload }, { status: 200 });

  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
