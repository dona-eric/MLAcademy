"use client";

import { useEffect, useState, useRef } from "react";
import { Users, TrendingUp, Bell, ChevronRight, FileText, LogOut, Layout, Mail, Loader2, XCircle, UserCheck, ShieldAlert, Send, History, CreditCard, ShieldCheck, ExternalLink, Search, MoreVertical } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); 
  const [apps, setApps] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [paths, setPaths] = useState<any[]>([]);
  const [adminNotifications, setAdminNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  

  
  // Communication State
  const [commData, setCommData] = useState({
     mode: 'message',
     target_type: 'students',
     user_id: '',
     subject: '',
     content: ''
  });
  const [sending, setSending] = useState(false);

  const router = useRouter();

  // Click outside notifications dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (authLoading) return;

    const hasToken = typeof window !== 'undefined' && localStorage.getItem("access_token");
    
    if (!user || (!user.is_staff && !user.is_superuser)) {
       // Si on n'a pas d'utilisateur mais qu'on a un token, on attend peut-être encore un peu
       if (hasToken && !user) return; 

       router.replace("/admin/login");
       return;
    }
    loadData();
  }, [user, authLoading, router]);

  async function loadData() {
    setLoading(true);
    try {
      const [statsData, appsData, enrollData, auditData, transData, notifData, coursesData, pathsData] = await Promise.all([
        fetchApi("/api/admin/management/stats/"),
        fetchApi("/api/admin/management/instructor-applications/"),
        fetchApi("/api/admin/management/enrollments/"),
        fetchApi("/api/admin/management/audit/"),
        fetchApi("/api/admin/management/transactions/"),
        fetchApi("/api/private/learning/notifications/"),
        fetchApi("/api/public/courses/"),
        fetchApi("/api/public/courses/paths/")
      ]);
      setStats(statsData);
      setApps(Array.isArray(appsData) ? appsData : (appsData?.results || []));
      setEnrollments(Array.isArray(enrollData) ? enrollData : (enrollData?.results || []));
      setAuditLogs(Array.isArray(auditData) ? auditData : (auditData?.results || []));
      setTransactions(Array.isArray(transData) ? transData : (transData?.results || []));
      setAdminNotifications(Array.isArray(notifData) ? notifData : (notifData?.results || []));
      setCourses(Array.isArray(coursesData) ? coursesData : (coursesData?.results || []));
      setPaths(Array.isArray(pathsData) ? pathsData : (pathsData?.results || []));
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (id: number) => {
     try {
        await fetchApi(`/api/admin/management/instructor-applications/${id}/approve/`, { method: 'POST' });
        loadData();
        setSelectedApp(null);
     } catch (err) { alert("Erreur d'approbation"); }
  }

  const handleReject = async (id: number) => {
     const reason = prompt("Motif du refus :");
     if (!reason) return;
     try {
        await fetchApi(`/api/admin/management/instructor-applications/${id}/reject/`, { 
           method: 'POST', 
           body: JSON.stringify({ reason }) 
        });
        loadData();
        setSelectedApp(null);
     } catch (err) { alert("Erreur de refus"); }
  }



  const handleSendComm = async (e: React.FormEvent) => {
     e.preventDefault();
     setSending(true);
     try {
        const res = await fetchApi("/api/admin/management/communication/", {
           method: 'POST',
           body: JSON.stringify(commData)
        });
        alert("Communication envoyée avec succès !");
        setCommData({...commData, subject: '', content: '', user_id: ''});
     } catch (err: any) {
        alert(err.message || "Erreur d'envoi");
     } finally {
        setSending(false);
     }
  }

  const quickMessage = (userId: string, email: string) => {
     setActiveTab('messages');
     setCommData({...commData, target_type: 'single', user_id: userId, subject: `Action Administrative pour ${email}`});
  }

  if (loading || authLoading || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-secondary)]">
        <div className="flex flex-col items-center gap-4">
           <Loader2 className="h-10 w-10 animate-spin text-[var(--info)]" />
           <p className="text-xs font-black text-[var(--text-tertiary)] uppercase tracking-widest text-center">Loading MLAcademy...</p>
        </div>
      </div>
    );
  }

  const { summary, active_admins } = stats;

  return (
    <div className="flex h-screen bg-[var(--bg-secondary)] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--bg-primary)] flex flex-col shrink-0 border-r border-[var(--border-default)] z-40">
        <div className="h-[72px] px-6 flex items-center gap-3 border-b border-[var(--border-default)]">
          <div className="h-8 w-8 rounded-lg bg-[var(--brand-500)] flex items-center justify-center text-white shadow-lg shadow-[var(--brand-glow)]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-[var(--text-primary)] tracking-tight">MLAcademy</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-3 py-2 text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Dashboard</p>
          <NavItem icon={<Layout className="h-4 w-4" />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <NavItem icon={<TrendingUp className="h-4 w-4" />} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          
          <p className="px-3 py-2 mt-6 text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">User</p>
          <NavItem icon={<UserCheck className="h-4 w-4" />} label="Instructor" active={activeTab === 'instructors'} onClick={() => setActiveTab('instructors')} />
          <NavItem icon={<Users className="h-4 w-4" />} label="Students" active={activeTab === 'enrollments'} onClick={() => setActiveTab('enrollments')} />
          
          <p className="px-3 py-2 mt-6 text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Management</p>
          <NavItem icon={<Mail className="h-4 w-4" />} label="Communications" active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} />
          <NavItem icon={<History className="h-4 w-4" />} label="Audit Logs" active={activeTab === 'audit'} onClick={() => setActiveTab('audit')} />
          <NavItem icon={<CreditCard className="h-4 w-4" />} label="Finances" active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} />
        </nav>

        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50">
           <div className="flex items-center gap-3 mb-4 px-3">
             <img src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.first_name || user?.username}&background=3B82F6&color=fff`} alt="Admin" className="w-10 h-10 rounded-full border border-[var(--border-default)]" />
             <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user?.first_name} {user?.last_name}</p>
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">{user?.is_superuser ? 'Super Admin' : 'Admin Staff'}</p>
             </div>
           </div>
           <button onClick={() => router.push("/admin/login")} className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-all text-sm w-full font-medium">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-[72px] bg-[var(--bg-primary)] flex items-center justify-between px-6 border-b border-[var(--border-default)] sticky top-0 z-30">
          <div className="flex-1 max-w-md">
             <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
                <input type="text" placeholder="Search" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-lg py-2 pl-10 pr-4 text-sm font-medium placeholder:text-[var(--text-tertiary)] focus:ring-2 focus:ring-[var(--brand-500)] focus:border-[var(--brand-500)] transition-all outline-none" />
             </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative" ref={notifRef}>
                <button 
                   onClick={() => setShowNotifs(!showNotifs)}
                   className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full transition-all relative group"
                >
                   <Bell className="h-5 w-5 text-[var(--text-secondary)]" />
                   {adminNotifications.length > 0 && <span className="absolute top-1 right-1 h-2 w-2 bg-[var(--error)] rounded-full" />}
                </button>
                
                <AnimatePresence>
                   {showNotifs && (
                      <motion.div 
                         initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                         className="absolute right-0 mt-4 w-80 bg-[var(--bg-primary)] rounded-xl shadow-lg border border-[var(--border-default)] overflow-hidden"
                      >
                         <div className="p-4 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--text-primary)]">Notifications</span>
                            <span className="text-[10px] font-bold text-[var(--brand-500)] bg-[var(--brand-50)] px-2 py-0.5 rounded-full">{adminNotifications.length}</span>
                         </div>
                         <div className="max-h-96 overflow-y-auto p-2 space-y-1">
                            {adminNotifications.length === 0 ? (
                               <p className="text-xs font-medium text-[var(--text-secondary)] text-center py-8">Aucune alerte</p>
                            ) : (
                               adminNotifications.map(n => (
                                  <div key={n.id} className="p-3 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors cursor-pointer">
                                     <p className="text-sm font-semibold text-[var(--text-primary)]">{n.title}</p>
                                     <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-1">{n.content}</p>
                                  </div>
                               ))
                            )}
                         </div>
                      </motion.div>
                   )}
                </AnimatePresence>
             </div>
             
             <div className="h-8 w-8 rounded-full border border-[var(--border-default)] overflow-hidden cursor-pointer" onClick={() => router.push("/profile/edit")}>
                <img src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.first_name}&background=f4f7fe&color=3B82F6`} alt="Avatar" className="w-full h-full object-cover" />
             </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
           <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                 <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="font-bold text-[var(--text-primary)] text-2xl">Overview</h3>
                       <button className="bg-[var(--brand-500)] text-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium hover:bg-[var(--brand-600)] transition-all">Export Report</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                       <StatCard label="Sales" value={`$${summary.total_revenue}`} trend="+20.9$" trendLabel="Revenue" icon={<CreditCard className="h-5 w-5 text-[var(--brand-500)]" />} />
                       <StatCard label="Courses" value={summary.total_courses} trend="+120" trendLabel="Number of courses" icon={<FileText className="h-5 w-5 text-[var(--brand-500)]" />} />
                       <StatCard label="Students" value={summary.total_students} trend="+1200" trendLabel="Students" icon={<Users className="h-5 w-5 text-[var(--brand-500)]" />} />
                       <StatCard label="Instructor" value={summary.total_instructors} trend="+200" trendLabel="Instructor" icon={<UserCheck className="h-5 w-5 text-[var(--brand-500)]" />} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                       <div className="lg:col-span-2 bg-[var(--bg-primary)] rounded-xl p-6 shadow-sm border border-[var(--border-default)]">
                          <div className="flex items-center justify-between mb-8">
                             <h3 className="font-bold text-[var(--text-primary)] text-lg">Earnings</h3>
                             <MoreVertical className="h-5 w-5 text-[var(--text-tertiary)]" />
                          </div>
                          <div className="h-64 w-full flex items-end gap-1 px-2 relative">
                             {/* SVG Curvy Line Placeholder matching Geeks */}
                             <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <path d="M 0 80 Q 15 50 30 70 T 60 50 T 85 60 T 100 30" fill="none" stroke="var(--brand-500)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                             </svg>
                             <div className="absolute bottom-0 w-full flex justify-between text-xs text-[var(--text-tertiary)] font-medium">
                                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                             </div>
                          </div>
                       </div>

                       <div className="bg-[var(--bg-primary)] rounded-xl p-6 shadow-sm border border-[var(--border-default)]">
                          <div className="flex items-center justify-between mb-8">
                             <h3 className="font-bold text-[var(--text-primary)] text-lg">Traffic</h3>
                             <MoreVertical className="h-5 w-5 text-[var(--text-tertiary)]" />
                          </div>
                          <div className="flex flex-col items-center justify-center h-48">
                             <div className="relative w-40 h-40 rounded-full border-[16px] border-[var(--brand-500)] border-r-indigo-200 border-b-indigo-100 flex items-center justify-center">
                             </div>
                          </div>
                          <div className="flex justify-center gap-4 mt-6 text-xs text-[var(--text-secondary)] font-medium">
                             <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--brand-500)]"></span> Direct</div>
                             <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-200"></span> Referral</div>
                             <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--brand-100)]"></span> Organic</div>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                       <div className="bg-[var(--bg-primary)] rounded-xl shadow-sm border border-[var(--border-default)]">
                          <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
                             <h3 className="font-bold text-[var(--text-primary)]">Popular Instructor</h3>
                             <button className="text-xs font-semibold px-3 py-1 border border-[var(--border-default)] rounded hover:bg-[var(--bg-secondary)]">View all</button>
                          </div>
                          <div className="p-0">
                             {(stats.popular_instructors && stats.popular_instructors.length > 0) ? (
                                stats.popular_instructors.map((inst: any) => {
                                   const name = inst.first_name || inst.last_name ? `${inst.first_name} ${inst.last_name}`.trim() : inst.email.split('@')[0];
                                   const avatar = inst.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E0E7FF&color=4338CA`;
                                   return (
                                      <div key={inst.id} className="flex items-center gap-4 p-4 border-b border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)]">
                                         <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                                         <div className="flex-1">
                                            <p className="text-sm font-semibold text-[var(--text-primary)]">{name}</p>
                                            <div className="flex gap-3 text-xs text-[var(--text-secondary)] mt-1">
                                               <span>{inst.courses_count} {inst.courses_count > 1 ? 'Cours' : 'Cours'}</span>
                                               <span>{inst.students_count} {inst.students_count > 1 ? 'Apprenants' : 'Apprenant'}</span>
                                            </div>
                                         </div>
                                         <MoreVertical className="h-4 w-4 text-[var(--text-tertiary)]" />
                                      </div>
                                   );
                                })
                             ) : (
                                <p className="text-sm text-[var(--text-secondary)] text-center py-8">Aucun instructeur populaire</p>
                             )}
                          </div>
                       </div>

                       <div className="bg-[var(--bg-primary)] rounded-xl shadow-sm border border-[var(--border-default)]">
                          <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
                             <h3 className="font-bold text-[var(--text-primary)]">Applications</h3>
                             <button onClick={() => setActiveTab('instructors')} className="text-xs font-semibold px-3 py-1 border border-[var(--border-default)] rounded hover:bg-[var(--bg-secondary)]">View all</button>
                          </div>
                          <div className="p-0">
                             {apps.slice(0, 3).map(app => (
                                <div key={app.id} className="flex items-center gap-4 p-4 border-b border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)] cursor-pointer" onClick={() => setSelectedApp(app)}>
                                   <div className="h-10 w-10 rounded-lg bg-[var(--brand-100)] flex shrink-0 items-center justify-center text-[var(--brand-500)] font-bold">{app.user_full_name?.[0]}</div>
                                   <div className="flex-1">
                                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{app.user_full_name}</p>
                                      <p className="text-xs text-[var(--text-secondary)] truncate">{app.expertise}</p>
                                   </div>
                                   <MoreVertical className="h-4 w-4 text-[var(--text-tertiary)] shrink-0" />
                                </div>
                             ))}
                             {apps.length === 0 && <p className="text-sm text-[var(--text-secondary)] text-center py-8">Aucune candidature</p>}
                          </div>
                       </div>

                       <div className="bg-[var(--bg-primary)] rounded-xl shadow-sm border border-[var(--border-default)]">
                          <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
                             <h3 className="font-bold text-[var(--text-primary)]">Activity</h3>
                          </div>
                          <div className="p-0">
                             {auditLogs.slice(0, 4).map(log => (
                                <div key={log.id} className="flex gap-4 p-4 border-b border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)]">
                                   <div className="h-10 w-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex shrink-0 items-center justify-center">
                                      <History className="h-4 w-4 text-[var(--text-tertiary)]" />
                                   </div>
                                   <div>
                                      <p className="text-sm font-semibold text-[var(--text-primary)]">{log.action}</p>
                                      <p className="text-xs text-[var(--text-secondary)] line-clamp-1 mt-0.5">{log.details}</p>
                                      <p className="text-[10px] text-[var(--text-tertiary)] mt-1">{new Date(log.created_at).toLocaleTimeString()}</p>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </motion.div>
              )}

              {activeTab === 'instructors' && (
                 <motion.div key="instructors" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="font-bold text-[var(--text-primary)] text-2xl">Instructor <span className="text-[var(--text-tertiary)] font-medium text-lg">({apps.length})</span></h3>
                       <div className="text-xs text-[var(--text-secondary)] hidden sm:block">Dashboard <ChevronRight className="inline h-3 w-3" /> User <ChevronRight className="inline h-3 w-3" /> <span className="text-[var(--brand-500)]">Instructor</span></div>
                    </div>

                    <div className="bg-[var(--bg-primary)] p-4 rounded-xl shadow-sm border border-[var(--border-default)] mb-6">
                       <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
                          <input type="text" placeholder="Search Instructors" className="w-full bg-transparent border-none focus:outline-none text-sm pl-10 pr-4" />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                       {apps.map((app) => (
                          <div key={app.id} className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-default)] shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all group">
                             <div className="p-6 flex flex-col items-center border-b border-[var(--border-subtle)] relative cursor-pointer" onClick={() => setSelectedApp(app)}>
                                <div className="absolute top-4 right-4"><MoreVertical className="h-5 w-5 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]" /></div>
                                <div className="h-20 w-20 rounded-full bg-[var(--brand-50)] flex items-center justify-center text-[var(--brand-500)] font-bold text-2xl mb-4 border-2 border-white shadow-sm">
                                   {app.user_full_name?.[0] || 'I'}
                                </div>
                                <h4 className="font-bold text-[var(--text-primary)] text-lg mb-1 truncate w-full text-center hover:text-[var(--brand-500)] transition-colors">{app.user_full_name || 'Sans Nom'}</h4>
                                <p className="text-xs text-[var(--text-secondary)]">{app.expertise}</p>
                                <span className={`mt-3 text-[10px] font-bold uppercase px-3 py-1 rounded-full ${app.status === 'pending' ? 'bg-[var(--warning-light)] text-[var(--warning)]' : app.status === 'approved' || app.status === 'accepted' ? 'bg-emerald-100 text-[var(--success)]' : 'bg-rose-100 text-[var(--error)]'}`}>
                                   {app.status}
                                </span>
                             </div>
                             <div className="flex bg-[var(--bg-secondary)] p-4 text-center divide-x divide-slate-200 text-xs">
                                <div className="flex-1 px-1 flex flex-col justify-between">
                                   <span className="text-[var(--text-secondary)] mb-1">Students</span>
                                   <span className="font-bold text-[var(--text-primary)]">-</span>
                                </div>
                                <div className="flex-1 px-1 flex flex-col justify-between">
                                   <span className="text-[var(--text-secondary)] mb-1">Rating</span>
                                   <span className="font-bold text-[var(--warning)] flex items-center justify-center gap-1">New</span>
                                </div>
                                <div className="flex-1 px-1 flex flex-col justify-between">
                                   <span className="text-[var(--text-secondary)] mb-1">Courses</span>
                                   <span className="font-bold text-[var(--text-primary)]">-</span>
                                </div>
                             </div>
                          </div>
                       ))}
                       {apps.length === 0 && <div className="col-span-full py-12 text-center text-[var(--text-secondary)] bg-[var(--bg-primary)] rounded-xl border border-[var(--border-default)] border-dashed">Aucun instructeur ou candidature</div>}
                    </div>
                 </motion.div>
              )}

              {activeTab === 'enrollments' && (
                 <motion.div key="enrollments" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="font-bold text-[var(--text-primary)] text-2xl">Students <span className="text-[var(--text-tertiary)] font-medium text-lg">({enrollments.length})</span></h3>
                       <div className="text-xs text-[var(--text-secondary)] hidden sm:block">Dashboard <ChevronRight className="inline h-3 w-3" /> User <ChevronRight className="inline h-3 w-3" /> <span className="text-[var(--brand-500)]">Students</span></div>
                    </div>

                    <div className="bg-[var(--bg-primary)] p-4 rounded-xl shadow-sm border border-[var(--border-default)] mb-6">
                       <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
                          <input type="text" placeholder="Search Students" className="w-full bg-transparent border-none focus:outline-none text-sm pl-10 pr-4" />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                       {enrollments.map((enrollment) => (
                          <div key={enrollment.id} className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-default)] shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all group">
                             <div className="p-6 flex flex-col items-center border-b border-[var(--border-subtle)] relative">
                                <div className="absolute top-4 right-4"><MoreVertical className="h-5 w-5 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] cursor-pointer" /></div>
                                <div className="h-20 w-20 rounded-full bg-[var(--brand-50)] flex items-center justify-center text-[var(--brand-500)] font-bold text-2xl mb-4 border-2 border-white shadow-sm">
                                   {enrollment.user_full_name?.[0] || enrollment.user_email?.[0]?.toUpperCase() || 'S'}
                                </div>
                                <h4 className="font-bold text-[var(--text-primary)] text-lg mb-1 truncate w-full text-center hover:text-[var(--brand-500)] transition-colors cursor-pointer">{enrollment.user_full_name || enrollment.user_email}</h4>
                                <p className="text-xs text-[var(--text-tertiary)] flex items-center gap-1 justify-center truncate w-full px-4"><Mail className="h-3 w-3 shrink-0" /> {enrollment.user_email}</p>
                             </div>
                             <div className="flex bg-[var(--bg-secondary)] p-4 text-center divide-x divide-slate-200 text-xs">
                                <div className="flex-1 px-1 flex flex-col justify-between">
                                   <span className="text-[var(--text-secondary)] mb-1">Payments</span>
                                   <span className="font-bold text-[var(--text-primary)]">-</span>
                                </div>
                                <div className="flex-1 px-1 flex flex-col justify-between">
                                   <span className="text-[var(--text-secondary)] mb-1">Joined</span>
                                   <span className="font-bold text-[var(--text-primary)]">{new Date(enrollment.enrolled_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex-1 px-1 flex flex-col justify-between">
                                   <span className="text-[var(--text-secondary)] mb-1">Course</span>
                                   <span className="font-bold text-[var(--text-primary)] truncate px-1" title={enrollment.course_title}>{enrollment.course_title}</span>
                                </div>
                             </div>
                          </div>
                       ))}
                       {enrollments.length === 0 && <div className="col-span-full py-12 text-center text-[var(--text-secondary)] bg-[var(--bg-primary)] rounded-xl border border-[var(--border-default)] border-dashed">Aucun étudiant inscrit</div>}
                    </div>
                 </motion.div>
              )}
              {activeTab === 'analytics' && (
                 <motion.div key="analytics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="font-bold text-[var(--text-primary)] text-2xl">Analytics</h3>
                       <div className="text-xs text-[var(--text-secondary)] hidden sm:block">Dashboard <ChevronRight className="inline h-3 w-3" /> <span className="text-[var(--brand-500)]">Analytics</span></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                       <div className="bg-[var(--bg-primary)] rounded-xl p-6 shadow-sm border border-[var(--border-default)]">
                          <p className="text-sm font-semibold text-[var(--text-secondary)] mb-2">User</p>
                          <h4 className="text-2xl font-bold text-[var(--text-primary)] mb-2">30.6k</h4>
                          <div className="flex items-center justify-between mt-4">
                             <div className="h-8 w-24 bg-[var(--brand-50)] rounded overflow-hidden relative">
                                <svg className="absolute inset-0 h-full w-full opacity-50" preserveAspectRatio="none" viewBox="0 0 100 100">
                                   <path d="M 0 50 Q 25 30 50 60 T 100 20 L 100 100 L 0 100 Z" fill="var(--brand-500)" />
                                </svg>
                             </div>
                             <span className="text-xs font-semibold text-[var(--success)] bg-[var(--success-light)] px-2 py-1 rounded">
                                +20%
                             </span>
                          </div>
                       </div>
                       <div className="bg-[var(--bg-primary)] rounded-xl p-6 shadow-sm border border-[var(--border-default)]">
                          <p className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Unique Visitors</p>
                          <h4 className="text-2xl font-bold text-[var(--text-primary)] mb-2">12.2k</h4>
                          <div className="flex items-center justify-between mt-4">
                             <div className="h-8 w-24 bg-[var(--warning-light)] rounded overflow-hidden relative">
                                <svg className="absolute inset-0 h-full w-full opacity-50" preserveAspectRatio="none" viewBox="0 0 100 100">
                                   <path d="M 0 80 Q 25 40 50 50 T 100 30 L 100 100 L 0 100 Z" fill="#f59e0b" />
                                </svg>
                             </div>
                             <span className="text-xs font-semibold text-[var(--error)] bg-[var(--error-light)] px-2 py-1 rounded">
                                -10%
                             </span>
                          </div>
                       </div>
                       <div className="bg-[var(--bg-primary)] rounded-xl p-6 shadow-sm border border-[var(--border-default)]">
                          <p className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Bounce Rate</p>
                          <h4 className="text-2xl font-bold text-[var(--text-primary)] mb-2">42.2%</h4>
                          <div className="flex items-center justify-between mt-4">
                             <div className="h-8 w-24 bg-[var(--success-light)] rounded overflow-hidden relative">
                                <svg className="absolute inset-0 h-full w-full opacity-50" preserveAspectRatio="none" viewBox="0 0 100 100">
                                   <path d="M 0 50 Q 25 30 50 60 T 100 20 L 100 100 L 0 100 Z" fill="#10b981" />
                                </svg>
                             </div>
                             <span className="text-xs font-semibold text-[var(--success)] bg-[var(--success-light)] px-2 py-1 rounded">
                                +12%
                             </span>
                          </div>
                       </div>
                       <div className="bg-[var(--bg-primary)] rounded-xl p-6 shadow-sm border border-[var(--border-default)]">
                          <p className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Average Visit Time</p>
                          <h4 className="text-2xl font-bold text-[var(--text-primary)] mb-2">12m 42s</h4>
                          <div className="flex items-center justify-between mt-4">
                             <div className="h-8 w-24 bg-blue-50 rounded overflow-hidden relative">
                                <svg className="absolute inset-0 h-full w-full opacity-50" preserveAspectRatio="none" viewBox="0 0 100 100">
                                   <path d="M 0 20 Q 25 60 50 40 T 100 80 L 100 100 L 0 100 Z" fill="#3b82f6" />
                                </svg>
                             </div>
                             <span className="text-xs font-semibold text-[var(--success)] bg-[var(--success-light)] px-2 py-1 rounded">
                                +8%
                             </span>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                       <div className="lg:col-span-2 bg-[var(--bg-primary)] rounded-xl p-6 shadow-sm border border-[var(--border-default)]">
                          <div className="flex items-center justify-between mb-8">
                             <h3 className="font-bold text-[var(--text-primary)] text-lg">Sessions</h3>
                             <div className="flex gap-2">
                                <button className="text-xs text-white bg-[var(--brand-500)] px-3 py-1 rounded-full">2024</button>
                                <button className="text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] px-3 py-1 rounded-full border border-transparent hover:border-[var(--border-default)]">2025</button>
                             </div>
                          </div>
                          <div className="h-64 w-full flex items-end gap-1 px-2 relative border-l border-b border-[var(--border-subtle)] ml-6 mb-6">
                             {/* SVG Curvy Line Placeholder matching Geeks Sessions */}
                             <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <path d="M 0 80 Q 20 60 40 70 T 70 30 T 100 20" fill="none" stroke="var(--brand-500)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                                <path d="M 0 90 Q 20 80 40 85 T 70 50 T 100 60" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
                             </svg>
                             <div className="absolute -left-8 top-0 bottom-0 flex flex-col justify-between text-[10px] text-[var(--text-tertiary)]">
                                <span>30k</span><span>20k</span><span>10k</span><span>0</span>
                             </div>
                             <div className="absolute -bottom-6 w-full flex justify-between text-[10px] text-[var(--text-tertiary)]">
                                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                             </div>
                          </div>
                       </div>

                       <div className="bg-[var(--bg-primary)] rounded-xl p-6 shadow-sm border border-[var(--border-default)]">
                          <div className="flex items-center justify-between mb-8">
                             <h3 className="font-bold text-[var(--text-primary)] text-lg">Active User</h3>
                          </div>
                          <div className="h-64 flex items-end justify-between px-2">
                             {[30, 45, 20, 60, 40, 75, 50, 90, 65].map((h, i) => (
                                <div key={i} className="w-6 bg-[var(--bg-tertiary)] rounded-t-sm hover:bg-[var(--brand-500)] transition-colors" style={{ height: `${h}%` }}></div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </motion.div>
              )}
              {activeTab === 'finance' && (
                 <motion.div key="finance" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[var(--bg-primary)] rounded-[40px] p-10 shadow-sm border border-[var(--border-subtle)]">
                    <h3 className="font-black text-[var(--text-primary)] uppercase tracking-widest text-sm mb-10 flex items-center gap-2"><CreditCard className="h-5 w-5 text-[var(--success)]" /> Grand Livre des Transactions</h3>
                    <div className="overflow-x-auto">
                       <table className="w-full text-left">
                          <thead>
                             <tr className="border-b border-[var(--border-subtle)]">
                                <th className="pb-4 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Client</th>
                                <th className="pb-4 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Détail</th>
                                <th className="pb-4 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Montant</th>
                                <th className="pb-4 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest text-right">Horodatage</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                             {transactions.map((t) => (
                                <tr key={t.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                                   <td className="py-4 text-xs font-black text-[var(--text-primary)]">{t.user_email}</td>
                                   <td className="py-4 text-xs font-bold text-[var(--text-secondary)]">{t.course_title}</td>
                                   <td className="py-4 text-xs font-black text-[var(--success)]">${t.amount}</td>
                                   <td className="py-4 text-right text-[10px] font-black text-[var(--text-tertiary)] uppercase">{new Date(t.created_at).toLocaleString('fr-FR')}</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </motion.div>
              )}

              {activeTab === 'audit' && (
                 <motion.div key="audit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[var(--bg-primary)] rounded-[40px] p-10 shadow-sm border border-[var(--border-subtle)]">
                    <h3 className="font-black text-[var(--text-primary)] uppercase tracking-widest text-sm mb-10 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[var(--info)]" /> Traçabilité des Actions</h3>
                    <div className="space-y-4">
                       {auditLogs.map((log) => (
                          <div key={log.id} className="p-5 bg-[var(--bg-secondary)] rounded-3xl flex items-center justify-between border border-[var(--border-subtle)] hover:bg-[var(--bg-tertiary)] transition-colors">
                             <div className="flex items-center gap-5">
                                <div className="h-10 w-10 rounded-2xl bg-[var(--bg-primary)] flex items-center justify-center text-[var(--info)] shadow-sm font-black text-xs uppercase">{log.admin_email[0]}</div>
                                <div>
                                   <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-black bg-[var(--info)] text-white px-2 py-0.5 rounded-full">{log.action}</span>
                                      <span className="text-xs font-black text-[var(--text-primary)]">{log.admin_email}</span>
                                   </div>
                                   <p className="text-[11px] text-[var(--text-tertiary)] font-bold mt-1">{log.details}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase">{new Date(log.created_at).toLocaleTimeString()}</p>
                                <p className="text-[9px] font-bold text-[var(--text-tertiary)] tracking-widest">{log.ip_address}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </motion.div>
              )}

              {activeTab === 'messages' && (
                 <motion.div key="messages" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="lg:grid lg:grid-cols-3 lg:gap-10">
                    <div className="lg:col-span-2 bg-[var(--bg-primary)] rounded-[40px] p-10 shadow-sm border border-[var(--border-subtle)]">
                       <h3 className="font-black text-[var(--text-primary)] uppercase tracking-widest text-sm mb-10 flex items-center gap-3"><Send className="h-4 w-4 text-[var(--info)]" /> Communication Center</h3>
                       <form onSubmit={handleSendComm} className="space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest px-1">Cible de Diffusion</label>
                                <select value={commData.target_type} onChange={(e) => setCommData({...commData, target_type: e.target.value})} className="w-full bg-[var(--bg-secondary)] border-none rounded-2xl py-4 px-6 font-bold text-[var(--text-primary)] focus:ring-2 focus:border-[var(--info)] appearance-none">
                                   <option value="students">Tous les Étudiants</option>
                                   <option value="instructors">Tous les Instructeurs</option>
                                   <option value="all">Tout MLAcademy</option>
                                   <option value="single">Utilisateur Ciblé</option>
                                </select>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest px-1">Mode d'Envoi</label>
                                <div className="flex bg-[var(--bg-secondary)] p-1 rounded-2xl">
                                   <button type="button" onClick={() => setCommData({...commData, mode: 'message'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${commData.mode === 'message' ? 'bg-[var(--bg-primary)] shadow-sm text-[var(--info)]' : 'text-[var(--text-tertiary)]'}`}>Interne</button>
                                   <button type="button" onClick={() => setCommData({...commData, mode: 'email'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${commData.mode === 'email' ? 'bg-[var(--bg-primary)] shadow-sm text-[var(--info)]' : 'text-[var(--text-tertiary)]'}`}>Real Email</button>
                                </div>
                             </div>
                          </div>
                          
                          {commData.target_type === 'single' && (
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest px-1">ID Utilisateur / Email</label>
                                <input type="text" value={commData.user_id} onChange={(e) => setCommData({...commData, user_id: e.target.value})} className="w-full bg-[var(--bg-secondary)] border-none rounded-2xl py-4 px-6 font-bold" placeholder="Ex: 42 ou email@example.com" />
                             </div>
                          )}

                          <div className="space-y-2"><label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest px-1">Sujet Officiel</label><input type="text" value={commData.subject} onChange={(e) => setCommData({...commData, subject: e.target.value})} className="w-full bg-[var(--bg-secondary)] border-none rounded-2xl py-4 px-6 font-bold" placeholder="Objet du message..." /></div>
                          <div className="space-y-2"><label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest px-1">Corps du Message</label><textarea rows={6} value={commData.content} onChange={(e) => setCommData({...commData, content: e.target.value})} className="w-full bg-[var(--bg-secondary)] border-none rounded-[32px] py-4 px-6 font-medium text-[var(--text-primary)] resize-none focus:ring-2 focus:border-[var(--info)]" placeholder="Rédigez ici..." /></div>
                          
                          <button type="submit" disabled={sending} className="w-full bg-[var(--info)] text-white font-black py-5 rounded-[32px] shadow-2xl shadow-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                             {sending ? <Loader2 className="h-6 w-6 animate-spin" /> : <><Send className="h-5 w-5" /> EXÉCUTER LA DIFFUSION</>}
                          </button>
                       </form>
                    </div>
                    <div className="space-y-8">
                       <div className="bg-[var(--bg-primary)] rounded-[40px] p-10 text-white shadow-2xl">
                          <ShieldAlert className="h-10 w-10 text-[var(--warning)] mb-6" />
                          <h4 className="text-xl font-black tracking-tight mb-4 text-white uppercase">Consignes</h4>
                          <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase leading-relaxed tracking-widest">Chaque message envoyé via cette console est enregistré dans l'Audit Log. Les emails SMTP utilisent le nom de domaine officiel.</p>
                          <div className="mt-10 p-6 bg-[var(--bg-primary)]/5 rounded-3xl border border-white/10 text-center">
                             <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Statut Serveur</p>
                             <div className="flex items-center justify-center gap-2">
                                <div className="h-2 w-2 bg-[var(--success-light)]0 rounded-full animate-pulse" />
                                <span className="text-xs font-bold">Mail Gateway OK</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </motion.div>
              )}


           </AnimatePresence>
        </div>
      </main>

      {/* Instructor Detail Modal */}
      <AnimatePresence>
         {selectedApp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-24 bg-[var(--bg-primary)]/40 backdrop-blur-md">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                 className="bg-[var(--bg-primary)] w-full max-w-5xl rounded-[50px] shadow-[0_32px_120px_-10px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-full"
               >
                  <div className="p-10 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-secondary)]/50">
                     <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-[24px] bg-[var(--info)] flex items-center justify-center text-white shadow-2xl shadow-md font-black text-2xl uppercase">{selectedApp.user_full_name?.[0]}</div>
                        <div>
                           <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tighter uppercase">{selectedApp.user_full_name}</h2>
                           <p className="text-[11px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">{selectedApp.user_email}</p>
                        </div>
                     </div>
                     <button onClick={() => setSelectedApp(null)} className="p-3 hover:bg-[var(--bg-primary)] rounded-2xl shadow-sm transition-all"><XCircle className="h-7 w-7 text-slate-200 hover:text-[var(--error)]" /></button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                           <div className="space-y-4">
                              <p className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Dossier d'Expertise</p>
                              <div className="bg-[var(--bg-secondary)] rounded-[32px] p-6 border border-[var(--border-subtle)]">
                                 <p className="text-xs font-black text-[var(--info)] uppercase mb-3 px-3 py-1 bg-blue-50 rounded-full inline-block">{selectedApp.expertise}</p>
                                 <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">{selectedApp.expertise_detail || "Détails non fournis."}</p>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <p className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Motivation Professionnelle</p>
                              <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium bg-[var(--brand-50)]/30 p-6 rounded-[32px] border border-indigo-50 italic">{selectedApp.motivation}</p>
                           </div>
                        </div>

                        <div className="space-y-8">
                           <div className="space-y-4">
                              <p className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Expérience Pédagogique</p>
                              <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium bg-[var(--warning-light)]/30 p-6 rounded-[32px] border border-amber-50">{selectedApp.teaching_experience || "Aucune expérience préalable mentionnée."}</p>
                           </div>
                           <div className="space-y-4">
                              <p className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Réseaux & Documents</p>
                              <div className="grid grid-cols-1 gap-3">
                                 {selectedApp.linkedin_url && (
                                    <a href={selectedApp.linkedin_url} target="_blank" className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-2xl hover:bg-blue-50 transition-all group">
                                       <div className="flex items-center gap-4"><FaLinkedin className="h-5 w-5 text-[var(--info)]" /><span className="text-xs font-black text-[var(--text-primary)] uppercase">LinkedIn Profile</span></div>
                                       <ExternalLink className="h-4 w-4 text-slate-200 group-hover:text-[var(--info)]" />
                                    </a>
                                 )}
                                 {selectedApp.portfolio_url && (
                                    <a href={selectedApp.portfolio_url} target="_blank" className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-2xl hover:bg-[var(--bg-tertiary)] transition-all group">
                                       <div className="flex items-center gap-4"><FaGithub className="h-5 w-5 text-[var(--text-primary)]" /><span className="text-xs font-black text-[var(--text-primary)] uppercase">Portfolio / GitHub</span></div>
                                       <ExternalLink className="h-4 w-4 text-slate-200 group-hover:text-[var(--text-primary)]" />
                                    </a>
                                 )}
                                 {selectedApp.cv_url && (
                                    <a href={selectedApp.cv_url} target="_blank" className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-2xl hover:bg-[var(--success-light)] transition-all group">
                                       <div className="flex items-center gap-4"><FileText className="h-5 w-5 text-[var(--success)]" /><span className="text-xs font-black text-[var(--text-primary)] uppercase">Curriculum Vitae</span></div>
                                       <ExternalLink className="h-4 w-4 text-slate-200 group-hover:text-[var(--success)]" />
                                    </a>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="p-10 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 flex items-center justify-between">
                     <button onClick={() => quickMessage(String(selectedApp.user), selectedApp.user_email)} className="flex items-center gap-3 text-xs font-black text-[var(--info)] hover:text-blue-700 uppercase tracking-[0.2em] px-6 py-3 bg-[var(--bg-primary)] rounded-2xl shadow-sm"><Mail className="h-5 w-5" /> Contacter</button>
                     {selectedApp.status === 'pending' ? (
                        <div className="flex items-center gap-4">
                           <button onClick={() => handleReject(selectedApp.id)} className="px-8 py-4 rounded-2xl text-[11px] font-black bg-[var(--bg-primary)] border border-[var(--error-light)] text-[var(--error)] hover:bg-[var(--error-light)] transition-all uppercase tracking-widest shadow-sm">Rejeter</button>
                           <button onClick={() => handleApprove(selectedApp.id)} className="px-12 py-4 rounded-2xl text-[11px] font-black bg-[var(--info)] text-white shadow-2xl shadow-md hover:bg-blue-700 transition-all uppercase tracking-widest">Approuver</button>
                        </div>
                     ) : (
                        <div className="flex items-center gap-3 bg-[var(--bg-primary)] px-6 py-3 rounded-2xl shadow-sm border border-[var(--border-subtle)]">
                           <ShieldCheck className="h-5 w-5 text-[var(--success)]" />
                           <span className="text-[10px] font-black text-[var(--success)] uppercase tracking-widest">Dossier Traité ({selectedApp.status})</span>
                        </div>
                     )}
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
        active 
          ? "bg-[var(--brand-50)] text-[var(--brand-500)] shadow-sm" 
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StatCard({ label, value, trend, trendLabel, icon }: any) {
  return (
    <div className="bg-[var(--bg-primary)] rounded-xl p-6 shadow-sm border border-[var(--border-default)] flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{label}</p>
        <div className="text-[var(--brand-500)] bg-[var(--brand-50)] p-2 rounded-lg">
          {icon}
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-1">{value}</h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[var(--success)] font-semibold flex items-center"><TrendingUp className="h-4 w-4 mr-1" />{trend}</span>
          <span className="text-[var(--text-secondary)]">{trendLabel}</span>
        </div>
      </div>
    </div>
  );
}
