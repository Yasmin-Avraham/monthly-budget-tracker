export const HEBREW_MONTHS = [
  'ינואר',
  'פברואר',
  'מרץ',
  'אפריל',
  'מאי',
  'יוני',
  'יולי',
  'אוגוסט',
  'ספטמבר',
  'אוקטובר',
  'נובמבר',
  'דצמבר',
];

/**
 * Returns today's date in YYYY-MM-DD format based on local time.
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns the current month in YYYY-MM format based on local time.
 */
export function getCurrentYearMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Checks if a given YYYY-MM is in the future relative to the real-world current month.
 */
export function isFutureYearMonth(yearMonth: string): boolean {
  return yearMonth > getCurrentYearMonth();
}

/**
 * Formats YYYY-MM into Hebrew Month + Year (e.g., "נובמבר 2026").
 */
export function formatHebrewMonthYear(yearMonth: string): string {
  const [yearStr, monthStr] = yearMonth.split('-');
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1;
  if (isNaN(year) || monthIndex < 0 || monthIndex > 11) {
    return yearMonth;
  }
  return `${HEBREW_MONTHS[monthIndex]} ${year}`;
}

/**
 * Returns the allowed date bounds (minDate, maxDate) as YYYY-MM-DD for a given YYYY-MM.
 * If yearMonth is the current active real-world month, maxDate is capped to today's date.
 */
export function getMonthDateBounds(yearMonth: string): { minDate: string; maxDate: string } {
  const [yearStr, monthStr] = yearMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const lastDay = new Date(year, month, 0).getDate();
  const minDate = `${yearStr}-${monthStr}-01`;
  const endOfMonthDate = `${yearStr}-${monthStr}-${String(lastDay).padStart(2, '0')}`;

  const currentYearMonth = getCurrentYearMonth();
  if (yearMonth === currentYearMonth) {
    const todayStr = getTodayDateString();
    return {
      minDate,
      maxDate: todayStr < endOfMonthDate ? todayStr : endOfMonthDate,
    };
  }

  return { minDate, maxDate: endOfMonthDate };
}

/**
 * Returns default date for the form: today if inside the selected month, otherwise 1st of selected month.
 */
export function getDefaultDateForMonth(yearMonth: string): string {
  const todayYearMonth = getCurrentYearMonth();
  if (todayYearMonth === yearMonth) {
    return getTodayDateString();
  }
  return `${yearMonth}-01`;
}

/**
 * Checks whether a YYYY-MM-DD date string strictly falls within the allowed bounds of the given YYYY-MM month
 * (including not exceeding today's date when in the current month).
 */
export function isDateInMonth(dateStr: string, yearMonth: string): boolean {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  if (!dateStr.startsWith(`${yearMonth}-`)) return false;
  const { minDate, maxDate } = getMonthDateBounds(yearMonth);
  return dateStr >= minDate && dateStr <= maxDate;
}

/**
 * Formats YYYY-MM-DD to DD/MM/YYYY.
 */
export function formatDateDisplay(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

/**
 * Generates a list of selectable months up to and including the current real-world month only.
 * Future months beyond the current month are strictly excluded.
 */
export function generateSelectableMonths(): { value: string; label: string }[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1..12
  const startYear = currentYear - 4;
  const options: { value: string; label: string }[] = [];

  for (let y = startYear; y <= currentYear; y++) {
    const maxMonthForYear = y === currentYear ? currentMonth : 12;
    for (let m = 1; m <= maxMonthForYear; m++) {
      const ym = `${y}-${String(m).padStart(2, '0')}`;
      options.push({
        value: ym,
        label: formatHebrewMonthYear(ym),
      });
    }
  }
  return options;
}

/**
 * Shift YYYY-MM by delta months (-1 for previous, +1 for next).
 */
export function shiftYearMonth(yearMonth: string, delta: number): string {
  const [yearStr, monthStr] = yearMonth.split('-');
  const date = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1 + delta, 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}
