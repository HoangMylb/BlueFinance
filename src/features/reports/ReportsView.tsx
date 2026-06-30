import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { formatCurrency } from '../../lib/utils';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';

// Soft palette mapping for category slice colors
const TAILWIND_COLORS: Record<string, string> = {
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  indigo: '#6366f1',
  purple: '#a855f7',
  violet: '#8b5cf6',
  rose: '#f43f5e',
  red: '#ef4444',
  amber: '#f59e0b',
  blue: '#3b82f6',
  orange: '#f97316',
  slate: '#64748b',
};

export default function ReportsView() {
  const transactions = useAppSelector((state) => state.finance.transactions);
  const categories = useAppSelector((state) => state.finance.categories);

  const expensesOnly = transactions.filter(t => t.type === 'expense');
  const totalExpenses = expensesOnly.reduce((sum, t) => sum + t.amount, 0);

  // Group expenses by category
  const categoryDataRawMap: Record<string, number> = {};
  expensesOnly.forEach(t => {
    categoryDataRawMap[t.categoryId] = (categoryDataRawMap[t.categoryId] || 0) + t.amount;
  });

  const pieChartData = Object.keys(categoryDataRawMap).map(catId => {
    const cat = categories.find(c => c.id === catId) || { name: 'Uncategorized', color: 'slate' };
    return {
      name: cat.name,
      value: categoryDataRawMap[catId],
      color: TAILWIND_COLORS[cat.color] || '#64748b'
    };
  });

  // Income vs Expense by Month (group transactions by month)
  const monthlyDataMap: Record<string, { income: number; expense: number }> = {};
  transactions.forEach(t => {
    const month = t.date.substring(0, 7); // YYYY-MM
    if (!monthlyDataMap[month]) {
      monthlyDataMap[month] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      monthlyDataMap[month].income += t.amount;
    } else {
      monthlyDataMap[month].expense += t.amount;
    }
  });

  const barChartData = Object.keys(monthlyDataMap)
    .sort()
    .map(month => {
      // Format YYYY-MM into "Month YY"
      const [year, m] = month.split('-');
      const date = new Date(parseInt(year), parseInt(m) - 1, 1);
      const label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      return {
        month: label,
        Income: monthlyDataMap[month].income,
        Expense: monthlyDataMap[month].expense
      };
    });

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-[10px] font-bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div className="space-y-6">
      {/* View Header Bar */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Financial Reports & Insights</h1>
        <p className="text-[10px] text-slate-400">Examine visual breakdowns of spending distributions and monthly cashflow trends.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Category Breakdown Pie */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm h-[360px] flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Expense Allocation</h3>
            <p className="text-[10px] text-slate-400">Categorical share of total outflows ({formatCurrency(totalExpenses)})</p>
          </div>
          
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-4 min-h-0">
            {pieChartData.length > 0 ? (
              <>
                {/* Pie Canvas */}
                <div className="w-48 h-48 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legends Grid */}
                <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] max-h-40 overflow-y-auto">
                  {pieChartData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-slate-600 dark:text-slate-400 truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-slate-400 text-xs py-10">
                Record ledger expense transactions to populate allocation details.
              </div>
            )}
          </div>
        </div>

        {/* Monthly Income vs Expense Bars */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm h-[360px] flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Historical Cashflow</h3>
            <p className="text-[10px] text-slate-400">Monthly comparing total deposits against total debits</p>
          </div>

          <div className="flex-1 min-h-0 mt-4 w-full">
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800/30" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-400 text-xs py-10 flex items-center justify-center h-full">
                Record transactional ledger events to draw comparisons.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
