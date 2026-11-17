export type TransactionTypeId = 'income' | 'expense';

export interface TransactionTypeConfig {
  id: TransactionTypeId;
  label: string;
  color: string;
}

export interface CategoryConfig {
  id: string;
  label: string;
  type: TransactionTypeId;
  color: string;
}

export interface Transaction {
  id: string;
  type: TransactionTypeId;
  categoryId: string;
  amount: number;
  date: string; // YYYY-MM-DD
  description?: string;
}

export const TRANSACTION_TYPES: Record<TransactionTypeId, TransactionTypeConfig> = {
  income: {
    id: 'income',
    label: 'הכנסה',
    color: '#10b981',
  },
  expense: {
    id: 'expense',
    label: 'הוצאה',
    color: '#f43f5e',
  },
};

export const CATEGORIES: CategoryConfig[] = [
  // Income categories (distinct green/teal shades)
  { id: 'inc-salary', label: 'משכורת', type: 'income', color: '#059669' },
  { id: 'inc-bonus', label: 'בונוס', type: 'income', color: '#10b981' },
  { id: 'inc-gifts', label: 'מתנות', type: 'income', color: '#14b8a6' },
  { id: 'inc-refunds', label: 'החזרים', type: 'income', color: '#0d9488' },
  { id: 'inc-other', label: 'אחר', type: 'income', color: '#34d399' },

  // Expense categories (distinct, accessible chart colors)
  { id: 'exp-food', label: 'מסעדות ואוכל', type: 'expense', color: '#f43f5e' },
  { id: 'exp-groceries', label: 'סופר וקניות לבית', type: 'expense', color: '#f97316' },
  { id: 'exp-shopping', label: 'שופינג', type: 'expense', color: '#8b5cf6' },
  { id: 'exp-transport', label: 'דלק ונסיעות', type: 'expense', color: '#0ea5e9' },
  { id: 'sports', label: 'ספורט וכושר', type: 'expense', color: '#06b6d4' },
  { id: 'charity', label: 'צדקה', type: 'expense', color: '#6ae474' },
  { id: 'exp-leisure', label: 'טיולים ובילויים', type: 'expense', color: '#ec4899' },
  { id: 'exp-bills', label: 'חשבונות וקבועים', type: 'expense', color: '#eab308' },
  { id: 'exp-other', label: 'אחר', type: 'expense', color: '#64748b' },
];

export const APP_CONFIG = {
  currencySymbol: '₪',
  locale: 'he-IL',
  sessionNotice: 'הנתונים נשמרים זמנית בדפדפן ויימחקו בסגירת החלון או בהחלפת חודש',
  monthSwitchConfirmText: 'החלפת חודש תמחק את כל הנתונים שהוזנו בחודש הנוכחי. האם להמשיך?',
  excelFilePrefix: 'תקציב_חודשי',
} as const;

export function getCategoryById(categoryId: string): CategoryConfig | undefined {
  return CATEGORIES.find((cat) => cat.id === categoryId);
}

export function getCategoriesByType(type: TransactionTypeId): CategoryConfig[] {
  return CATEGORIES.filter((cat) => cat.type === type);
}

export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat(APP_CONFIG.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
  return amount < 0
    ? `-${APP_CONFIG.currencySymbol}${formatted}`
    : `${APP_CONFIG.currencySymbol}${formatted}`;
}
