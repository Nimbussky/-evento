import { MapPin, Clock, IndianRupee, Users, Sparkles } from "lucide-react"
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

export function EventCard({ company, title, date, duration, pay, distance, slotsLeft, isUrgent, category, matchScore = 96, skillsReq = ["Communication", "Punctual"] }: EventCardProps) {
  return (
    <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-md overflow-hidden relative hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300 group">
      {/* Accent left border */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500 group-hover:bg-amber-400 transition-colors"></div>
      
      <CardContent className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-slate-400 font-bold tracking-wider uppercase">{company}</p>
            <h3 className="text-xl font-bold text-slate-100 group-hover:text-amber-400 transition-colors">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {isUrgent && (
              <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20 font-bold tracking-wide py-1 px-3">
                URGENT
              </Badge>
            )}
            <Badge variant="outline" className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-400 border-amber-500/40 py-1 px-3 flex items-center gap-1.5 shadow-lg shadow-amber-500/10 font-extrabold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              {matchScore}% AI MATCH
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-slate-300 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-2.5">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="font-medium">{date} ({duration})</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span className="font-medium">{distance} away</span>
          </div>
          <div className="flex items-center space-x-2.5 font-bold text-amber-400 text-base">
            <IndianRupee className="w-4 h-4 text-amber-500" />
            <span>₹{pay} / shift</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <Users className="w-4 h-4 text-amber-500" />
            <span className="font-medium text-emerald-400">{slotsLeft} slots left</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {skillsReq.map((skill, i) => (
            <span key={i} className="text-xs px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700 font-medium">
              ✓ {skill}
            </span>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-700/60">
          <Badge variant="outline" className="text-slate-400 border-slate-600 bg-slate-900/50 uppercase tracking-wider font-semibold py-1 px-3">
            {category}
          </Badge>
          <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-5 py-2.5 rounded-xl text-sm font-extrabold shadow-xl shadow-amber-500/20 group-hover:scale-105 group-hover:shadow-amber-500/40 transition-all duration-300 flex items-center gap-2">
            View & Apply →
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
