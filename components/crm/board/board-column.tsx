"use client";

import { Droppable } from "@hello-pangea/dnd";
import { MoreHorizontal } from "lucide-react";
import { BoardColumn as BoardColumnType } from "@/store/use-board-store";
import { LeadCard } from "./lead-card";
import { useI18nStore } from "@/store/use-i18n-store";

interface BoardColumnProps {
  column: BoardColumnType;
}

export function BoardColumn({ column }: BoardColumnProps) {
  const { t } = useI18nStore();

  return (
    <div className="min-w-[320px] w-[320px] flex-shrink-0 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${column.color === 'tertiary' ? 'bg-amber-400' : column.color.includes('primary') ? 'bg-emerald-500' : 'bg-stone-400'}`}></span>
          <h3 className="font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            {t(column.labelKey)}
          </h3>
          <span className="text-xs bg-stone-200 dark:bg-stone-800 px-2 py-0.5 rounded-full text-stone-600 dark:text-stone-300 font-medium">
            {column.cards.length}
          </span>
        </div>
        <button className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div 
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`flex-1 space-y-4 min-h-[200px] rounded-xl transition-colors ${
              snapshot.isDraggingOver ? "bg-stone-100 dark:bg-stone-800/50" : ""
            }`}
          >
            {column.cards.map((card, index) => (
              <LeadCard key={card.id} card={card} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
