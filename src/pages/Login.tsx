import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Calendar, User, Building2, MapPin } from "lucide-react"

export default function Login() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center p-6 justify-center">
      <div className="w-full max-w-md space-y-8 bg-slate-700/50 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm shadow-xl">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold text-amber-500 tracking-tight">EVENTO</h1>
          <p className="text-base text-slate-200 font-medium">
            Enterprise Event Workforce Platform
          </p>
          <p className="text-xs text-slate-400">
            Select your portal to explore the live application instantly
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <Button 
            onClick={() => navigate('/feed')} 
            type="button" 
            className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg rounded-xl shadow-lg transition-all flex items-center justify-center gap-3"
          >
            <User className="h-6 w-6" />
            ⚡ Enter as Candidate (Feed & Map)
          </Button>

          <Button 
            onClick={() => navigate('/dashboard')} 
            type="button" 
            className="w-full h-14 bg-slate-800 hover:bg-slate-600 text-slate-100 font-bold text-lg border border-slate-600 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3"
          >
            <Building2 className="h-6 w-6 text-amber-400" />
            🏢 Enter as Client Agency
          </Button>

          <Button 
            onClick={() => navigate('/check-in')} 
            type="button" 
            className="w-full h-14 bg-slate-800 hover:bg-slate-600 text-slate-100 font-bold text-lg border border-slate-600 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3"
          >
            <MapPin className="h-6 w-6 text-red-400" />
            📍 Test Live GPS Check-In
          </Button>

          <Button 
            onClick={() => navigate('/onboarding/candidate')} 
            type="button" 
            className="w-full h-12 bg-slate-800/50 hover:bg-slate-700 text-slate-300 font-medium text-sm border border-slate-700 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="h-4 w-4 text-slate-400" />
            📝 Candidate Onboarding (KYC)
          </Button>
        </div>
      </div>
      
      <p className="mt-8 text-slate-400 text-xs text-center">
        By continuing, you agree to Evento's <br/> Terms of Service & Privacy Policy
      </p>
    </div>
  )
}
