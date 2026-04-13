"use client";

import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Filter, ArrowUpDown, PlusCircle } from "lucide-react";
import { useBoardStore } from "@/store/use-board-store";
import { BoardColumn } from "./board-column";
import { useI18nStore } from "@/store/use-i18n-store";
import { LeadSlideover } from "@/components/crm/leads/lead-slideover";
import { AddLeadModal } from "./add-lead-modal";

export function BoardContainer() {
  const { columns, fetchBoard, moveCardOptimistic } = useBoardStore();
  const { t } = useI18nStore();
  const [mounted, setMounted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    fetchBoard();
  }, [fetchBoard]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    moveCardOptimistic(
      draggableId,
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index
    );
  };

  if (!mounted) return null; // Avoid hydration mismatch with DnD

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-[calc(100vh-64px)] flex flex-col relative w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 shrink-0">
        <div>
          <nav className="flex text-xs text-stone-500 mb-2 gap-2 font-medium">
            <span>{t("board.workspace")}</span>
            <span>/</span>
            <span className="text-emerald-600 dark:text-emerald-400">{t("board.pipelineBoard")}</span>
          </nav>
          <h1 className="text-4xl font-serif text-stone-900 dark:text-stone-50 leading-tight">
            {t("board.title")}
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">{t("board.description")}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
            <Filter className="w-4 h-4" />
            {t("board.filter")}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
            <ArrowUpDown className="w-4 h-4" />
            {t("board.sort")}
          </button>
          <div className="h-8 w-[1px] bg-stone-200 dark:bg-stone-800 mx-1"></div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#4a7c59] text-white px-6 py-2 rounded-lg text-sm font-medium shadow-md shadow-[#4a7c59]/20 hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            {t("board.createDeal")}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 -mx-2 px-2">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full items-start">
            {columns.map((col) => (
              <BoardColumn key={col.id} column={col} />
            ))}
            
            <div className="min-w-[320px] flex-shrink-0 mt-12">
              <div className="p-6 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-xl flex flex-col items-center justify-center text-stone-400 hover:text-emerald-600 hover:border-emerald-500/40 transition-all cursor-pointer group bg-stone-50/50 dark:bg-stone-900/20">
                <PlusCircle className="mb-2 w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-widest">{t("board.addDeal")}</span>
              </div>
            </div>
          </div>
        </DragDropContext>
      </div>

      <LeadSlideover />
      <AddLeadModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
