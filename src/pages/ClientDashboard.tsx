import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "../lib/supabase";

const ClientDashboard = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [payRate, setPayRate] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setEvents(data);
      }
    }
    setLoading(false);
  };

  const handlePostEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase.from('events').insert({
        client_id: user.id,
        title: title || 'Security Guard',
        category: category || 'security',
        pay_rate: payRate ? parseFloat(payRate) : 500,
        pay_type: 'daily',
        headcount: 5,
        date_start: new Date().toISOString(),
        date_end: new Date(Date.now() + 86400000).toISOString()
      });

      if (!error) {
        setIsPosting(false);
        setTitle("");
        setCategory("");
        setPayRate("");
        fetchEvents();
      } else {
        console.error("Error posting event:", error);
        alert("Failed to post event.");
      }
    }
  };
  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Client Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage your events and staff effectively.</p>
          </div>
          <Button 
            onClick={() => setIsPosting(!isPosting)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-6 py-2 rounded-lg shadow-lg shadow-amber-500/20 transition-all duration-300"
          >
            {isPosting ? "Cancel" : "+ Post New Event"}
          </Button>
        </div>

        {/* Post Event Form */}
        {isPosting && (
          <form onSubmit={handlePostEvent} className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl mb-8 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Create New Event</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  placeholder="e.g. Security Guard"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Category</label>
                <input 
                  type="text" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  placeholder="e.g. security"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Pay Rate</label>
                <input 
                  type="number" 
                  value={payRate}
                  onChange={(e) => setPayRate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  placeholder="e.g. 500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-6 py-2 rounded-lg">
                Submit Event
              </Button>
            </div>
          </form>
        )}

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
          
          {loading ? (
            <p className="text-slate-400">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-slate-400">No active events found. Create one to get started.</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl transition-all hover:border-slate-600 duration-300 group">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-500 transition-colors">{event.title}</h3>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                        {event.category || 'Event'}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">Pay Rate: ₹{event.pay_rate} / {event.pay_type}</p>
                  </div>
                  <div className="flex flex-col md:items-end gap-2 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Headcount: 0/{event.headcount} Present
                    </div>
                    <div>Starts: {new Date(event.date_start).toLocaleDateString()}</div>
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
            ))
          )}

        </div>

      </div>
    </div>
  );
};

export default ClientDashboard;
