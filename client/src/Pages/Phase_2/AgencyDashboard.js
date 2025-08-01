import React from 'react';
import { 
  FaUsers, 
  FaMoneyBillWave, 
  FaComments, 
  FaClipboardList, 
  FaHeart, 
  FaChartLine,
  FaCheckCircle
} from 'react-icons/fa';

// Progress Card Component
const ProgressCard = ({ title, value, target, color }) => {
  const percentage = Math.min(Math.round((value / target) * 100), 100);
  const colorClasses = {
    primary: 'bg-blue-100 text-blue-600',
    secondary: 'bg-purple-100 text-purple-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    info: 'bg-cyan-100 text-cyan-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <h2 className="text-3xl font-bold mb-4">
        {value} <span className="text-lg text-gray-500">/ {target}</span>
      </h2>
      <div className="flex items-center">
        <div className="w-full mr-2">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${colorClasses[color]}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        <span className="text-sm text-gray-500">{percentage}%</span>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    primary: 'bg-blue-100 text-blue-600',
    secondary: 'bg-purple-100 text-purple-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    info: 'bg-cyan-100 text-cyan-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full min-w-[250px]">
      <div className="flex items-center">
        <div className={`rounded-full w-14 h-14 flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="text-xl" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <h2 className="text-3xl font-bold">{value}</h2>
        </div>
        {trend && (
          <div className={`text-sm font-medium ${
            trend.value > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <div className="flex items-center">
              {trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
              <span className="text-xs text-gray-500 ml-1">{trend.label}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Mini Stats Card Component
const MiniStatsCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    primary: 'bg-blue-100 text-blue-600',
    secondary: 'bg-purple-100 text-purple-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    info: 'bg-cyan-100 text-cyan-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <div className="flex items-center">
        <div className={`rounded-full w-10 h-10 flex items-center justify-center ${colorClasses[color]} mr-3`}>
          <Icon className="text-lg" />
        </div>
        <div>
          <h3 className="text-xs font-medium text-gray-500">{title}</h3>
          <h2 className="text-xl font-bold">{value}</h2>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const AgencyDashboard = () => {
  // Sample data
  const statsData = {
    totalClients: 124,
    activeConversations: 28,
    pendingForms: 12,
    successfulMatches: 56,
    monthlyRevenue: 125000,
    conversionRate: 68
  };

  const trends = {
    clients: { value: 12, label: 'vs last month' },
    revenue: { value: 8, label: 'vs last month' },
    matches: { value: 5, label: 'vs last month' }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Agency Dashboard</h1>
      
      {/* First Row - Mini Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="col-span-1">
          <ProgressCard
            title="Monthly Target"
            value={85}
            target={120}
            color="primary"
          />
        </div>
        <div className="col-span-1">
          <MiniStatsCard
            title="New Today"
            value={7}
            icon={FaUsers}
            color="info"
          />
        </div>
        <div className="col-span-1">
          <MiniStatsCard
            title="Pending"
            value={14}
            icon={FaClipboardList}
            color="warning"
          />
        </div>
        <div className="col-span-1">
          <MiniStatsCard
            title="Completed"
            value={23}
            icon={FaCheckCircle}
            color="success"
          />
        </div>
        <div className="col-span-1">
          <MiniStatsCard
            title="Revenue Today"
            value="₹8,500"
            icon={FaMoneyBillWave}
            color="secondary"
          />
        </div>
      </div>
      
      {/* Second Row - Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Clients"
          value={statsData.totalClients}
          icon={FaUsers}
          color="primary"
          trend={trends.clients}
        />
        
        <StatsCard
          title="Active Conversations"
          value={statsData.activeConversations}
          icon={FaComments}
          color="info"
        />
        
        <StatsCard
          title="Pending Forms"
          value={statsData.pendingForms}
          icon={FaClipboardList}
          color="warning"
        />
        
        <StatsCard
          title="Successful Matches"
          value={statsData.successfulMatches}
          icon={FaHeart}
          color="success"
          trend={trends.matches}
        />
        
        <StatsCard
          title="Monthly Revenue"
          value={`₹${statsData.monthlyRevenue.toLocaleString()}`}
          icon={FaMoneyBillWave}
          color="secondary"
          trend={trends.revenue}
        />
        
        <StatsCard
          title="Conversion Rate"
          value={`${statsData.conversionRate}%`}
          icon={FaChartLine}
          color="success"
        />
      </div>
    </div>
  );
};

export default AgencyDashboard;