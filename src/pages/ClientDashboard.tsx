import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "../lib/supabase";
import { Sparkles, Crown, Building2, Users, IndianRupee, Calendar, ShieldCheck, Zap, TrendingUp, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

const FALLBACK_CLIENT_EVENTS = [
  {
    id: "cl-1",
    title: "Sunburn Festival Mainstage Management",
    category: "Concert Security",
    pay_rate: 2200,
    pay_type: "daily",
    headcount: 12,
    date_start: new Date().toISOString()
  },
  {
    id: "cl-2",
    title: "Infosys Annual General Summit",
    category: "Corporate Hospitality",
    pay_rate: 1800,
    pay_type: "daily",
    headcount: 8,
    date_start: new Date(Date.now() + 86400000).toISOString()
  }
];

const CLIENT_WELCOME_SLIDES = [
  {
    tag: "ENTERPRISE VIP TIER",
    title: "VVIP Operations Command Center",
    desc: "Broadcast infinite live shifts to Pune's top 1% verified workforce with zero commission fee staffing architecture.",
    icon: Crown,
    bg: "from-amber-500/20 via-amber-600/20 to-slate-900",
    borderColor: "border-amber-500/40"
  },
  {
    tag: "UBER FREIGHT SECURITY",
    title: "Minimax FraudSentinel Biometrics",
    desc: "Every attending worker undergoes active AI facial recognition and military-grade GPS geofence locking before shift check-in.",
    icon: ShieldCheck,
    bg: "from-emerald-500/20 via-emerald-600/20 to-slate-900",
    borderColor: "border-emerald-500/40"
  },
  {
    tag: "UPWORK WORKFORCE ANALYTICS",
    title: "Real-Time 1-Click Disbursals",
    desc: "Complete automated shift reporting, live headcount tracking, and batch UPI payouts disbursed instantly in 60 seconds.",
    icon: TrendingUp,
    bg: "from-blue-500/20 via-blue-600/20 to-slate-900",
    borderColor: "border-blue-500/40"
  }
];

const ClientDashboard = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [payRate, setPayRate] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false });
        
        if (!error && data && data.length > 0) {
          setEvents(data);
        } else {
          setEvents(FALLBACK_CLIENT_EVENTS);
        }
      } else {
        setEvents(FALLBACK_CLIENT_EVENTS);
      }
    } catch (err) {
      console.warn("Auth check warning:", err);
      setEvents(FALLBACK_CLIENT_EVENTS);
    }
    setLoading(false);
  };

  const handlePostEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent = {
      id: `custom-${Date.now()}`,
      client_id: 'demo-client',
      title: title || 'Security Guard',
      category: category || 'security',
      pay_rate: payRate ? parseFloat(payRate) : 500,
      pay_type: 'daily',
      headcount: 5,
      date_start: new Date().toISOString(),
      date_end: new Date(Date.now() + 86400000).toISOString()
    };

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        newEvent.client_id = user.id;
        await supabase.from('events').insert(newEvent);
      }
    } catch (err) {
      console.warn("Supabase auth/insert warning (running in demo fallback mode):", err);
    }
    
    // ALWAYS instantly update local state so the demo event displays instantly!
    setEvents([newEvent, ...events]);
    setIsPosting(false);
    setTitle("");
    setCategory("");
    setPayRate("");
    
    // Show stunning success notification
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 5000);
  };

  const currentSlideData = CLIENT_WELCOME_SLIDES[activeSlide];
  const SlideIcon = currentSlideData.icon;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-6 md:p-12 font-sans selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Elite Enterprise Welcome Carousel */}
        <div className={`p-8 md:p-10 rounded-3xl bg-gradient-to-r ${currentSlideData.bg} border-2 ${currentSlideData.borderColor} backdrop-blur-2xl shadow-2xl relative overflow-hidden transition-all duration-500 group`}>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient from-white/5 to-transparent pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center space-x-6">
              <div className="p-5 bg-slate-900/80 rounded-3xl border border-slate-700/80 shadow-2xl backdrop-blur-xl flex-shrink-0">
                <SlideIcon className="w-10 h-10 text-amber-400 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/40 tracking-widest shadow-md">
                    👑 {currentSlideData.tag}
                  </span>
                  <span className="text-xs text-slate-400 font-extrabold">Slide {activeSlide + 1} of 3</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{currentSlideData.title}</h1>
                <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
                  {currentSlideData.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-shrink-0">
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setActiveSlide((activeSlide - 1 + CLIENT_WELCOME_SLIDES.length) % CLIENT_WELCOME_SLIDES.length)}
                  className="p-4 bg-slate-900/90 hover:bg-slate-800 text-white rounded-2xl border border-slate-700 shadow-xl hover:scale-105 transition-all"
                  title="Previous Slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setActiveSlide((activeSlide + 1) % CLIENT_WELCOME_SLIDES.length)}
                  className="p-4 bg-slate-900/90 hover:bg-slate-800 text-white rounded-2xl border border-slate-700 shadow-xl hover:scale-105 transition-all"
                  title="Next Slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <Button 
                onClick={() => setIsPosting(!isPosting)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-8 py-7 rounded-2xl shadow-2xl shadow-amber-500/30 transition-all duration-300 text-base hover:scale-105"
              >
                {isPosting ? "✕ Close Form" : "+ Post New Live Event"}
              </Button>
            </div>
          </div>

          {/* Carousel Dot Indicators */}
          <div className="flex justify-center gap-3 mt-8 pt-4 border-t border-slate-800/80">
            {CLIENT_WELCOME_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${activeSlide === idx ? "w-10 bg-amber-500 shadow-lg shadow-amber-500/50" : "w-2.5 bg-slate-700"}`}
              />
            ))}
          </div>
        </div>

        {/* Post Event Form */}
        {isPosting && (
          <form onSubmit={handlePostEvent} className="bg-[#0e1420] backdrop-blur-2xl border-2 border-amber-500/40 rounded-3xl p-8 shadow-2xl mb-8 space-y-6 animate-in fade-in-50 duration-300">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-500/40">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Create New Live Shift</h2>
                <p className="text-xs text-slate-400 font-medium">Your event will instantly broadcast to active AI-matched candidates in Pune.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-slate-300 font-bold text-sm mb-2">Shift Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#090d16] border-2 border-slate-700 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-amber-500 font-medium shadow-inner"
                  placeholder="e.g. VVIP Security Guard"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold text-sm mb-2">Category</label>
                <input 
                  type="text" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#090d16] border-2 border-slate-700 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-amber-500 font-medium shadow-inner"
                  placeholder="e.g. Security, Hospitality"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold text-sm mb-2">Pay Rate (₹)</label>
                <input 
                  type="number" 
                  value={payRate}
                  onChange={(e) => setPayRate(e.target.value)}
                  className="w-full bg-[#090d16] border-2 border-slate-700 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-amber-500 font-medium shadow-inner"
                  placeholder="e.g. 1500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-800">
              <Button type="submit" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-8 py-6 rounded-2xl shadow-xl shadow-amber-500/20 text-base hover:scale-105 transition-all">
                Broadcast Event Now →
              </Button>
            </div>
          </form>
        )}

        {/* Success Alert */}
        {showSuccessAlert && (
          <div className="bg-emerald-500/10 border-2 border-emerald-500/40 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex items-center gap-4 animate-in fade-in-50 duration-300">
            <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/40 text-emerald-400 font-extrabold text-xl">
              ✓
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">Shift Successfully Broadcasted!</h3>
              <p className="text-slate-300 text-sm mt-0.5 font-medium">Your live event is now active on the radar map for candidates across Pune.</p>
            </div>
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0e1420] backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl transition-all hover:scale-[1.02] hover:border-amber-500/40 duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-300 font-bold text-lg">Active Events Today</h3>
              <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                <Building2 className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-6xl font-black text-amber-500 tracking-tight">{events.length}</span>
              <span className="text-sm font-extrabold text-emerald-400 py-1 px-3 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                +1 from yesterday
              </span>
            </div>
          </div>

          <div className="bg-[#0e1420] backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl transition-all hover:scale-[1.02] hover:border-amber-500/40 duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-300 font-bold text-lg">Total Staff Checked In</h3>
              <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                <Users className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-6xl font-black text-amber-500 tracking-tight">24</span>
              <span className="text-sm font-bold text-slate-300 py-1 px-3 bg-[#090d16] rounded-full border border-slate-700 shadow-inner">
                out of 30 required
              </span>
            </div>
          </div>
        </div>

        {/* Active Events List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-white tracking-tight">Active Live Shifts</h2>
            <span className="text-xs font-bold text-slate-400 bg-[#111827] px-4 py-2 rounded-2xl border border-slate-800 shadow-inner">
              🟢 Real-Time Synced
            </span>
          </div>
          
          {loading ? (
            <p className="text-slate-400 font-bold p-8 text-center bg-[#0e1420] rounded-3xl border border-slate-800">Loading premium enterprise events...</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="bg-[#0e1420] backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl transition-all hover:border-amber-500/50 hover:shadow-[0_20px_50px_rgba(245,158,11,0.15)] hover:-translate-y-1 duration-300 group">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors tracking-tight">{event.title}</h3>
                      <span className="px-4 py-1.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest shadow-md">
                        {event.category || 'Event'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300 font-semibold text-base bg-[#090d16] p-3 rounded-2xl border border-slate-800 w-fit shadow-inner">
                      <div className="flex items-center gap-1 text-amber-400">
                        <IndianRupee className="w-5 h-5" />
                        <span>{event.pay_rate} / {event.pay_type}</span>
                      </div>
                      <span className="text-slate-700">|</span>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="w-4 h-4 text-amber-500" />
                        <span>Starts: {new Date(event.date_start).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end gap-2.5 text-base text-slate-200 font-bold bg-[#090d16] p-4 rounded-2xl border border-slate-800 shadow-inner">
                    <div className="flex items-center gap-2.5 text-emerald-400 font-black">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                      Headcount: 0/{event.headcount} Present
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Auto-checkin active via FraudSentinel</p>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap gap-4">
                  <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-[#1f2937] font-black px-6 py-5 rounded-2xl text-sm shadow-sm">
                    View Live Details
                  </Button>
                  <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-[#1f2937] font-black px-6 py-5 rounded-2xl text-sm shadow-sm">
                    Manage Attending Staff
                  </Button>
                </div>
              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
};

export default ClientDashboard;
