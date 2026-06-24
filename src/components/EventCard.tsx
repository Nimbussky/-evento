import { useState } from "react"
import { MapPin, Clock, IndianRupee, Users, Sparkles, CheckCircle2, ShieldCheck, Zap, ArrowRight } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"

interface EventCardProps {
  company: string
  title: string
  date: string
  duration: string
  pay: number
  distance: string
  slotsLeft: number
  isUrgent?: boolean
  category: string
  matchScore?: number
  skillsReq?: string[]
}

export function EventCard({ company, title, date, duration, pay, distance, slotsLeft, isUrgent, category, matchScore = 98, skillsReq = ["Communication", "Punctual"] }: EventCardProps) {
  const [isApplied, setIsApplied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-[#0e1420] border-slate-800/80 backdrop-blur-xl overflow-hidden relative hover:border-amber-500/50 hover:shadow-[0_20px_50px_rgba(245,158,11,0.15)] hover:-translate-y-1.5 transition-all duration-500 group rounded-3xl"
    >
      {/* Dynamic left accent gradient */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-amber-500 via-amber-600 to-emerald-500 group-hover:w-2.5 transition-all duration-300"></div>
      
      <CardContent className="p-6 md:p-8 space-y-6 pl-8 md:pl-10">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-extrabold text-slate-400 tracking-wider uppercase">{company}</p>
              <span className="flex items-center gap-1 text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full shadow-sm">
                <CheckCircle2 className="w-3 h-3 text-blue-400" /> VERIFIED CLIENT
              </span>
            </div>
            <h3 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors tracking-tight">{title}</h3>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5">
            {isUrgent && (
              <Badge variant="destructive" className="bg-gradient-to-r from-red-600/20 to-red-500/20 text-red-400 border border-red-500/30 font-extrabold tracking-widest py-1.5 px-4 rounded-xl flex items-center gap-1.5 shadow-lg shadow-red-500/10 animate-pulse">
                <Zap className="w-4 h-4 text-red-400" /> URGENT SHIFT
              </Badge>
            )}
            <Badge variant="outline" className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-emerald-500/20 text-amber-400 border border-amber-500/40 py-1.5 px-4 rounded-xl flex items-center gap-2 shadow-xl shadow-amber-500/10 font-black text-xs tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
              {matchScore}% AI MATCHED PRO
            </Badge>
          </div>
        </div>

        {/* High-Fidelity Metric Grid (Apna/Uber style) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-200 bg-[#090d16] p-5 rounded-2xl border border-slate-800/80 shadow-inner">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Schedule</p>
              <p className="font-extrabold text-slate-200">{date} <span className="text-amber-400 font-bold">({duration})</span></p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Location Lock</p>
              <p className="font-extrabold text-slate-200">{distance} away</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Payout Rate</p>
              <p className="font-black text-emerald-400 text-lg tracking-tight">₹{pay} <span className="text-xs font-extrabold text-slate-400">/ shift</span></p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Availability</p>
              <p className="font-black text-amber-500 tracking-wide">{slotsLeft} slots left</p>
            </div>
          </div>
        </div>

        {/* Premium Skills Badges (Fiverr style) */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Background Required
          </p>
          <div className="flex flex-wrap gap-2">
            {skillsReq.map((skill, i) => (
              <span key={i} className="text-xs px-3.5 py-1.5 bg-[#161f30] text-slate-200 rounded-xl border border-slate-700/80 font-extrabold shadow-sm flex items-center gap-1.5 hover:border-slate-500 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="pt-4 flex flex-col md:flex-row items-start md:items-center justify-between border-t border-slate-800/80 gap-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-slate-400 border-slate-700 bg-[#0b0f19] uppercase tracking-widest font-black py-1.5 px-4 rounded-xl text-xs shadow-inner">
              {category}
            </Badge>
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              ⚡ Instant 60s UPI Payout
            </span>
          </div>

          {isApplied ? (
            <div className="w-full md:w-auto bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 px-8 py-4 rounded-2xl text-base font-black shadow-xl flex items-center justify-center gap-3 animate-in zoom-in-95 duration-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
              <span>Shift Locked • AI Guard Active!</span>
            </div>
          ) : (
            <button 
              onClick={() => setIsApplied(true)}
              className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-8 py-4 rounded-2xl text-base font-black shadow-2xl shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 hover:scale-105"
            >
              <span>Instant Quick Apply</span>
              <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

      </CardContent>
    </Card>
  )
}
