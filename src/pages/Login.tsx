import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone } from "lucide-react"
import { supabase } from "../lib/supabase"

export default function Login() {
  const navigate = useNavigate()
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length === 10) {
      const { error } = await supabase.auth.signInWithOtp({ phone: '+91' + phone })
      if (error) {
        console.error('Error sending OTP:', error.message)
        alert(error.message)
      } else {
        setStep("otp")
      }
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length === 6) {
      const { error } = await supabase.auth.verifyOtp({ phone: '+91' + phone, token: otp, type: 'sms' })
      if (error) {
        console.error('Error verifying OTP:', error.message)
        alert(error.message)
      } else {
        navigate('/feed')
      }
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center p-6 justify-center">
      <div className="w-full max-w-sm space-y-8 bg-slate-700/50 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm shadow-xl">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-amber-500 tracking-tight">EVENTO</h1>
          <p className="text-sm text-slate-300">
            {step === "phone" ? "Enter your phone number to continue" : "We sent a 6-digit code to your phone"}
          </p>
        </div>

        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-200">Mobile Number</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                  +91
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="99999 99999"
                  maxLength={10}
                  className="pl-12 bg-slate-800 border-slate-600 text-white h-12 focus-visible:ring-amber-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  required
                />
                <Phone className="absolute right-3 top-3.5 h-5 w-5 text-slate-400" />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg transition-all">
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-slate-200">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="• • • • • •"
                maxLength={6}
                className="bg-slate-800 border-slate-600 text-white h-12 text-center text-2xl tracking-[0.5em] focus-visible:ring-amber-500"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg transition-all">
              Verify & Secure Login
            </Button>
            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={() => setStep("phone")}
                className="text-amber-500 text-sm hover:underline"
              >
                Change mobile number
              </button>
            </div>
          </form>
        )}
      </div>
      
      <p className="mt-8 text-slate-400 text-xs text-center">
        By continuing, you agree to Evento's <br/> Terms of Service & Privacy Policy
      </p>
    </div>
  )
}
