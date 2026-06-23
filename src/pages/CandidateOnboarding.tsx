import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, MapPin, Upload } from "lucide-react"

export default function CandidateOnboarding() {
  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [pin, setPin] = useState("")
  const [skills, setSkills] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Candidate Profile Saved")
  }

  return (
    <div className="min-h-screen bg-navy-900 text-white p-6 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-h1 text-amber-500 mb-2">Build Your Profile</h1>
          <p className="text-slate-300">Complete your profile to start applying for premium gig events.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Photo Upload Section */}
          <div className="flex flex-col items-center space-y-3 p-6 bg-slate-700/30 rounded-xl border border-slate-700/50 backdrop-blur-sm">
            <div className="h-24 w-24 rounded-full bg-slate-800 flex items-center justify-center border-2 border-dashed border-amber-500/50 cursor-pointer hover:border-amber-500 transition-colors">
              <Camera className="h-8 w-8 text-amber-500" />
            </div>
            <p className="text-sm font-medium text-slate-200">Take a Live Selfie</p>
            <p className="text-xs text-slate-400 text-center">Required for GPS check-ins. No gallery uploads allowed.</p>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name (As per Aadhaar)</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-800 border-slate-600 focus-visible:ring-amber-500 h-12"
                placeholder="Rahul Shinde"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-600 focus-visible:ring-amber-500 h-12"
                    placeholder="Pune"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pin">PIN Code</Label>
                <Input
                  id="pin"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  className="bg-slate-800 border-slate-600 focus-visible:ring-amber-500 h-12"
                  placeholder="411033"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Top Skills (Comma separated)</Label>
              <Input
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="bg-slate-800 border-slate-600 focus-visible:ring-amber-500 h-12"
                placeholder="Promoter, Data Entry, Hospitality"
              />
            </div>
          </div>

          {/* KYC Section */}
          <div className="space-y-3 p-5 bg-slate-700/30 rounded-xl border border-slate-700/50 backdrop-blur-sm">
            <h3 className="font-semibold text-amber-500">Identity Verification</h3>
            <p className="text-xs text-slate-300">Upload your Aadhaar card for KYC. This is encrypted and secure.</p>
            <Button type="button" variant="outline" className="w-full h-12 mt-2 bg-slate-800 border-slate-600 hover:bg-slate-700 hover:text-white">
              <Upload className="mr-2 h-4 w-4" />
              Upload Aadhaar (Front & Back)
            </Button>
          </div>

          <Button type="submit" className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-amber-500/20">
            Save Profile
          </Button>

        </form>
      </div>
    </div>
  )
}
