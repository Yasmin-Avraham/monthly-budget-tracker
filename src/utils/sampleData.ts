import { Transaction, CATEGORIES } from '../config/budgetConfig';
import { getMonthDateBounds } from './dateUtils';

export function generateSampleTransactions(yearMonth: string): Transaction[] {
  const findCat = (type: 'income' | 'expense', label: string) =>
    CATEGORIES.find((c) => c.type === type && c.label === label)?.id ||
    CATEGORIES.find((c) => c.type === type)!.id;

  const { maxDate } = getMonthDateBounds(yearMonth);
  const maxDay = parseInt(maxDate.split('-')[2], 10) || 28;

  const clampDay = (desiredDay: number): string => {
    const day = Math.min(desiredDay, maxDay);
    return `${yearMonth}-${String(day).padStart(2, '0')}`;
  };

  return [
    {
      id: `sample-1-${Date.now()}`,
      type: 'income',
      categoryId: findCat('income', 'משכורת'),
      amount: 16500,
      date: clampDay(1),
      description: 'משכורת חודשית הייטק',
    },
    {
      id: `sample-2-${Date.now()}`,
      type: 'expense',
      categoryId: findCat('expense', 'חשבונות וקבועים'),
      amount: 4800,
      date: clampDay(2),
      description: 'שכר דירה וועד בית',
    },
    {
      id: `sample-3-${Date.now()}`,
      type: 'expense',
      categoryId: findCat('expense', 'סופר וקניות לבית'),
      amount: 1450,
      date: clampDay(4),
      description: 'קנייה שבועית מרוכזת בסופר',
    },
    {
      id: `sample-4-${Date.now()}`,
      type: 'expense',
      categoryId: findCat('expense', 'דלק ונסיעות'),
      amount: 620,
      date: clampDay(6),
      description: 'תדלוק רכב ורב-קו',
    },
    {
      id: `sample-5-${Date.now()}`,
      type: 'income',
      categoryId: findCat('income', 'בונוס'),
      amount: 2200,
      date: clampDay(8),
      description: 'בונוס רבעוני על פרויקט',
    },
    {
      id: `sample-6-${Date.now()}`,
      type: 'expense',
      categoryId: findCat('expense', 'מסעדות ואוכל'),
      amount: 540,
      date: clampDay(10),
      description: 'ארוחת ערב זוגית והזמנת משלוח',
    },
    {
      id: `sample-7-${Date.now()}`,
      type: 'expense',
      categoryId: findCat('expense', 'שופינג'),
      amount: 890,
      date: clampDay(12),
      description: 'ביגוד חורף ונעליים',
    },
    {
      id: `sample-8-${Date.now()}`,
      type: 'expense',
      categoryId: findCat('expense', 'טיולים ובילויים'),
      amount: 750,
      date: clampDay(14),
      description: 'כרטיסים להופעה וטיול בצפון',
    },
    {
      id: `sample-9-${Date.now()}`,
      type: 'income',
      categoryId: findCat('income', 'החזרים'),
      amount: 380,
      date: clampDay(15),
      description: 'החזר ביטוח בריאות',
    },
    {
      id: `sample-10-${Date.now()}`,
      type: 'expense',
      categoryId: findCat('expense', 'חשבונות וקבועים'),
      amount: 680,
      date: clampDay(17),
      description: 'חשבון חשמל, מים ואינטרנט',
    },
  ];
}
