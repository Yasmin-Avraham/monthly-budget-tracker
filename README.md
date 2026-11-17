# ניהול תקציב חודשי — Monthly Budget Tracker (`monthly-budget-tracker`)

A modern, responsive, client-side web application for tracking monthly personal income and expenses, featuring a full Hebrew interface and Right-to-Left (`RTL`) support.

---

## ✨ Key Features

- **Full Hebrew & RTL Experience (`dir="rtl"`, `lang="he"`):** Designed natively for Hebrew typography (`Heebo` font), currency formatting (`₪`), and right-to-left layouts.
- **Single Source of Truth Configuration (`src/config/budgetConfig.ts`):**
  - Centralizes transaction types (`הכנסה` / `הוצאה`), categories, accessible chart colors, currency symbol, locale, and UI notifications.
  - All dropdowns, category badges, charts, and Excel exports dynamically pull from this configuration.
- **Zero-Persistence Session Privacy:**
  - Data is stored purely in React state (`Transaction[]`) for the currently active month only—no backend, database, or `localStorage` caching.
  - Switching months when transactions exist triggers a confirmation modal before resetting the current month's state.
- **Strict Month & Date Locking:**
  - The header month selector allows choosing the current month or past months only (future months beyond the real-world current month are blocked).
  - The transaction date picker strictly locks selectable dates to the selected month, and caps the maximum selectable date to **today** when viewing the current active month.
- **Interactive Dashboard & Visual Analytics:**
  - **KPI Summary Cards:** Total Income (`סך הכנסות`), Total Expenses (`סך הוצאות`), and Monthly Net Balance (`מאזן חודשי נטו`) with automatic savings rate percentage (`אחוז חיסכון`).
  - **Recharts Visualizations:**
    - **Expenses Breakdown Donut Chart (`התפלגות הוצאות לפי קטגוריה`):** Displays category percentages, custom RTL tooltips, and a detailed category legend.
    - **Income vs. Expenses Bar Chart (`השוואת הכנסות מול הוצאות`):** Visualizes monthly cash flow balance.
  - **Detailed Transactions Table:** Filter by All (`הכל`), Income (`הכנסות`), or Expenses (`הוצאות`), sort by Date or Amount, delete individual rows, or load sample data (`טען נתוני דוגמה`) with one click.
- **Export & Reporting:**
  - **Excel Export (`ייצוא לאקסל`):** Generates a right-to-left `.xlsx` workbook (`תקציב_חודשי_<YYYY-MM>.xlsx`) using SheetJS (`xlsx`) containing a monthly summary block and a chronologically sorted transactions table.
  - **Print / PDF View (`תצוגת PDF / הדפסה`):** Dedicated `@media print` stylesheet that hides interactive controls and formats the dashboard into a clean A4 report.

---

## 🛠️ Tech Stack

- **Framework:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Excel Export:** [SheetJS (`xlsx`)](https://sheetjs.com/)

---

## 📁 Project Structure

```text
├── index.html                        # Root HTML with dir="rtl" and lang="he"
├── package.json                      # Dependencies and scripts
├── tailwind.config.js                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── vite.config.ts                    # Vite bundler configuration
└── src/
    ├── main.tsx                      # Application entry point
    ├── App.tsx                       # Root state management & layout
    ├── index.css                     # Tailwind directives & @media print styles
    ├── config/
    │   └── budgetConfig.ts           # Single Source of Truth (types, categories, colors, labels)
    ├── components/
    │   ├── Header.tsx                # Top bar, session banner, month selector & actions
    │   ├── KpiCards.tsx              # 3-column summary cards (Income, Expenses, Net Balance)
    │   ├── ChartsSection.tsx         # Recharts Donut & Bar charts
    │   ├── TransactionsTable.tsx     # Filterable, sortable transactions table & empty state
    │   ├── AddTransactionDrawer.tsx  # Slide-over drawer form with date & amount validation
    │   └── MonthSwitchModal.tsx      # Confirmation modal when changing months with active data
    └── utils/
        ├── dateUtils.ts              # Hebrew month formatting & strict date range helpers
        ├── exportExcel.ts            # RTL Excel (.xlsx) workbook generator
        └── sampleData.ts             # Sample transactions generator for quick testing
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or newer recommended)
- **npm**

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## ⚙️ Customizing Categories & Settings

To add, edit, or recolor income/expense categories, update `CATEGORIES` in [`src/config/budgetConfig.ts`](./src/config/budgetConfig.ts):

```ts
export const CATEGORIES: CategoryConfig[] = [
  // Income categories
  { id: 'inc-salary', label: 'משכורת', type: 'income', color: '#059669' },
  // ...
  // Expense categories
  { id: 'sports', label: 'ספורט וכושר', type: 'expense', color: '#06b6d4' },
  // ...
];
```

All UI components, charts, and Excel exports will automatically reflect the changes.
