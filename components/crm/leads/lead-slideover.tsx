"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, DollarSign, Target, FileText, Activity, Send, Plus, Trash2, Loader2 } from "lucide-react";
import { useBoardStore, LeadCard } from "@/store/use-board-store";
import { useI18nStore } from "@/store/use-i18n-store";
import { supabase } from "@/lib/db/supabase-client";

interface Activity {
  id: string;
  lead_id: string;
  user_id: string | null;
  type: 'comment' | 'stage_change' | 'task_created';
  content: string;
  created_at: string;
}

export function LeadSlideover() {
  const { selectedLeadId, setSelectedLead, columns, updateLeadCustomFields } = useBoardStore();
  const { t } = useI18nStore();
  
  const [lead, setLead] = useState<LeadCard | null>(null);
  
  // Custom Fields State
  const [customFields, setCustomFields] = useState<Record<string, unknown>>({});
  const [newFieldKey, setNewFieldKey] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");

  // Commentary State
  const [note, setNote] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  
  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);

  // Load Lead
  useEffect(() => {
    if (selectedLeadId) {
      let found: LeadCard | null = null;
      for (const col of columns) {
        const _l = col.cards.find(c => c.id === selectedLeadId);
        if (_l) {
          found = _l;
          break;
        }
      }
      setLead(found || null);
      setCustomFields(found?.customFields || {});
      loadActivities(selectedLeadId);
    } else {
      setLead(null);
      setCustomFields({});
      setActivities([]);
    }
  }, [selectedLeadId, columns]);

  const loadActivities = async (leadId: string) => {
    const { data } = await supabase
      .from('activities')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
    
    if (data) setActivities(data);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedLead(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [setSelectedLead]);

  // Handle Custom Field Add
  const handleAddField = async () => {
    if (!newFieldKey.trim() || !newFieldValue.trim() || !lead) return;
    
    const updatedFields = {
      ...customFields,
      [newFieldKey.trim()]: newFieldValue.trim()
    };
    
    setCustomFields(updatedFields);
    setNewFieldKey("");
    setNewFieldValue("");

    // Optimistic cache update locally and trigger DB sync
    updateLeadCustomFields(lead.id, updatedFields);
    await supabase.from('leads').update({ custom_fields: updatedFields }).eq('id', lead.id);
  };

  const handleRemoveField = async (key: string) => {
    if (!lead) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [key]: _, ...rest } = customFields;
    setCustomFields(rest);
    updateLeadCustomFields(lead.id, rest);
    await supabase.from('leads').update({ custom_fields: rest }).eq('id', lead.id);
  };

  // Handle Comment Add
  const handleAddNote = async () => {
    if (!note.trim() || !lead) return;
    const content = note;
    setNote("");

    const { data: userResp } = await supabase.auth.getUser();
    
    await supabase.from('activities').insert({
      lead_id: lead.id,
      user_id: userResp?.user?.id || null,
      type: 'comment',
      content: content
    });

    loadActivities(lead.id); // Refresh local activities explicitly
  };

  const handleGenerateProposal = async () => {
    if (!lead) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/webhooks/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: lead.id })
      });
      const data = await res.json();
      if (data.success) {
        alert("КП успешно отправлено на генерацию!");
        loadActivities(lead.id); // Reload activities to show the automatic log
      } else {
        alert("Ошибка генерации: " + data.error);
      }
    } catch (e: unknown) {
      alert("Ошибка сети: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {selectedLeadId && lead && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLead(null)}
            className="fixed inset-0 bg-stone-900/20 dark:bg-stone-950/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 right-0 h-full w-[85vw] max-w-5xl bg-white dark:bg-stone-900 shadow-2xl z-50 flex flex-col border-l border-stone-200 dark:border-stone-800"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800 shrink-0">
              <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                {lead.title}
              </h2>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleGenerateProposal}
                  disabled={isGenerating}
                  className="flex items-center gap-2 bg-[#4a7c59] hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                  Сгенерировать КП
                </button>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* LEFT COLUMN - SYSTEM DATA */}
              <div className="w-[30%] min-w-[300px] bg-stone-50/50 dark:bg-stone-950/30 border-r border-stone-100 dark:border-stone-800 p-6 overflow-y-auto custom-scrollbar">
                
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    {t("slideover.budget")}
                  </div>
                  <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                    ${lead.price.toLocaleString('en-US')}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <User className="w-4 h-4 text-amber-500" />
                    {t("slideover.contact")}
                  </div>
                  {lead.contact ? (
                    <div className="flex flex-col">
                      <span className="font-medium text-stone-900 dark:text-stone-100">{lead.contact.name}</span>
                      {lead.contact.phone && <span className="text-sm text-stone-500">{lead.contact.phone}</span>}
                    </div>
                  ) : (
                    <span className="text-sm text-stone-400 italic">{t("slideover.noContact")}</span>
                  )}
                </div>

                <div className="mb-8">
                  <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    {t("slideover.stage")}
                  </div>
                  <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-3 py-2 rounded-lg text-sm font-medium text-stone-800 dark:text-stone-200">
                     {t(columns.find(c => c.cards.some(lc => lc.id === lead.id))?.labelKey || '')}
                  </div>
                </div>

                {/* DB Sync Custom Fields Area */}
                <div>
                  <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-wider mb-3">
                    <FileText className="w-4 h-4 text-stone-500" />
                    {t("slideover.customFields")}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {Object.entries(customFields).map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-3 py-2 rounded-lg text-sm group">
                        <div className="flex flex-col w-[80%] break-words">
                          <span className="text-[10px] uppercase text-stone-400 font-bold">{k}</span>
                          <span className="text-stone-900 dark:text-stone-100">{String(v)}</span>
                        </div>
                        <button onClick={() => handleRemoveField(k)} className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-600 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Field Inputs */}
                  <div className="flex bg-stone-100 dark:bg-stone-900 p-2 rounded-lg gap-2 mt-4 items-center border border-stone-200 dark:border-stone-800">
                    <input 
                      type="text" 
                      placeholder="Ключ (Key)" 
                      value={newFieldKey}
                      onChange={(e) => setNewFieldKey(e.target.value)}
                      className="flex-1 w-0 bg-transparent text-xs p-1 outline-none text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
                    />
                    <div className="w-[1px] h-4 bg-stone-300 dark:bg-stone-700"></div>
                    <input 
                      type="text" 
                      placeholder="Значение (Value)" 
                      value={newFieldValue}
                      onChange={(e) => setNewFieldValue(e.target.value)}
                      className="flex-1 w-0 bg-transparent text-xs p-1 outline-none text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddField();
                      }}
                    />
                    <button 
                      onClick={handleAddField}
                      className="p-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 rounded-md hover:opacity-80 disabled:opacity-50"
                      disabled={!newFieldKey.trim() || !newFieldValue.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN - ACTIVITY FEED */}
              <div className="flex-1 flex flex-col p-6 overflow-hidden">
                <div className="flex items-center gap-2 text-stone-400 text-sm font-bold uppercase tracking-wider mb-6 shrink-0">
                  <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                  {t("slideover.activityFeed")}
                </div>

                <div className="flex-1 overflow-y-auto pr-4 mb-4 space-y-4 custom-scrollbar">
                  {activities.map((act) => (
                    <div key={act.id} className={`p-4 rounded-xl border ${
                      act.type === 'stage_change' 
                        ? 'bg-amber-50/50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/30'
                        : 'bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800'
                    }`}>
                      <div className="flex justify-between items-start mb-1 text-xs text-stone-400">
                        <span className="font-bold uppercase tracking-wider">{act.type === 'comment' ? 'Comment' : 'System Tracker'}</span>
                        <span>{new Date(act.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-stone-700 dark:text-stone-300">
                        {act.content}
                      </p>
                    </div>
                  ))}
                  
                  {activities.length === 0 && (
                    <div className="text-center text-stone-400 text-sm italic mt-10">
                      No activities recorded yet.
                    </div>
                  )}
                </div>

                {/* Add Note Input Area */}
                <div className="shrink-0 pt-4 border-t border-stone-100 dark:border-stone-800 relative">
                  <textarea 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddNote();
                      }
                    }}
                    className="w-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl p-4 pr-12 resize-none h-24 text-sm focus:ring-2 focus:ring-emerald-500 outline-none shadow-inner"
                    placeholder={t("slideover.addNote")}
                  />
                  <button 
                    onClick={handleAddNote}
                    disabled={!note.trim()}
                    className="absolute bottom-6 right-3 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
