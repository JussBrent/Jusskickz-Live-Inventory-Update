import React from 'react';
import { Search } from 'lucide-react';

export default function FilterBar({ filter, setFilter, searchTerm, setSearchTerm }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search by brand, model, or colorway..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2">
        {['all', 'available', 'sold'].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-4 py-3 rounded-lg font-medium transition-all capitalize ${
              filter === filterType
                ? 'bg-blue-500 text-white'
                : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-700 text-white'
            }`}
          >
            {filterType}
          </button>
        ))}
      </div>
    </div>
  );
}