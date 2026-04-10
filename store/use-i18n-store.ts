import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, getTranslation } from '@/lib/i18n/dictionaries';

interface I18nState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      language: 'ru',
      setLanguage: (lang) => set({ language: lang }),
      t: (path) => getTranslation(get().language, path),
    }),
    { name: 'uno-i18n' }
  )
);
