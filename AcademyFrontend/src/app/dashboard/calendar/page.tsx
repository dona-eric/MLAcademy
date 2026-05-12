"use client";

import { useState } from "react";
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  Clock, Zap, Target, BookOpen, Loader2
} from "lucide-react";

export default function CalendarPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchApi("/api/private/learning/dashboard-summary/");
        setSummary(data);
      } catch (err) {
        console.error("Failed to load calendar data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !summary) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090C14]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  
  // Real events from summary deadlines
  const events = (summary.deadlines || [])
    .filter((d: any) => d.date)
    .map((d: any) => {
      const date = new Date(d.date);
      return {
        id: d.id,
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        title: d.title,
        type: d.type,
        color: d.type === 'quiz' ? "text-indigo-400 bg-indigo-500/10" : "text-orange-400 bg-orange-500/10"
      };
    });

  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 text-white">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-white tracking-tight">Mon Calendrier</h1>
          <p className="text-slate-500 font-medium">Planifiez votre apprentissage et ne manquez aucune échéance.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
           <button 
             onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
             className="p-2 hover:bg-white/10 rounded-xl transition-all"
           >
             <ChevronLeft className="h-5 w-5" />
           </button>
           <span className="text-sm font-black uppercase tracking-widest px-4">
             {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
           </span>
           <button 
             onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
             className="p-2 hover:bg-white/10 rounded-xl transition-all"
           >
             <ChevronRight className="h-5 w-5" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Calendar Grid */}
        <div className="lg:col-span-2 space-y-6">
           <div className="grid grid-cols-7 gap-4">
              {days.map(d => (
                <div key={d} className="text-center text-[10px] font-black text-slate-600 uppercase tracking-widest pb-4">{d}</div>
                ))}
                {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const event = events.find(e => 
                  e.day === day && 
                  e.month === currentDate.getMonth() && 
                  e.year === currentDate.getFullYear()
                );
                const isToday = day === new Date().getDate() && 
                                currentDate.getMonth() === new Date().getMonth() && 
                                currentDate.getFullYear() === new Date().getFullYear();
                
                return (
                  <div key={i} className={`aspect-square p-4 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all relative group cursor-pointer ${isToday ? 'border-indigo-500 bg-indigo-500/5' : ''}`}>
                     <span className={`text-xs font-black ${isToday ? 'text-indigo-400' : 'text-slate-500'}`}>{day}</span>
                     {event && (
                        <div className={`mt-2 h-1.5 w-1.5 rounded-full ${event.type === 'quiz' ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : event.type === 'project' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                     )}
                     {event && (
                        <div className="absolute inset-x-0 bottom-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                           <div className={`text-[8px] font-black uppercase tracking-tighter p-1 rounded ${event.color} truncate`}>
                              {event.title}
                           </div>
                        </div>
                     )}
                  </div>
                );
              })}
           </div>
        </div>

        {/* Upcoming Events List */}
        <div className="space-y-10">
           <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Événements à venir</h3>
           <div className="space-y-6">
              {events.map(event => (
                <div key={event.id} className="flex gap-6 items-start group">
                   <div className="text-center shrink-0">
                      <p className="text-2xl font-black text-white">{event.day}</p>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mai</p>
                   </div>
                   <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                         {event.type === 'quiz' ? <Zap className="h-3 w-3 text-indigo-400" /> : event.type === 'project' ? <Target className="h-3 w-3 text-orange-400" /> : <Clock className="h-3 w-3 text-emerald-400" />}
                         <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{event.type}</p>
                      </div>
                      <h4 className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">{event.title}</h4>
                   </div>
                </div>
              ))}
           </div>

           <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest text-white">Conseil de réussite</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Les étudiants qui planifient au moins 5 heures par semaine ont 3x plus de chances de terminer leur certification dans les temps.</p>
              <button className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-[10px] font-black uppercase tracking-widest transition-all">
                 Synchroniser Google Calendar
              </button>
           </div>
        </div>

      </div>

    </div>
  );
}
