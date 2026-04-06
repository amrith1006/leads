import React from 'react'
import { Search, Filter, ChevronDown, X } from 'lucide-react'

const Filters = ({ filters, setFilters, sources, employees, statuses }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const clearFilters = () => {
    setFilters({ source: '', employee: '', status: '', search: '' })
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return (
    <div className="p-4 bg-white border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
      
      {/* Left: Selects */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-2 text-slate-500 mr-2">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-semibold">Filters:</span>
        </div>

        {/* Lead Source */}
        <div className="relative group">
          <select 
            name="source"
            value={filters.source}
            onChange={handleChange}
            className="appearance-none pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="">Lead Source</option>
            {sources.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Employee */}
        <div className="relative group">
          <select 
            name="employee"
            value={filters.employee}
            onChange={handleChange}
            className="appearance-none pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="">Employee</option>
            {employees.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Status */}
        <div className="relative group">
          <select 
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="appearance-none pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="">Status</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Right: Search */}
      <div className="relative w-full md:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search customers or phones..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

    </div>
  )
}

export default Filters
