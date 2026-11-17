import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import {
  APP_CONFIG,
  CATEGORIES,
  TRANSACTION_TYPES,
  Transaction,
  formatCurrency,
} from '../config/budgetConfig';

interface ChartsSectionProps {
  transactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
}

interface ExpenseSlice {
  categoryId: string;
  name: string;
  value: number;
  color: string;
  percentage: number;
}

const CustomPieTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ExpenseSlice }[];
}) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;

  return (
    <div
      dir="rtl"
      className="bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl p-3 shadow-lg text-right"
    >
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: data.color }}
        />
        <span className="font-bold text-slate-800 text-sm">{data.name}</span>
      </div>
      <div className="mt-1.5 flex items-baseline justify-between gap-4 text-xs text-slate-600">
        <span className="font-extrabold text-slate-900 text-sm">
          {formatCurrency(data.value)}
        </span>
        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md font-semibold">
          {data.percentage.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

const CustomBarTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { name: string; amount: number; color: string } }[];
}) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;

  return (
    <div
      dir="rtl"
      className="bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl p-3 shadow-lg text-right"
    >
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: data.color }}
        />
        <span className="font-bold text-slate-800 text-sm">{data.name}</span>
      </div>
      <p className="mt-1 font-extrabold text-slate-900 text-sm">
        {formatCurrency(data.amount)}
      </p>
    </div>
  );
};

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  transactions,
  totalIncome,
  totalExpenses,
}) => {
  const expenseSlices: ExpenseSlice[] = React.useMemo(() => {
    if (totalExpenses <= 0) return [];

    const expenseCategories = CATEGORIES.filter((c) => c.type === 'expense');
    const grouped = new Map<string, number>();

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        grouped.set(t.categoryId, (grouped.get(t.categoryId) || 0) + t.amount);
      });

    const slices: ExpenseSlice[] = [];
    expenseCategories.forEach((cat) => {
      const value = grouped.get(cat.id) || 0;
      if (value > 0) {
        slices.push({
          categoryId: cat.id,
          name: cat.label,
          value,
          color: cat.color,
          percentage: (value / totalExpenses) * 100,
        });
      }
    });

    return slices.sort((a, b) => b.value - a.value);
  }, [transactions, totalExpenses]);

  const comparisonData = React.useMemo(
    () => [
      {
        name: TRANSACTION_TYPES.income.label,
        amount: totalIncome,
        color: TRANSACTION_TYPES.income.color,
      },
      {
        name: TRANSACTION_TYPES.expense.label,
        amount: totalExpenses,
        color: TRANSACTION_TYPES.expense.color,
      },
    ],
    [totalIncome, totalExpenses]
  );

  return (
    <section
      aria-label="תרשימים וניתוח נתונים"
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* Donut Chart: Expenses by Category */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs print-card flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <PieChartIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                התפלגות הוצאות לפי קטגוריה
              </h2>
              <p className="text-xs text-slate-500">
                פילוח אחוזים וסכומים מתוך סך ההוצאות
              </p>
            </div>
          </div>
        </div>

        {expenseSlices.length === 0 ? (
          <div className="flex-1 min-h-[280px] flex flex-col items-center justify-center text-center p-6 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
            <PieChartIcon className="w-10 h-10 text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-600">
              אין הוצאות להצגה בחודש זה
            </p>
            <p className="text-xs text-slate-400 mt-1">
              הוסף הוצאה חדשה כדי לראות את התפלגות הקטגוריות
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between gap-4">
            <div className="h-64 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseSlices}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={92}
                    paddingAngle={3}
                    label={({ percentage }) => `${Math.round(percentage)}%`}
                    labelLine={false}
                  >
                    {expenseSlices.map((entry) => (
                      <Cell
                        key={entry.categoryId}
                        fill={entry.color}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category Legend with exact amounts and percentages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              {expenseSlices.map((slice) => (
                <div
                  key={slice.categoryId}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50/80 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="font-medium text-slate-700 truncate">
                      {slice.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 mr-2">
                    <span className="font-bold text-slate-900">
                      {formatCurrency(slice.value)}
                    </span>
                    <span className="text-slate-500 font-semibold">
                      ({Math.round(slice.percentage)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bar Chart: Income vs Expenses */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs print-card flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                השוואת הכנסות מול הוצאות
              </h2>
              <p className="text-xs text-slate-500">
                סיכום חודשי כולל בשקלים ({APP_CONFIG.currencySymbol})
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-[280px] flex flex-col justify-between">
          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonData}
                margin={{ top: 16, right: 24, left: 16, bottom: 8 }}
                barSize={64}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#334155', fontSize: 13, fontWeight: 600 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(val: number) =>
                    `${APP_CONFIG.currencySymbol}${val.toLocaleString(APP_CONFIG.locale)}`
                  }
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={75}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  content={<CustomBarTooltip />}
                />
                <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
                  {comparisonData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            {comparisonData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50/80"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-semibold text-slate-600">
                    {item.name}
                  </span>
                </div>
                <span
                  className="text-sm font-extrabold"
                  style={{ color: item.color }}
                >
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
