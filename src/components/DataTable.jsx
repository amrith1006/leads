import React from 'react'
import { ChevronRight, ExternalLink, Mail, Phone, MoreHorizontal } from 'lucide-react'

const DataTable = ({ leads, onRowClick }) => {
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Employee</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Customer Name</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Phone</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Lead Source</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Remarks</th>
                  <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-500 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {leads.length > 0 ? (
                  leads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      onClick={() => onRowClick(lead)}
                      className="group hover:bg-blue-50/50 cursor-pointer transition-all duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs ring-2 ring-white">
                            {lead.employee_name.charAt(0)}
                          </div>
                          <span className="text-sm font-semibold text-slate-700">{lead.employee_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-slate-900">{lead.customer_name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Phone className="w-3.5 h-3.5" />
                          <span className="text-sm font-medium">{lead.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-[11px] font-bold uppercase tracking-wide">
                          {lead.lead_source}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${
                          lead.status === 'Interested' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          lead.status === 'Qualified' ? 'bg-green-50 text-green-600 border-green-100' :
                          lead.status === 'Not Interested' ? 'bg-red-50 text-red-600 border-red-100' :
                          'bg-slate-50 text-slate-600 border-slate-100'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-500 line-clamp-1 max-w-[200px]">{lead.remarks}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="p-2 text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-100/50 rounded-lg transition-all">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-20 text-center text-slate-400 font-medium">
                      No leads found matching current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination Footer - Static */}
      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">Showing {leads.length} of {leads.length} leads</span>
        <div className="flex items-center gap-2">
          <button disabled className="px-3 py-1.5 text-xs font-bold text-slate-400 bg-white border border-slate-200 rounded-lg opacity-50 cursor-not-allowed">Previous</button>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center text-xs font-bold bg-blue-600 text-white rounded-lg shadow-sm">1</button>
          </div>
          <button disabled className="px-3 py-1.5 text-xs font-bold text-slate-400 bg-white border border-slate-200 rounded-lg opacity-50 cursor-not-allowed">Next</button>
        </div>
      </div>
    </div>
  )
}

export default DataTable
