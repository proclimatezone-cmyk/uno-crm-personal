import { create } from 'zustand';
import { supabase } from '@/lib/db/supabase-client';

export interface ContactShort {
  id: string;
  name: string;
  phone: string | null;
}

export interface LeadCard {
  id: string;
  title: string;
  price: number;
  contact: ContactShort | null;
  createdAt: string;
  boardPosition: number;
  tags?: Array<{ label: string, color: 'tertiary' | 'primary' }>;
  ownerAvatar?: string;
  closingProbability?: number;
  customFields?: Record<string, unknown>;
}

export interface BoardColumn {
  id: string; 
  labelKey: string; 
  color: string;
  cards: LeadCard[];
}

export interface BoardState {
  columns: BoardColumn[];
  isLoading: boolean;
  error: string | null;
  selectedLeadId: string | null;
  
  setSelectedLead: (id: string | null) => void;
  updateLeadCustomFields: (leadId: string, fields: Record<string, unknown>) => void;
  fetchBoard: () => Promise<void>;
  moveCardOptimistic: (
    cardId: string, 
    sourceColumnId: string, 
    destinationColumnId: string, 
    sourceIndex: number, 
    destinationIndex: number
  ) => Promise<void>;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  columns: [],
  isLoading: false,
  error: null,
  selectedLeadId: null,

  setSelectedLead: (id) => set({ selectedLeadId: id }),
  updateLeadCustomFields: (leadId, fields) => set((state) => ({
    columns: state.columns.map(col => ({
      ...col,
      cards: col.cards.map(card => 
        card.id === leadId ? { ...card, customFields: fields } : card
      )
    }))
  })),

  fetchBoard: async () => {
    set({ isLoading: true, error: null });

    // --- MOCK DATA FALLBACK FOR QA/DEMO ---
    const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
    
    if (isPlaceholder) {
       console.warn("Board: Running in Demo Mode");
       const mockColumns: BoardColumn[] = [
         {
           id: 'stage-1',
           labelKey: 'board.stages.initial',
           color: 'stone-400',
           cards: [
             { id: 'lead-1', title: 'Внедрение AI-ботов', price: 12000, contact: { id: 'c1', name: 'Алексей Иванов', phone: '+7 900 123-45-67' }, createdAt: new Date().toISOString(), boardPosition: 0, tags: [{ label: 'board.tags.organic', color: 'primary' }], closingProbability: 40 },
             { id: 'lead-2', title: 'Разработка лендинга', price: 5000, contact: { id: 'c2', name: 'Мария Петрова', phone: null }, createdAt: new Date().toISOString(), boardPosition: 1, tags: [{ label: 'board.tags.referral', color: 'tertiary' }] }
           ]
         },
         {
           id: 'stage-2',
           labelKey: 'board.stages.qualification',
           color: 'amber-400',
           cards: [
             { id: 'lead-3', title: 'SEO Оптимизация', price: 8500, contact: { id: 'c3', name: 'ТехноСфера', phone: '+7 999 000-00-01' }, createdAt: new Date().toISOString(), boardPosition: 0, tags: [{ label: 'board.tags.highValue', color: 'primary' }], closingProbability: 65, ownerAvatar: 'https://i.pravatar.cc/150?u=tech' }
           ]
         },
         {
           id: 'stage-3',
           labelKey: 'board.stages.proposal',
           color: 'emerald-400',
           cards: [
             { id: 'lead-4', title: 'Корпоративный портал', price: 45000, contact: { id: 'c4', name: 'ГазПромСбыт', phone: null }, createdAt: new Date().toISOString(), boardPosition: 0, tags: [{ label: 'board.tags.closingSoon', color: 'primary' }], closingProbability: 90 }
           ]
         }
       ];
       set({ columns: mockColumns, isLoading: false });
       return;
    }

    try {
      // 1. Fetch Funnel Stages
      const { data: stagesData, error: stagesError } = await supabase
        .from('funnel_stages')
        .select('*')
        .order('order_index', { ascending: true });

      if (stagesError) throw stagesError;

      // 2. Fetch Leads with related Contact info
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*, contact:contacts(id, name, phone)');

      if (leadsError) throw leadsError;

      if (!stagesData || stagesData.length === 0) {
         set({ columns: [], isLoading: false });
         return;
      }

      // 3. Map leads to their respective Board columns, sorted by board_position
      const mappedColumns: BoardColumn[] = stagesData.map((stage) => {
        const stageLeads = (leadsData || [])
          .filter((lead) => lead.stage_id === stage.id)
          .sort((a, b) => (a.board_position || 0) - (b.board_position || 0))
          .map((lead): LeadCard => ({
            id: lead.id,
            title: lead.title,
            price: Number(lead.price || 0),
            contact: lead.contact ? lead.contact[0] || lead.contact : null, 
            createdAt: lead.created_at,
            boardPosition: lead.board_position || 0,
            customFields: (lead.custom_fields as Record<string, unknown>) || {},
            // Assigning standard generic values if not stored in DB yet
            ownerAvatar: undefined,
          }));

        return {
          id: stage.id,
          labelKey: `board.stages.${stage.label}`, // Fallback structure
          color: stage.color || 'stone-400',
          cards: stageLeads,
        };
      });

      set({ columns: mappedColumns, isLoading: false });
    } catch (error: unknown) {
      console.error("Failed to fetch board data:", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  moveCardOptimistic: async (
    cardId, 
    sourceColumnId, 
    destinationColumnId, 
    sourceIndex, 
    destinationIndex
  ) => {
    const previousColumns = get().columns;
    const columnsCopy = structuredClone(previousColumns);

    const sourceColIndex = columnsCopy.findIndex(c => c.id === sourceColumnId);
    const destColIndex = columnsCopy.findIndex(c => c.id === destinationColumnId);

    if (sourceColIndex === -1 || destColIndex === -1) return;

    // Remove from source arrays
    const [movedCard] = columnsCopy[sourceColIndex].cards.splice(sourceIndex, 1);
    
    // Check if moving in same column or to another
    columnsCopy[destColIndex].cards.splice(destinationIndex, 0, movedCard);

    // Update internal board_position for destination column
    columnsCopy[destColIndex].cards.forEach((c, idx) => {
      c.boardPosition = idx;
    });

    set({ columns: columnsCopy, error: null });

    try {
      // Direct API update to 'leads' table
      const { error: updateError } = await supabase
        .from('leads')
        .update({ 
          stage_id: destinationColumnId, 
          board_position: destinationIndex 
        })
        .eq('id', cardId);

      if (updateError) throw updateError;
      
      // Automated record in activity feed
      const sourceColDef = previousColumns.find(c => c.id === sourceColumnId);
      const destColDef = previousColumns.find(c => c.id === destinationColumnId);
      
      const sourceLabel = sourceColDef ? sourceColDef.labelKey.split('.').pop() : 'Unknown';
      const destLabel = destColDef ? destColDef.labelKey.split('.').pop() : 'Unknown';

      const { data: userResp } = await supabase.auth.getUser();
      await supabase.from('activities').insert({
        lead_id: cardId,
        user_id: userResp?.user?.id || null,
        type: 'stage_change',
        content: `Moved from ${sourceLabel} to ${destLabel}`
      });

    } catch (error) {
      console.error("Optimistic drag update failed:", error);
      set({ 
        columns: previousColumns, 
        error: 'Ошибка при перемещении карточки. Расстановка возвращена к исходной.' 
      });
    }
  }
}));
