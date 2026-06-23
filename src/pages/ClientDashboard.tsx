import { Button } from "@/components/ui/button";

const ClientDashboard = () => {
  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Client Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage your events and staff effectively.</p>
          </div>
          <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-6 py-2 rounded-lg shadow-lg shadow-amber-500/20 transition-all duration-300">
            + Post New Event
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl transition-transform hover:scale-[1.02] duration-300">
            <h3 className="text-slate-400 font-medium mb-2">Active Events Today</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-amber-500">2</span>
              <span className="text-sm text-emerald-400 mb-1">+1 from yesterday</span>
            </div>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl transition-transform hover:scale-[1.02] duration-300">
            <h3 className="text-slate-400 font-medium mb-2">Total Staff Checked In</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-amber-500">24</span>
              <span className="text-sm text-slate-400 mb-1">out of 30 required</span>
            </div>
          </div>
        </div>

        {/* Active Events List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white mb-6">Active Events</h2>
          
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl transition-all hover:border-slate-600 duration-300 group">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-500 transition-colors">Tech Conference 2026</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    In Progress
                  </span>
                </div>
                <p className="text-slate-400 text-sm">Main Hall, Downtown Convention Center</p>
              </div>
              <div className="flex flex-col md:items-end gap-2 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Staffing: 12/15 Present
                </div>
                <div>Ends at 6:00 PM</div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-700/50 flex flex-wrap gap-3">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700">
                View Details
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700">
                Manage Staff
              </Button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ClientDashboard;
