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

      // Ensure data exists before mapping
      if (!stagesData || stagesData.length === 0) {
         // Fallback if DB is empty - just return empty columns or mock. Currently returning empty state.
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
