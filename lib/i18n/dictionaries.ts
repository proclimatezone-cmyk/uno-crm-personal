export const dictionaries = {
  ru: {
    sidebar: {
      dashboard: "Сводка",
      leads: "Сделки",
      contacts: "Клиенты",
      analytics: "Аналитика",
      newLead: "Новая сделка"
    },
    header: {
      searchPlaceholder: "Поиск сделок..."
    },
    board: {
      workspace: "Рабочая среда",
      pipelineBoard: "Воронка продаж",
      title: "Леды и Сделки",
      description: "Управляйте активными сделками и отслеживайте коммерческий прогресс.",
      filter: "Фильтр",
      sort: "Сортировка",
      createDeal: "Создать сделку",
      addDeal: "Добавить сделку",
      stages: {
        initial: "Первый контакт",
        qualification: "Квалификация",
        proposal: "Коммерческое",
        negotiation: "Переговоры"
      },
      tags: {
        organic: "Органика",
        referral: "Реферальный",
        highValue: "Высокий чек",
        draftSent: "КП Отправлено",
        closingSoon: "Скоро закрытие"
      },
      closingProbability: "Вероятность закрытия"
    },
    modal: {
      dealTitle: "Название сделки",
      dealTitlePlaceholder: "Напр. Внедрение CRM",
      budget: "Бюджет ($)",
      stage: "Этап",
      creating: "Создание..."
    },
    slideover: {
      budget: "Бюджет",
      contact: "Контакт",
      stage: "Этап воронки",
      customFields: "Пользовательские поля",
      activityFeed: "Лента активности",
      addNote: "Добавить примечание...",
      save: "Сохранить",
      noContact: "Контакт не привязан"
    }
  },
  en: {
    sidebar: {
      dashboard: "Dashboard",
      leads: "Leads",
      contacts: "Contacts",
      analytics: "Analytics",
      newLead: "New Lead"
    },
    header: {
      searchPlaceholder: "Search deals..."
    },
    board: {
      workspace: "Workspace",
      pipelineBoard: "Pipeline Board",
      title: "Leads Pipeline",
      description: "Manage your active deals and track commercial progress.",
      filter: "Filter",
      sort: "Value",
      createDeal: "Create Deal",
      addDeal: "Add Deal",
      stages: {
        initial: "Initial Contact",
        qualification: "Qualification",
        proposal: "Proposal",
        negotiation: "Negotiation"
      },
      tags: {
        organic: "Organic",
        referral: "Referral",
        highValue: "High Value",
        draftSent: "Draft Sent",
        closingSoon: "Closing Soon"
      },
      closingProbability: "Closing Probability"
    },
    modal: {
      dealTitle: "Deal Title",
      dealTitlePlaceholder: "e.g. CRM Implementation",
      budget: "Budget ($)",
      stage: "Stage",
      creating: "Creating..."
    },
    slideover: {
      budget: "Budget",
      contact: "Contact",
      stage: "Pipeline Stage",
      customFields: "Custom Fields",
      activityFeed: "Activity Feed",
      addNote: "Add a note...",
      save: "Save",
      noContact: "No contact linked"
    }
  },
  uz: {
    sidebar: {
      dashboard: "Boshqaruv paneli",
      leads: "Bitimlar",
      contacts: "Mijozlar",
      analytics: "Analitika",
      newLead: "Yangi bitim"
    },
    header: {
      searchPlaceholder: "Bitimlarni qidirish..."
    },
    board: {
      workspace: "Ish stoli",
      pipelineBoard: "Sotuv voronkasi",
      title: "Bitimlar Voronkasi",
      description: "Faol bitimlaringizni boshqaring va savdo jarayonini kuzating.",
      filter: "Filtr",
      sort: "Saralash",
      createDeal: "Bitim yaratish",
      addDeal: "Qo'shish",
      stages: {
        initial: "Birinchi aloqa",
        qualification: "Kvalifikatsiya",
        proposal: "Taklif",
        negotiation: "Muzokaralar"
      },
      tags: {
        organic: "Organik",
        referral: "Tavsiya",
        highValue: "Katta qiymat",
        draftSent: "Taklif yuborildi",
        closingSoon: "Tez orada yopiladi"
      },
      closingProbability: "Yopilish ehtimoli"
    },
    modal: {
      dealTitle: "Bitim nomi",
      dealTitlePlaceholder: "Masalan. CRM joriy etish",
      budget: "Budjet ($)",
      stage: "Bosqich",
      creating: "Yaratilmoqda..."
    },
    slideover: {
      budget: "Budjet",
      contact: "Aloqa",
      stage: "Voronka bosqichi",
      customFields: "Maxsus maydonlar",
      activityFeed: "Faollik lentasi",
      addNote: "Eslatma qo'shish...",
      save: "Saqlash",
      noContact: "Aloqa biriktirilmagan"
    }
  }
};

export type Language = 'ru' | 'en' | 'uz';

export function getTranslation(lang: Language, path: string): string {
  const keys = path.split('.');
  let result: unknown = dictionaries[lang];
  for (const k of keys) {
    if (result && typeof result === 'object' && k in (result as Record<string, unknown>)) {
      result = (result as Record<string, unknown>)[k];
    } else {
      return path; 
    }
  }
  return typeof result === 'string' ? result : path;
}
