import { MapPin, Clock, IndianRupee, Users } from "lucide-react"
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
}

export function EventCard({ company, title, date, duration, pay, distance, slotsLeft, isUrgent, category }: EventCardProps) {
  return (
    <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-md overflow-hidden relative">
      {/* Accent left border */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
      
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">{company}</p>
            <h3 className="text-lg font-bold text-slate-100">{title}</h3>
          </div>
          {isUrgent && (
            <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">
              URGENT
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>{date} ({duration})</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span>{distance} away</span>
          </div>
          <div className="flex items-center space-x-2 font-semibold text-white">
            <IndianRupee className="w-4 h-4 text-amber-500" />
            <span>₹{pay} / shift</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-amber-500" />
            <span>{slotsLeft} slots left</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <Badge variant="outline" className="text-slate-400 border-slate-600 bg-slate-900/50">
            {category}
          </Badge>
          <button className="text-amber-500 text-sm font-semibold hover:underline">
            View & Apply →
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
