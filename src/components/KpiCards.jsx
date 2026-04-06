import React from 'react'
import { Phone, CheckCircle, Clock, Percent, MapPin, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const icons = {
  Phone: Phone,
  CheckCircle: CheckCircle,
  Clock: Clock,
  Percent: Percent,
  MapPin: MapPin,
}

const colorStyles = {
  blue: 'border-blue-500 bg-blue-50/50 text-blue-600 shadow-blue-100',
  green: 'border-green-500 bg-green-50/50 text-green-600 shadow-green-100',
  orange: 'border-orange-500 bg-orange-50/50 text-orange-600 shadow-orange-100',
  purple: 'border-purple-500 bg-purple-50/50 text-purple-600 shadow-purple-100',
  indigo: 'border-indigo-500 bg-indigo-50/50 text-indigo-600 shadow-indigo-100',
}

const KpiCards = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {data.map((kpi) => {
        const IconComponent = icons[kpi.icon] || Phone
        const colorClass = colorStyles[kpi.color] || colorStyles.blue
        const trendIcon = kpi.trend.includes('+') ? <TrendingUp className="w-3 h-3"/> : kpi.trend.includes('-') ? <TrendingDown className="w-3 h-3"/> : <Minus className="w-3 h-3"/>
        const trendColor = kpi.trend.includes('+') ? 'text-green-600' : kpi.trend.includes('-') ? 'text-red-600' : 'text-slate-400'

        return (
          <div 
            key={kpi.id} 
            className={`relative p-6 bg-white rounded-2xl border-t-4 border-l border-r border-b border-transparent shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden ${colorClass}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-all ${kpi.trend.includes('+') ? 'text-blue-600' : 'text-slate-600'}`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] uppercase font-bold py-1 px-2 rounded-full bg-white/80 border border-slate-100 ${trendColor}`}>
                {trendIcon}
                {kpi.trend}
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{kpi.value}</h3>
              <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase">{kpi.label}</p>
            </div>

            {/* Subtle glow effect background - optional for premium feel */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:bg-white/40 transition-all"></div>
          </div>
        )
      })}
    </div>
  )
}

export default KpiCards
