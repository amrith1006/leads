import React, { useState, useEffect, useCallback } from 'react'
import Header from '../components/Header'
import KpiCards from '../components/KpiCards'
import ChartsSection from '../components/ChartsSection'
import Filters from '../components/Filters'
import DataTable from '../components/DataTable'
import DetailPanel from '../components/DetailPanel'
import { getDashboardStats, getLeads } from '../services/api'

const Dashboard = ({ user, onLogout }) => {
  const [selectedLead, setSelectedLead] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  
  // Dashboard Data State
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  })

  const [stats, setStats] = useState({
    total_leads: 0,
    status_breakdown: {},
    source_breakdown: {},
    employee_breakdown: {},
  })
  
  const [leads, setLeads] = useState([])
  const [filters, setFilters] = useState({
    source: '',
    employee: '',
    status: '',
    search: '',
  })

  // Fetch Dashboard Statistics (KPIs and Charts)
  const fetchStats = useCallback(async () => {
    try {
      const data = await getDashboardStats(dateRange.from, dateRange.to)
      setStats(data)
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
      setError('Could not load dashboard statistics.')
    }
  }, [dateRange.from, dateRange.to])

  // Fetch Filtered Leads List
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getLeads({
        status: filters.status,
        source: filters.source,
        search: filters.search,
        date_from: dateRange.from,
        date_to: dateRange.to
      })
      setLeads(data.leads || [])
    } catch (err) {
      console.error('Error fetching leads:', err)
      setError('Could not load leads.')
    } finally {
      setLoading(false)
    }
  }, [filters.status, filters.source, filters.search, dateRange.from, dateRange.to])

  const handleFileUpload = async (file) => {
    try {
      setUploading(true)
      setError(null)
      const result = await import('../services/api').then(m => m.uploadLeads(file))
      alert(`✅ Success: ${result.message}`)
      // Refresh everything
      await fetchStats()
      await fetchLeads()
    } catch (err) {
      console.error('Upload error:', err)
      setError(`Upload failed: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleDateChange = (from, to) => {
    setDateRange({ from, to })
  }

  // Initial Data Fetch & Refresh on date change
  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // Refetch leads when filters or date change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLeads()
    }, 300) // Debounce search changes
    return () => clearTimeout(timeoutId)
  }, [fetchLeads])

  const handleRowClick = (lead) => {
    setSelectedLead(lead)
    setIsPanelOpen(true)
  }

  const handleClosePanel = () => {
    setIsPanelOpen(false)
  }

  // Format data for KPI Cards
  const kpiCardsData = [
    { id: 1, label: 'Total Leads', value: stats.total_leads.toLocaleString(), icon: 'Phone', trend: 'Selected Range', color: 'blue' },
    { id: 2, label: 'Interested', value: (stats.status_breakdown['Interested'] || stats.status_breakdown['interested'] || 0).toLocaleString(), icon: 'CheckCircle', trend: 'Status', color: 'green' },
    { id: 3, label: 'New Leads', value: (stats.status_breakdown['New'] || stats.status_breakdown['first call'] || 0).toLocaleString(), icon: 'Clock', trend: 'Status', color: 'orange' },
    { id: 4, label: 'Qualified', value: (stats.status_breakdown['Qualified'] || stats.status_breakdown['assigned to branch'] || 0).toLocaleString(), icon: 'Percent', trend: 'Status', color: 'purple' },
    { id: 5, label: 'Lead Sources', value: Object.keys(stats.source_breakdown).length.toLocaleString(), icon: 'MapPin', trend: 'Sources', color: 'indigo' },
  ]

  // Format data for Charts
  const chartsData = {
    employeeCalls: Object.entries(stats.employee_breakdown).map(([name, count]) => ({
      name, calls: count
    })).sort((a, b) => b.calls - a.calls).slice(0, 5),
    statusDistribution: Object.entries(stats.status_breakdown).map(([name, value], index) => ({
      name, 
      value,
      color: ['#3B82F6', '#6366F1', '#10B981', '#EF4444', '#F59E0B'][index % 5]
    }))
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Header 
        user={user} 
        onLogout={onLogout} 
        onRefresh={() => { fetchStats(); fetchLeads(); }} 
        onFileUpload={handleFileUpload}
        onExport={() => import('../services/api').then(m => m.exportLeads())}
        onDateChange={handleDateChange}
      />
      
      {uploading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-800 font-bold">Uploading & Merging Excel...</p>
            <p className="text-slate-400 text-xs">Please wait while we deduplicate and save leads.</p>
          </div>
        </div>
      )}
      
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 py-8 space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2">
            ⚠️ {error} - Please check your network connection or API status.
          </div>
        )}

        {/* KPI Section */}
        <KpiCards data={kpiCardsData} />

        {/* Charts Section */}
        <ChartsSection data={chartsData} />

        {/* Filters and Table Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <Filters 
            filters={filters} 
            setFilters={setFilters} 
            sources={Object.keys(stats.source_breakdown)}
            employees={Object.keys(stats.employee_breakdown)}
            statuses={Object.keys(stats.status_breakdown)}
          />
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-slate-400 font-bold text-sm">Fetching Lead Data...</p>
            </div>
          ) : (
            <DataTable 
              leads={leads} 
              onRowClick={handleRowClick} 
            />
          )}
        </section>
      </main>

      {/* Slide-in Detail Panel */}
      <DetailPanel 
        lead={selectedLead} 
        isOpen={isPanelOpen} 
        onClose={handleClosePanel} 
      />
    </div>
  )
}

export default Dashboard
