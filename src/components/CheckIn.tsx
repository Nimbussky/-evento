import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Camera, CheckCircle2, AlertCircle } from "lucide-react"

export default function CheckIn() {
  const [gpsStatus, setGpsStatus] = useState<"pending" | "locating" | "success" | "error">("pending")
  const [photoStatus, setPhotoStatus] = useState<"pending" | "ready" | "captured">("pending")
  const [distance, setDistance] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setPhotoStatus("ready")
      }
    } catch (err) {
      console.error("Camera access denied", err)
    }
  }

  const checkLocation = () => {
    setGpsStatus("locating")
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (_position) => {
          // Haversine distance mock calculation
          // For demo, we'll assume they are within 50 meters
          setDistance(50)
          setGpsStatus("success")
          startCamera()
        },
        (error) => {
          console.error(error)
          setGpsStatus("error")
        },
        { enableHighAccuracy: true }
      )
    } else {
      setGpsStatus("error")
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 text-white flex flex-col p-4 pb-20">
      <h1 className="text-2xl font-bold text-amber-500 mb-6 text-center">Event Check-In</h1>
      
      <div className="space-y-6 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        
        {/* Step 1: GPS Verification */}
        <Card className={`border-2 ${gpsStatus === "success" ? "border-green-500/50 bg-green-900/10" : "border-slate-700 bg-slate-800/50"}`}>
          <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
            <div className={`p-3 rounded-full ${gpsStatus === "success" ? "bg-green-500/20 text-green-500" : "bg-slate-700 text-amber-500"}`}>
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-lg text-slate-100">Location Verification</h3>
            
            {gpsStatus === "pending" && (
              <Button onClick={checkLocation} className="bg-amber-500 hover:bg-amber-600 text-white w-full">
                Verify GPS
              </Button>
            )}
            {gpsStatus === "locating" && <p className="text-amber-500 animate-pulse">Acquiring high-accuracy GPS...</p>}
            {gpsStatus === "success" && (
              <div className="flex items-center text-green-400 font-medium">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Within Geofence ({distance}m)
              </div>
            )}
            {gpsStatus === "error" && (
              <div className="flex items-center text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                Could not verify location. Ensure GPS is enabled.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Live Selfie */}
        <Card className={`border-2 transition-all ${gpsStatus !== "success" ? "opacity-50 pointer-events-none" : "border-slate-700 bg-slate-800/50"}`}>
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-full bg-slate-700 text-amber-500">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-lg text-slate-100">Live Selfie Capture</h3>
            
            <div className="w-full aspect-square bg-black rounded-xl overflow-hidden relative border border-slate-600">
              {photoStatus === "pending" && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
                  Complete GPS first
                </div>
              )}
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-full object-cover ${photoStatus === "ready" ? "block" : "hidden"}`} 
              />
              {photoStatus === "captured" && (
                <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm">
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                </div>
              )}
            </div>

            {photoStatus === "ready" && (
              <Button 
                onClick={() => setPhotoStatus("captured")} 
                className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg"
              >
                Capture & Check-In
              </Button>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
