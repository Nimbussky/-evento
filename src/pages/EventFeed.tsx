import { useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventCard } from "@/components/EventCard"
import { MapPin, List as ListIcon } from "lucide-react"

// Fix leaflet default icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const MOCK_EVENTS = [
  {
    id: 1,
    company: "Samsung Electronics",
    title: "Product Launch Promoter",
    date: "Today",
    duration: "8 hours",
    pay: 1200,
    distance: "2 km",
    slotsLeft: 3,
    isUrgent: true,
    category: "Promotion",
    lat: 18.5204,
    lng: 73.8567
  },
  {
    id: 2,
    company: "Global Expositions",
    title: "Expo Registration Desk",
    date: "Tomorrow",
    duration: "10 hours",
    pay: 1500,
    distance: "5 km",
    slotsLeft: 12,
    isUrgent: false,
    category: "Expo/Exhibition",
    lat: 18.5314,
    lng: 73.8446
  }
]

export default function EventFeed() {
  const [view, setView] = useState("list")

  return (
    <div className="min-h-screen bg-navy-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-navy-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-amber-500">Discover Events</h1>
          <div className="bg-slate-800 text-xs px-3 py-1 rounded-full text-slate-300 flex items-center">
            <MapPin className="w-3 h-3 mr-1 text-amber-500" />
            Pune, MH
          </div>
        </div>

        <Tabs defaultValue="list" className="w-full" onValueChange={setView}>
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger value="list" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <ListIcon className="w-4 h-4 mr-2" /> List
            </TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <MapPin className="w-4 h-4 mr-2" /> Map
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {view === "list" ? (
          <div className="p-4 space-y-4 overflow-y-auto h-full pb-20">
            {MOCK_EVENTS.map(event => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        ) : (
          <div className="h-[calc(100vh-140px)] w-full">
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
              {MOCK_EVENTS.map(event => (
                <Marker key={event.id} position={[event.lat, event.lng]}>
                  <Popup className="bg-slate-800 text-white border-none shadow-xl rounded-lg">
                    <div className="p-1">
                      <p className="font-bold text-sm text-slate-900">{event.title}</p>
                      <p className="text-xs text-slate-600 mt-1">₹{event.pay} • {event.distance}</p>
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
