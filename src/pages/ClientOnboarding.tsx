import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Using Lucide react for the upload icon if available, otherwise just use text
const UploadIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);

export default function ClientOnboarding() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 sm:p-8 font-sans">
      {/* Subtle background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Client Onboarding</h1>
          <p className="text-slate-400 text-lg">Set up your company profile to get started.</p>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/50">
          <form className="space-y-8">
            
            {/* Logo Upload Section */}
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-600/50 rounded-2xl bg-slate-800/30 hover:bg-slate-800/60 transition-all cursor-pointer group">
              <div className="h-16 w-16 rounded-full bg-slate-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <div className="text-amber-500">
                  <UploadIcon />
                </div>
              </div>
              <p className="text-base font-medium text-slate-200">Upload Company Logo</p>
              <p className="text-sm text-slate-500 mt-1">PNG, JPG up to 5MB</p>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label htmlFor="companyName" className="text-slate-300 font-medium">Company Name</Label>
                <Input 
                  id="companyName" 
                  placeholder="e.g. Acme Corp" 
                  className="bg-slate-900/60 border-slate-700/50 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-slate-100 placeholder:text-slate-600 h-12 rounded-xl transition-all"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="hrContact" className="text-slate-300 font-medium">HR Contact Name</Label>
                <Input 
                  id="hrContact" 
                  placeholder="e.g. Jane Doe" 
                  className="bg-slate-900/60 border-slate-700/50 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-slate-100 placeholder:text-slate-600 h-12 rounded-xl transition-all"
                />
              </div>

              <div className="space-y-2.5 md:col-span-2">
                <Label htmlFor="billingEmail" className="text-slate-300 font-medium">Billing Email</Label>
                <Input 
                  id="billingEmail" 
                  type="email"
                  placeholder="e.g. billing@acmecorp.com" 
                  className="bg-slate-900/60 border-slate-700/50 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-slate-100 placeholder:text-slate-600 h-12 rounded-xl transition-all"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="gstNumber" className="text-slate-300 font-medium">GST Number</Label>
                <Input 
                  id="gstNumber" 
                  placeholder="22AAAAA0000A1Z5" 
                  className="bg-slate-900/60 border-slate-700/50 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-slate-100 placeholder:text-slate-600 h-12 rounded-xl uppercase transition-all"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="cin" className="text-slate-300 font-medium">CIN</Label>
                <Input 
                  id="cin" 
                  placeholder="U12345AB6789CDE012345" 
                  className="bg-slate-900/60 border-slate-700/50 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-slate-100 placeholder:text-slate-600 h-12 rounded-xl uppercase transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-lg h-14 rounded-xl mt-6 transition-colors shadow-lg shadow-amber-500/20">
              Complete Onboarding
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
