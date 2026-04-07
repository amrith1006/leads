import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Phone, MapPin, Tag, MessageSquare, History, CheckCircle2, AlertCircle } from 'lucide-react'

const DetailPanel = ({ lead, isOpen, onClose, onStatusChange }) => {
  if (!lead) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 cursor-pointer"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-[60] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-slate-800">Lead Detail</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              
              {/* Profile Bar */}
              <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-200">
                  {lead.customer_name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">{lead.customer_name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <select
                      value={lead.status || 'New'}
                      onChange={(e) => onStatusChange && onStatusChange(lead.id, e.target.value)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer appearance-none text-center ${
                        lead.status === 'Interested' ? 'bg-blue-100 text-blue-700' :
                        lead.status === 'Qualified' ? 'bg-green-100 text-green-700' :
                        lead.status === 'Not Interested' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
                      } hover:scale-105 transition-transform`}
                      style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                    >
                      <option value="First Call">First Call</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Rate Call">Rate Call</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Interested">Interested</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Not Interested">Not Interested</option>
                      <option value="Completed">Completed</option>
                      <option value="New">New</option>
                    </select>
                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap">ID: #00{lead.id}</span>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1.5">
                      <Phone className="w-3 h-3" /> Phone
                    </label>
                    <p className="text-sm font-bold text-slate-700">{lead.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1.5">
                      <Tag className="w-3 h-3" /> Source
                    </label>
                    <p className="text-sm font-bold text-slate-700">{lead.lead_source}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1.5">
                      <User className="w-3 h-3" /> Assigned To
                    </label>
                    <p className="text-sm font-bold text-slate-700">{lead.employee_name}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1.5">
                      <History className="w-3 h-3" /> Created
                    </label>
                    <p className="text-sm font-bold text-slate-700">{new Date(lead.uploaded_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> Address
                </label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{lead.address || 'No address provided'}</p>
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3" /> Executive Remarks
                </label>
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <p className="text-sm text-slate-600 leading-relaxed italic">"{lead.remarks || 'No remarks available.'}"</p>
                </div>
              </div>

              {/* Activity Timeline */}
              {/* <div className="space-y-4 pt-4">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1.5">
                  <History className="w-3 h-3" /> Activity Timeline
                </label>
                <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
                  {lead.activities?.map((activity, idx) => (
                    <div key={activity.id} className="relative flex items-start gap-6 group">
                      <div className={`absolute left-0 w-10 h-10 rounded-xl flex items-center justify-center ring-4 ring-white shadow-sm z-10 ${idx === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {idx === 0 ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 pt-1 ml-10">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-xs font-bold text-slate-900 tracking-tight">{idx === 0 ? 'Latest Update' : 'Past Activity'}</h4>
                          <span className="text-[10px] font-bold text-slate-400">{activity.date}</span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium pr-4">{activity.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}

            </div>


          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default DetailPanel
