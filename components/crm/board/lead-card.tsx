"use client";

import { memo } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import Image from "next/image";
import { LeadCard as LeadCardType, useBoardStore } from "@/store/use-board-store";
import { Edit2 } from "lucide-react";
import { useI18nStore } from "@/store/use-i18n-store";

interface LeadCardProps {
  card: LeadCardType;
  index: number;
}

export const LeadCard = memo(({ card, index }: LeadCardProps) => {
  const { t } = useI18nStore();
  const setSelectedLead = useBoardStore(state => state.setSelectedLead);

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => {
        return (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ ...provided.draggableProps.style }}
        >
        <motion.div
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`bg-white dark:bg-stone-900 border ${
            snapshot.isDragging 
              ? 'border-emerald-500 shadow-xl z-50' 
              : 'border-transparent hover:border-emerald-500/30 shadow-[0_4px_20px_rgba(46,50,48,0.06)]'
          } transition-colors p-5 rounded-xl group cursor-grab`}
          onClick={() => setSelectedLead(card.id)}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex flex-wrap gap-2">
              {card.tags?.map((tag, i) => (
                <span 
                  key={i} 
                  className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                    tag.color === 'primary' 
                      ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400' 
                      : 'text-amber-700 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400'
                  }`}
                >
                  {t(tag.label)}
                </span>
              ))}
            </div>
            <button className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-opacity">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          
          <h4 className="font-serif font-bold text-lg leading-snug mb-1">{card.title}</h4>
          <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">{card.contact?.name}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="text-xs">$</span>
              <span>{card.price.toLocaleString('en-US')}</span>
            </div>
            {card.ownerAvatar && (
              <Image 
                alt="Deal Owner" 
                width={28}
                height={28}
                unoptimized
                className="w-7 h-7 rounded-full ring-2 ring-white dark:ring-stone-950 object-cover" 
                src={card.ownerAvatar} 
              />
            )}
          </div>

          {card.closingProbability !== undefined && (
            <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
              <div className="flex justify-between text-[10px] font-bold text-stone-400 uppercase tracking-tighter mb-1.5">
                <span>{t('board.closingProbability')}</span>
                <span>{card.closingProbability}%</span>
              </div>
              <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${card.closingProbability}%` }}
                ></div>
              </div>
            </div>
          )}
        </motion.div>
        </div>
        );
      }}
    </Draggable>
  );
});
LeadCard.displayName = "LeadCard";
