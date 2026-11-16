import React from 'react';
import { Search, AlertTriangle, CheckCircle2, ListFilter } from 'lucide-react';

interface ReportFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedStatus: 'all' | 'out_of_range' | 'normal';
  onStatusChange: (status: 'all' | 'out_of_range' | 'normal') => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  totalCount: number;
  outOfRangeCount: number;
  normalCount: number;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  categories,
  totalCount,
  outOfRangeCount,
  normalCount
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search test name (e.g. Platelet, Hb)..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 hover:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-xs sm:text-sm text-slate-800"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => onStatusChange('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              selectedStatus === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>All Tests</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-extrabold">
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => onStatusChange('out_of_range')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              selectedStatus === 'out_of_range'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Outside Range</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
              selectedStatus === 'out_of_range' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'
            }`}>
              {outOfRangeCount}
            </span>
          </button>

          <button
            onClick={() => onStatusChange('normal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              selectedStatus === 'normal'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Within Range</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
              selectedStatus === 'normal' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {normalCount}
            </span>
          </button>
        </div>
      </div>

      {/* Category Pills (if more than 1 category exists) */}
      {categories.length > 1 && (
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 flex-shrink-0">
            <ListFilter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>

          <button
            onClick={() => onCategoryChange('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-brand-50 text-brand-800 border border-brand-300 font-bold'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-brand-50 text-brand-800 border border-brand-300 font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
