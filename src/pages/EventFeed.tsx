import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventCard } from "@/components/EventCard"
import { MapPin, List as ListIcon, Sparkles, SlidersHorizontal, RefreshCw } from "lucide-react"

// Fix leaflet default icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const FALLBACK_EVENTS = [
  {
    id: "ev-1",
    company: "Sunburn Festival Arena",
    title: "VVIP Security & Access Control Officer",
    date: "Tomorrow",
    duration: "8 hrs",
    pay: 2200,
    distance: "3.2 km",
    slotsLeft: 4,
    isUrgent: true,
    category: "Security",
    matchScore: 99,
    skillsReq: ["Crowd Control", "VVIP Handling", "Punctual"],
    lat: 18.5362,
    lng: 73.8939
  },
  {
    id: "ev-2",
    company: "Taj Vivanta Hospitality",
    title: "Elite Banquet Bartender & Mixologist",
    date: "28 Jun",
    duration: "6 hrs",
    pay: 1800,
    distance: "1.8 km",
    slotsLeft: 2,
    isUrgent: false,
    category: "Hospitality",
    matchScore: 97,
    skillsReq: ["Mixology", "Grooming", "Hospitality"],
    lat: 18.5245,
    lng: 73.8550
  },
  {
    id: "ev-3",
    company: "TechMahindra Annual Symposium",
    title: "Keynote Floor Manager & Usher",
    date: "30 Jun",
    duration: "9 hrs",
    pay: 2500,
    distance: "5.4 km",
    slotsLeft: 6,
    isUrgent: true,
    category: "Event Management",
    matchScore: 95,
    skillsReq: ["English Communication", "Coordination"],
    lat: 18.5512,
    lng: 73.9310
  },
  {
    id: "ev-4",
    company: "Phoenix Mall Amphitheatre",
    title: "Promotional Stage Setup & Sound Tech",
    date: "02 Jul",
    duration: "5 hrs",
    pay: 1400,
    distance: "4.1 km",
    slotsLeft: 3,
    isUrgent: false,
    category: "Technical",
    matchScore: 92,
    skillsReq: ["Sound Engineering", "Stage Handling"],
    lat: 18.5621,
    lng: 73.9167
  }
]

export default function EventFeed() {
  const [view, setView] = useState("list")
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'active')
      
      if (error) {
        console.error('Error fetching events:', error)
        setEvents(FALLBACK_EVENTS)
      } else {
        setEvents(data && data.length > 0 ? data : FALLBACK_EVENTS)
      }
    }

    fetchEvents()
  }, [])

  return (
    <div className="min-h-screen bg-navy-900 text-white flex flex-col">
      {/* Premium Header */}
      <div className="p-5 border-b border-slate-700 bg-navy-900/90 backdrop-blur-xl sticky top-0 z-20 shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-emerald-400 tracking-wider">SUPABASE REAL-TIME SECURE</span>
            </div>
            <h1 className="text-2xl font-extrabold text-amber-500 tracking-tight">Discover Live Shifts</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all shadow-lg">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <div className="bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-slate-700 text-slate-200 font-bold flex items-center shadow-lg">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
              Pune, MH
            </div>
          </div>
        </div>

        <Tabs defaultValue="list" className="w-full" onValueChange={setView}>
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/80 p-1.5 h-12 rounded-xl border border-slate-700">
            <TabsTrigger value="list" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 font-extrabold rounded-lg transition-all text-sm">
              <ListIcon className="w-4 h-4 mr-2" /> Live Shifts List
            </TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 font-extrabold rounded-lg transition-all text-sm">
              <MapPin className="w-4 h-4 mr-2" /> Interactive Radar Map
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* AI Assistant Banner */}
      <div className="mx-4 my-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-600/10 to-emerald-500/10 border border-amber-500/30 backdrop-blur-md shadow-2xl flex items-center justify-between group hover:border-amber-500/50 transition-all">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-amber-500/20 rounded-2xl border border-amber-500/40 shadow-xl shadow-amber-500/10 animate-pulse">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30 shadow-md">
                🟢 LIVE QWEN 2.5 AI ACTIVE
              </span>
              <span className="text-xs text-slate-400 font-medium">Real-Time Match Engine</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mt-1.5 group-hover:text-amber-400 transition-colors">AI Skills Matcher & Verification Engine</h3>
            <p className="text-xs text-slate-300 mt-0.5 font-medium leading-relaxed">
              Continuously syncing your background with high-paying enterprise workforce requests in Pune.
            </p>
          </div>
        </div>
        <button className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40 rounded-xl text-xs font-bold transition-all shadow-2xl shadow-amber-500/10 hover:scale-105 whitespace-nowrap flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ⚡ Re-Sync AI Profile
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {view === "list" ? (
          <div className="p-4 space-y-5 overflow-y-auto h-full pb-28">
            {events.map(event => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        ) : (
          <div className="h-[calc(100vh-220px)] w-full relative">
            <div className="absolute top-4 left-4 z-[1000] bg-slate-900/90 border border-slate-700 text-white px-4 py-3 rounded-xl backdrop-blur-md shadow-2xl space-y-1">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">🎯 Radar Range Lock</p>
              <p className="text-sm font-extrabold text-slate-100">Showing 4 active jobs within 10 km</p>
            </div>
            <MapContainer 
              center={[18.5204, 73.8567]} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              />
              {events.map(event => (
                <Marker key={event.id} position={[event.lat, event.lng]}>
                  <Popup className="bg-slate-800 text-white border-none shadow-2xl rounded-xl p-2">
                    <div className="p-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
                        🔥 {event.matchScore || 95}% MATCH
                      </span>
                      <p className="font-extrabold text-base text-slate-100 mt-2">{event.title}</p>
                      <p className="text-xs font-bold text-amber-400 mt-1">₹{event.pay} • {event.distance}</p>
                      <button className="mt-3 w-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold py-1.5 rounded-lg transition-all">
                        Instant Quick Apply
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  )
}
