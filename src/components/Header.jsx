import React from 'react'
import { Calendar, RefreshCcw, Bell, Search, ChevronDown, LogOut, Download, FileSpreadsheet } from 'lucide-react'

const Header = ({ user, onLogout, onRefresh = () => {}, onFileUpload = () => {}, onExport = () => {}, onDateChange = () => {} }) => {
  const [fromDate, setFromDate] = React.useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [toDate, setToDate] = React.useState(new Date().toISOString().split('T')[0]);

  const fileInputRef = React.useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      e.target.value = '';
    }
  };

  const handleFromChange = (e) => {
    const val = e.target.value;
    setFromDate(val);
    onDateChange(val, toDate);
  };

  const handleToChange = (e) => {
    const val = e.target.value;
    setToDate(val);
    onDateChange(fromDate, val);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left Side: Title */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">CEO MIS Dashboard</h1>
        </div>

        {/* Right Side: Actions & User */}
        <div className="flex items-center gap-4">
          
          {/* Download Merged Button */}
          <button 
            onClick={onExport}
            className="hidden sm:flex items-center gap-2 px-3.6 py-2 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-[0.98]"
            title="Download all leads as one merged Excel file"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download Merged</span>
          </button>

          {/* Upload Button */}
          <button 
            onClick={handleUploadClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]"
          >
            <Calendar className="w-4 h-4" />
            <span>Upload Excel</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx,.xls"
            className="hidden"
          />

          {/* Date Range Selector - Functional */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full hover:bg-slate-100 transition-all">
            <div className="flex items-center gap-1">
              <input 
                type="date" 
                value={fromDate}
                onChange={handleFromChange}
                className="bg-transparent border-none text-xs font-bold text-slate-600 focus:ring-0 cursor-pointer p-0 w-[95px]"
              />
              <span className="text-slate-300 text-[10px]">to</span>
              <input 
                type="date" 
                value={toDate}
                onChange={handleToChange}
                className="bg-transparent border-none text-xs font-bold text-slate-600 focus:ring-0 cursor-pointer p-0 w-[95px]"
              />
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={onRefresh}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all active:rotate-180 duration-500"
              title="Refresh Dashboard"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>

          <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

          {/* User Profile - No Image */}
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">{user?.name || 'Administrator'}</p>
              <p className="text-xs text-slate-500 font-semibold tracking-tight">Super Admin</p>
            </div>
            <div className="relative group">
              <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-md cursor-pointer flex items-center justify-center text-blue-600 font-bold group-hover:ring-2 group-hover:ring-blue-500 transition-all">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'SA'}
              </div>
              {/* Dropdown placeholder */}
              <div className="absolute right-0 top-12 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none group-hover:pointer-events-auto">
                <button 
                  onClick={onLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
