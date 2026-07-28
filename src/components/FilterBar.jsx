import React from 'react';
import { Search, Layers, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function FilterBar({ 
  currentFilter, 
  onFilterChange, 
  searchQuery, 
  onSearchChange,
  totalCount,
  overdueCount,
  dueSoonCount,
  completedCount
}) {
  const filters = [
    { id: 'ALL', label: 'Tất cả', count: totalCount, icon: Layers },
    { id: 'DUE_SOON', label: 'Sắp đến hạn', count: dueSoonCount, icon: Clock, color: 'text-amber-600' },
    { id: 'OVERDUE', label: 'Quá hạn', count: overdueCount, icon: AlertTriangle, color: 'text-red-600' },
    { id: 'COMPLETED', label: 'Đã hoàn thành', count: completedCount, icon: CheckCircle2, color: 'text-emerald-600' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mb-6">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border-2 border-gray-300 shadow-md">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {filters.map((f) => {
            const Icon = f.icon;
            const isActive = currentFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => onFilterChange(f.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all duration-150 border-2 ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : f.color || ''}`} />
                <span>{f.label}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-300 text-gray-900'
                }`}>
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2.5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm công việc..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl text-xs sm:text-sm font-bold text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-blue-600 transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
