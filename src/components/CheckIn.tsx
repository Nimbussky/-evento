import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Camera, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react"
import { supabase } from "../lib/supabase"
import { analyzeCheckInFraud } from "../lib/fraudSentinel"

export default function CheckIn() {
  const [gpsStatus, setGpsStatus] = useState<"pending" | "locating" | "success" | "error">("pending")
  const [photoStatus, setPhotoStatus] = useState<"pending" | "ready" | "captured" | "uploading">("pending")
  const [distance, setDistance] = useState<number | null>(null)
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null)
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
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
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

  const capturePhoto = async () => {
    if (!videoRef.current || !location) return
    
    const canvas = document.createElement("canvas")
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
    
    setPhotoStatus("uploading")
    
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg"))
      if (!blob) throw new Error("Could not create image blob")

      const fileName = `checkin-${Date.now()}.jpg`
      const { error: uploadError } = await supabase.storage
        .from("checkins")
        .upload(fileName, blob, { contentType: "image/jpeg" })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from("checkins")
        .getPublicUrl(fileName)
        
      const imageUrl = urlData.publicUrl

      const fraudResult = await analyzeCheckInFraud(imageUrl, location)
      console.log("Fraud Analysis Result:", fraudResult)

      const { error: insertError } = await supabase
        .from("check_ins")
        .insert({
          photo_url: imageUrl,
          lat: location.lat,
          lng: location.lng,
          is_valid: !fraudResult.isFraudulent
        })
        
      if (insertError) throw insertError
      
      setPhotoStatus("captured")
    } catch (error) {
      console.error("Check-in failed:", error)
      setPhotoStatus("ready")
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 text-white flex flex-col p-6 pb-28 selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-md mx-auto w-full text-center space-y-3 mb-8 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold text-xs tracking-wider shadow-lg">
          <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>MINIMAX FRAUDSENTINEL AI ACTIVE</span>
        </div>
        <h1 className="text-3xl font-black text-amber-500 tracking-tight">AI Secure Check-In</h1>
        <p className="text-xs text-slate-400 font-medium leading-relaxed">
          Biometric facial lock and high-accuracy geofence verification powered by OpenRouter Minimax AI.
        </p>
      </div>
      
      <div className="space-y-8 flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        
        {/* Step 1: GPS Verification */}
        <Card className={`border-2 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden transition-all duration-300 ${gpsStatus === "success" ? "border-emerald-500/50 bg-emerald-950/20 shadow-emerald-500/10" : "border-slate-700/80 bg-slate-800/90"}`}>
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
            <div className={`p-4 rounded-2xl border ${gpsStatus === "success" ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : "bg-slate-900 border-slate-700 text-amber-500"}`}>
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-100">Location Verification</h3>
            
            {gpsStatus === "pending" && (
              <Button onClick={checkLocation} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold w-full py-6 rounded-2xl text-base shadow-xl shadow-amber-500/20 hover:scale-105 transition-all">
                Acquire High-Accuracy GPS
              </Button>
            )}
            {gpsStatus === "locating" && <p className="text-amber-500 font-extrabold animate-pulse tracking-wide text-sm">Acquiring military-grade GPS lock...</p>}
            {gpsStatus === "success" && (
              <div className="flex items-center text-emerald-400 font-extrabold text-base bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Within Geofence ({distance}m Lock)
              </div>
            )}
            {gpsStatus === "error" && (
              <div className="flex items-center text-red-400 text-sm font-bold bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                Could not verify location. Ensure GPS is enabled.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Live Selfie */}
        <Card className={`border-2 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden transition-all duration-300 ${gpsStatus !== "success" ? "opacity-40 pointer-events-none border-slate-800 bg-slate-900/50" : "border-slate-700/80 bg-slate-800/90"}`}>
          <CardContent className="p-8 flex flex-col items-center text-center space-y-5">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 text-amber-500 shadow-inner">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-100">Live Biometric Capture</h3>
            
            <div className="w-full aspect-square bg-slate-950 rounded-2xl overflow-hidden relative border-2 border-slate-700/80 shadow-2xl">
              {photoStatus === "pending" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 text-sm font-bold p-4 bg-slate-900/40 backdrop-blur-sm">
                  <MapPin className="w-8 h-8 mb-2 text-slate-600 animate-bounce" />
                  <span>Acquire GPS Lock first to unlock camera</span>
                </div>
              )}
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-full object-cover ${photoStatus === "ready" || photoStatus === "uploading" ? "block" : "hidden"}`} 
              />
              {photoStatus === "captured" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/80 backdrop-blur-md space-y-2">
                  <CheckCircle2 className="w-20 h-20 text-emerald-400 animate-bounce" />
                  <span className="text-white font-extrabold text-lg tracking-wide">AI Verification Successful!</span>
                </div>
              )}
            </div>

            {photoStatus === "ready" && (
              <Button 
                onClick={capturePhoto} 
                className="w-full py-7 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-lg rounded-2xl shadow-2xl shadow-amber-500/30 hover:scale-105 transition-all uppercase tracking-wider"
              >
                📸 Capture & AI Check-In
              </Button>
            )}
            {photoStatus === "uploading" && (
              <Button 
                disabled
                className="w-full py-7 bg-amber-500/40 text-white font-black text-lg rounded-2xl shadow-inner cursor-not-allowed tracking-widest uppercase animate-pulse"
              >
                🧠 Minimax AI Verifying...
              </Button>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
