import React, { useState, useMemo } from 'react';
import { Wallet } from 'lucide-react';
import { Transaction } from './config/budgetConfig';
import {
  formatHebrewMonthYear,
  getCurrentYearMonth,
  isFutureYearMonth,
} from './utils/dateUtils';
import { generateSampleTransactions } from './utils/sampleData';
import { exportTransactionsToExcel } from './utils/exportExcel';
import { Header } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { ChartsSection } from './components/ChartsSection';
import { TransactionsTable } from './components/TransactionsTable';
import { AddTransactionDrawer } from './components/AddTransactionDrawer';
import { MonthSwitchModal } from './components/MonthSwitchModal';

export function App() {
  // Active month in YYYY-MM format (defaults to current month)
  const [selectedMonth, setSelectedMonth] = useState<string>(() =>
    getCurrentYearMonth()
  );

  // Zero persistence: transactions stored purely in React state for the active month
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Slide-over drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Pending month switch confirmation state
  const [pendingMonth, setPendingMonth] = useState<string | null>(null);

  // Derived totals
  const { totalIncome, totalExpenses } = useMemo(() => {
    return transactions.reduce(
      (acc, tx) => {
        if (tx.type === 'income') {
          acc.totalIncome += tx.amount;
        } else {
          acc.totalExpenses += tx.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpenses: 0 }
    );
  }, [transactions]);

  // Month switching handler with reset confirmation logic (blocks future months)
  const handleSelectMonth = (newMonth: string) => {
    if (newMonth === selectedMonth || isFutureYearMonth(newMonth)) return;

    if (transactions.length === 0) {
      setSelectedMonth(newMonth);
    } else {
      setPendingMonth(newMonth);
    }
  };

  const handleConfirmMonthSwitch = () => {
    if (pendingMonth) {
      setTransactions([]);
      setSelectedMonth(pendingMonth);
      setPendingMonth(null);
    }
  };

  const handleCancelMonthSwitch = () => {
    setPendingMonth(null);
  };

  // Add new transaction
  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    setTransactions((prev) => [transaction, ...prev]);
  };

  // Delete single transaction
  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  // Load sample data for the currently selected month
  const handleLoadSampleData = () => {
    const sample = generateSampleTransactions(selectedMonth);
    setTransactions(sample);
  };

  // Export to Excel
  const handleExportExcel = () => {
    exportTransactionsToExcel(transactions, selectedMonth);
  };

  // Trigger Print / PDF View
  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div dir="rtl" lang="he" className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Sticky Header (Hidden in Print Mode) */}
      <Header
        selectedMonth={selectedMonth}
        onSelectMonth={handleSelectMonth}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onExportExcel={handleExportExcel}
        onPrintPdf={handlePrintPdf}
        hasTransactions={transactions.length > 0}
      />

      {/* Dedicated A4 Print Report Header (Visible ONLY in Print Mode) */}
      <div className="hidden print-only border-b-2 border-slate-800 pb-4 mb-6 px-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">
                דוח תקציב חודשי - הכנסות והוצאות
              </h1>
              <p className="text-sm font-semibold text-slate-600">
                חודש דיווח: {formatHebrewMonthYear(selectedMonth)}
              </p>
            </div>
          </div>
          <div className="text-left text-xs text-slate-500">
            <p>הופק בתאריך: {new Date().toLocaleDateString('he-IL')}</p>
            <p>מספר תנועות: {transactions.length}</p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* 1. KPI Summary Cards */}
        <KpiCards
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
        />

        {/* 2. Charts Section (Donut + Bar Chart) */}
        <ChartsSection
          transactions={transactions}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
        />

        {/* 3. Detailed Transactions Table */}
        <TransactionsTable
          transactions={transactions}
          selectedMonth={selectedMonth}
          onDeleteTransaction={handleDeleteTransaction}
          onLoadSampleData={handleLoadSampleData}
          onOpenDrawer={() => setIsDrawerOpen(true)}
        />
      </main>

      {/* Side Slide-Over Drawer for Adding Transactions */}
      <AddTransactionDrawer
        isOpen={isDrawerOpen}
        selectedMonth={selectedMonth}
        onClose={() => setIsDrawerOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      {/* Month Switch Reset Confirmation Modal */}
      <MonthSwitchModal
        isOpen={pendingMonth !== null}
        targetMonth={pendingMonth}
        onConfirm={handleConfirmMonthSwitch}
        onCancel={handleCancelMonthSwitch}
      />
    </div>
  );
}

export default App;
