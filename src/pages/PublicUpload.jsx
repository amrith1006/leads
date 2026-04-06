import React, { useState, useRef } from 'react'
import { Calendar, CheckCircle, FileSpreadsheet, AlertCircle } from 'lucide-react'
import { uploadLeads } from '../services/api'

const PublicUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      setError(null)
      setSuccess(null)
      
      const result = await uploadLeads(file)
      
      setSuccess({
        message: result.message,
        inserted: result.inserted,
        duplicates: result.duplicates_skipped
      })
      e.target.value = ''
    } catch (err) {
      console.error('Upload error:', err)
      setError(`Upload failed: ${err.message || 'Check your internet connection.'}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      {/* Brand Header */}
      <div className="mb-12 flex flex-col items-center gap-4 animate-fade-in">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-100">
          <span className="text-white font-bold text-3xl">L</span>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Lead Sync Portal</h1>
          <p className="text-slate-500 font-medium">Quick Excel Upload & Data Merging</p>
        </div>
      </div>

      {/* Main Upload Card */}
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-10 border border-slate-100 relative overflow-hidden group hover:border-blue-200 transition-all duration-500">
        
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:rotate-12 transition-all duration-500">
            <FileSpreadsheet className="w-10 h-10 text-blue-600" />
          </div>
          
          <h2 className="text-xl font-bold text-slate-800 mb-2">Drop your Excel here</h2>
          <p className="text-sm text-slate-400 mb-8 max-w-[240px]">
            The system will automatically deduplicate and merge your leads into the base.
          </p>

          <button 
            onClick={handleUploadClick}
            disabled={uploading}
            className={`w-full py-4 px-8 rounded-2xl font-bold transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-3 ${
              uploading 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100 hover:shadow-blue-200'
            }`}
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
                <span>Processing File...</span>
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5" />
                <span>Select & Upload Excel</span>
              </>
            )}
          </button>

          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx,.xls"
            className="hidden"
          />
          
          <p className="mt-6 text-[11px] text-slate-400 uppercase tracking-widest font-bold">
            Supports .XLSX and .XLS formats only
          </p>
        </div>
      </div>

      {/* Success/Error Feedback */}
      <div className="mt-8 w-full max-w-md h-24">
        {success && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-4 animate-slide-up">
            <div className="bg-emerald-500 rounded-full p-2 mt-1 shadow-lg shadow-emerald-100">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-emerald-800 font-bold text-sm">Upload Successful!</p>
              <p className="text-emerald-600 text-xs mt-0.5">
                {success.inserted} new leads added. {success.duplicates} duplicates skipped.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start gap-4 animate-shake">
            <div className="bg-rose-500 rounded-full p-2 mt-1 shadow-lg shadow-rose-100">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-rose-800 font-bold text-sm">Oops! Something went wrong</p>
              <p className="text-rose-600 text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-12 text-center">
        <p className="text-xs text-slate-400 font-medium">
          Deduplication is based on valid phone number entries.
        </p>
      </div>
    </div>
  )
}

export default PublicUpload
