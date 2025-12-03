import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { Users, DollarSign, Sandwich, TrendingUp, Sparkles } from 'lucide-react';
import { Donor, Donation } from '../types';
import { SANDWICHES_PER_THOUSAND } from '../constants';
import { generateStrategicInsight } from '../services/geminiService';

interface DashboardProps {
  donors: Donor[];
  donations: Donation[];
}

const Dashboard: React.FC<DashboardProps> = ({ donors, donations }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // --- Metrics Calculation ---
  const totalRaised = useMemo(() => donations.reduce((sum, d) => sum + d.amount, 0), [donations]);
  const sandwichImpact = Math.floor((totalRaised / 1000) * SANDWICHES_PER_THOUSAND);
  const totalDonors = donors.length;
  const avgDonation = totalRaised / donations.length || 0;
  
  // Identify recurring donors (more than 1 gift)
  const recurringDonorsCount = donors.filter(d => d.giftCount > 1).length;

  // Chart Data: Donations by Month (Last 6 months)
  const chartData = useMemo(() => {
    const months: Record<string, number> = {};
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = d.toLocaleString('default', { month: 'short' });
      months[key] = 0;
    }

    donations.forEach(d => {
      const date = new Date(d.date);
      // Simple filter for last 6 months approx
      const monthKey = date.toLocaleString('default', { month: 'short' });
      if (months[monthKey] !== undefined) {
        months[monthKey] += d.amount;
      }
    });

    return Object.entries(months).map(([name, amount]) => ({ name, amount }));
  }, [donations]);

  const handleGetInsight = async () => {
    setLoadingInsight(true);
    const metricsSummary = `
      Total Donors: ${totalDonors}
      Recurring Donors: ${recurringDonorsCount}
      Total Raised: $${totalRaised}
      Total Donations Count: ${donations.length}
      Avg Donation: $${avgDonation.toFixed(2)}
    `;
    const result = await generateStrategicInsight(metricsSummary);
    setInsight(result);
    setLoadingInsight(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mission Control</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of TSP fundraising impact.</p>
        </div>
        <button 
          onClick={handleGetInsight}
          disabled={loadingInsight}
          className="mt-4 md:mt-0 flex items-center space-x-2 bg-gradient-to-r from-tsp-600 to-tsp-500 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70"
        >
          {loadingInsight ? (
             <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Sparkles size={16} />
          )}
          <span>{loadingInsight ? 'Analyzing...' : 'Generate AI Strategy'}</span>
        </button>
      </div>

      {/* AI Insight Panel */}
      {insight && (
        <div className="bg-white border border-indigo-100 rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            <h3 className="text-indigo-900 font-semibold flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-indigo-500" />
                Strategic Insights
            </h3>
            <div className="prose prose-sm text-gray-600 max-w-none whitespace-pre-line">
                {insight}
            </div>
            <button 
                onClick={() => setInsight(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
                ✕
            </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Total Raised" 
          value={`$${totalRaised.toLocaleString()}`} 
          icon={<DollarSign className="text-tsp-600" size={24} />}
          subtext="Since June 2023"
        />
        <KPICard 
          title="Sandwich Impact" 
          value={sandwichImpact.toLocaleString()} 
          icon={<Sandwich className="text-orange-500" size={24} />}
          subtext="~760 per $1k"
        />
        <KPICard 
          title="Total Donors" 
          value={totalDonors.toString()} 
          icon={<Users className="text-blue-500" size={24} />}
          subtext={`${recurringDonorsCount} Recurring`}
        />
        <KPICard 
          title="Avg. Gift" 
          value={`$${avgDonation.toFixed(0)}`} 
          icon={<TrendingUp className="text-purple-500" size={24} />}
          subtext="Per transaction"
        />
      </div>

      {/* Main Chart Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Donation Trends</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }} 
                tickFormatter={(val) => `$${val}`}
              />
              <RechartsTooltip 
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#22c55e" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, icon, subtext }: { title: string; value: string; icon: React.ReactNode; subtext: string }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
    </div>
    <p className="text-xs text-gray-400 mt-3">{subtext}</p>
  </div>
);

export default Dashboard;