"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Tag, Briefcase } from "lucide-react";
import { useBoardStore } from "@/store/use-board-store";
import { useI18nStore } from "@/store/use-i18n-store";

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddLeadModal({ isOpen, onClose }: AddLeadModalProps) {
  const { columns, addLead } = useBoardStore();
  const { t } = useI18nStore();
  
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stageId, setStageId] = useState(columns[0]?.id || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !stageId) return;

    setIsLoading(true);
    await addLead({
      title,
      price: Number(price) || 0,
      contact: null,
      customFields: {},
    }, stageId);
    
    setIsLoading(false);
    setTitle("");
    setPrice("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800">
            <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 italic">
              {t("board.createDeal")}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
              <X className="w-5 h-5 text-stone-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">{t("modal.dealTitle")}</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("modal.dealTitlePlaceholder")}
                  className="w-full pl-10 pr-4 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">{t("modal.budget")}</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">{t("modal.stage")}</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                  <select
                    value={stageId}
                    onChange={(e) => setStageId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none"
                  >
                    {columns.map(col => (
                      <option key={col.id} value={col.id}>{t(col.labelKey)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#4a7c59] text-white rounded-xl font-bold text-sm tracking-widest uppercase shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all disabled:opacity-50"
              >
                {isLoading ? t("modal.creating") : t("board.createDeal")}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
