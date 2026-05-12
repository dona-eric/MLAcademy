"use client";

import { useEffect, useState, useRef } from "react";
import { 
  Users, Award, TrendingUp, Bell, ChevronRight, FileText, LogOut, Layout, Mail, 
  Loader2, XCircle, UserCheck, ShieldAlert, Palette, Eye, Save, Send, MessageSquare, 
  History, CreditCard, ShieldCheck, ExternalLink, Search, Settings, MoreVertical,} from "lucide-react";
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
  const [adminNotifications, setAdminNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  
  const [platformSettings, setPlatformSettings] = useState<any>({
     site_name: "MLAcademy",
     primary_color: "#3B82F6",
     secondary_color: "#10B981",
     maintenance_mode: false
  });
  
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
  }, [user, authLoading]);

  async function loadData() {
    setLoading(true);
    try {
      const [statsData, appsData, enrollData, settingsData, auditData, transData, notifData] = await Promise.all([
        fetchApi("/api/admin/management/stats/"),
        fetchApi("/api/admin/management/instructor-applications/"),
        fetchApi("/api/admin/management/enrollments/"),
        fetchApi("/api/admin/management/settings/"),
        fetchApi("/api/admin/management/audit/"),
        fetchApi("/api/admin/management/transactions/"),
        fetchApi("/api/private/learning/notifications/") // Admin receives system notifications too
      ]);
      setStats(statsData);
      setApps(Array.isArray(appsData) ? appsData : (appsData?.results || []));
      setEnrollments(Array.isArray(enrollData) ? enrollData : (enrollData?.results || []));
      setPlatformSettings(settingsData);
      setAuditLogs(Array.isArray(auditData) ? auditData : (auditData?.results || []));
      setTransactions(Array.isArray(transData) ? transData : (transData?.results || []));
      setAdminNotifications(Array.isArray(notifData) ? notifData : (notifData?.results || []));
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

  const handleSaveSettings = async () => {
     try {
        await fetchApi("/api/admin/management/settings/", {
           method: 'PATCH',
           body: JSON.stringify(platformSettings)
        });
        alert("Paramètres enregistrés !");
     } catch (err) { alert("Erreur"); }
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
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7FE]">
        <div className="flex flex-col items-center gap-4">
           <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
           <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Loading MLAcademy...</p>
        </div>
      </div>
    );
  }

  const { summary, active_admins } = stats;

  return (
    <div className="flex min-h-screen bg-[#F4F7FE]">
      {/* Sidebar - CROWN */}
      <aside className="w-72 bg-white shadow-2xl flex flex-col fixed h-full z-40">
        <div className="p-8 flex items-center gap-4 border-b border-slate-50">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tighter uppercase">MLAcademy</span>
        </div>

        <div className="p-8 flex flex-col items-center text-center border-b border-slate-50 bg-slate-50/30">
          <div className="h-20 w-20 rounded-[28px] overflow-hidden border-4 border-white shadow-xl mb-4 group relative">
             <img src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.first_name || user?.username}&background=3B82F6&color=fff`} alt="Admin" className="w-full h-full object-cover" />
             <div onClick={() => router.push("/profile/edit")} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                <Settings className="h-6 w-6 text-white" />
             </div>
          </div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{user?.first_name} {user?.last_name}</h3>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1 opacity-80">{user?.is_superuser ? 'Super Admin' : 'Admin Staff'}</p>
          <div className="mt-4 flex gap-2">
             <button onClick={() => router.push("/profile/edit")} className="text-[9px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors">Modifier Profil</button>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-1 overflow-y-auto">
          <p className="px-4 py-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Dashboards</p>
          <NavItem icon={<Layout className="h-4 w-4" />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <NavItem icon={<CreditCard className="h-4 w-4" />} label="Finances" active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} />
          <NavItem icon={<History className="h-4 w-4" />} label="Audit Log" active={activeTab === 'audit'} onClick={() => setActiveTab('audit')} />
          
          <p className="px-4 py-2 mt-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Management</p>
          <NavItem icon={<UserCheck className="h-4 w-4" />} label="Instructeurs" active={activeTab === 'instructors'} onClick={() => setActiveTab('instructors')} />
          <NavItem icon={<Users className="h-4 w-4" />} label="Etudiants" active={activeTab === 'enrollments'} onClick={() => setActiveTab('enrollments')} />
          <NavItem icon={<Mail className="h-4 w-4" />} label="Communications" active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} />
          
          <p className="px-4 py-2 mt-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Branding</p>
          <NavItem icon={<Palette className="h-4 w-4" />} label="Layouts" active={activeTab === 'layouts'} onClick={() => setActiveTab('layouts')} />
        </nav>

        <div className="p-8 border-t border-slate-50">
           <button onClick={() => router.push("/admin/login")} className="flex items-center gap-3 text-slate-400 hover:text-rose-600 transition-all font-black uppercase text-[11px] tracking-widest w-full">
              <LogOut className="h-4 w-4" />
              <span>Deconneion</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 overflow-y-auto">
        <header className="h-24 bg-white/80 backdrop-blur-md flex items-center justify-between px-10 border-b border-slate-100 sticky top-0 z-30">
          <div className="flex items-center gap-8">
             <div className="relative" ref={notifRef}>
                <button 
                   onClick={() => setShowNotifs(!showNotifs)}
                   className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all relative group"
                >
                   <Bell className="h-5 w-5 text-slate-500 group-hover:text-blue-600" />
                   {adminNotifications.length > 0 && <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full border-2 border-white" />}
                </button>
                
                <AnimatePresence>
                   {showNotifs && (
                      <motion.div 
                         initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                         className="absolute left-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
                      >
                         <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inbox Administrative</span>
                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{adminNotifications.length}</span>
                         </div>
                         <div className="max-h-96 overflow-y-auto p-4 space-y-3">
                            {adminNotifications.length === 0 ? (
                               <p className="text-[10px] font-black text-slate-400 uppercase text-center py-10">Aucune alerte</p>
                            ) : (
                               adminNotifications.map(n => (
                                  <div key={n.id} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                                     <p className="text-[11px] font-black text-slate-800">{n.title}</p>
                                     <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">{n.content}</p>
                                  </div>
                               ))
                            )}
                         </div>
                      </motion.div>
                   )}
                </AnimatePresence>
             </div>
             
             <button onClick={() => setActiveTab('messages')} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group">
                <Mail className="h-5 w-5 text-slate-500 group-hover:text-blue-600" />
             </button>
          </div>

          <div className="flex-1 max-w-2xl px-10">
             <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <input type="text" placeholder="Intelligence Search..." className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-6 text-sm font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/20 transition-all" />
             </div>
          </div>

          <div className="flex items-center gap-5">
             <div className="flex flex-col items-end">
                <span className="text-sm font-black text-slate-800">{user?.first_name} {user?.last_name}</span>
                <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest flex items-center gap-1">
                   <div className="h-1 w-1 bg-emerald-500 rounded-full animate-pulse" /> Système Actif
                </span>
             </div>
             <div onClick={() => router.push("/profile/edit")} className="h-12 w-12 rounded-2xl border-2 border-slate-100 overflow-hidden cursor-pointer hover:border-blue-500 transition-all">
                <img src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.first_name}&background=f4f7fe&color=3B82F6`} alt="Avatar" className="w-full h-full object-cover" />
             </div>
          </div>
        </header>

        <div className="p-10 space-y-10">
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">{platformSettings.site_name} Management</h1>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <ShieldAlert className="h-3 w-3" /> Console de Gouvernance • {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                 </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                 <span>SYSTEM</span><ChevronRight className="h-3 w-3" /><span className="text-blue-600">{activeTab}</span>
              </div>
           </div>

           <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                 <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                       <StatCard label="ÉTUDIANTS ACTIFS" value={summary.total_students} trend="+5%" color="text-emerald-500" barColor="bg-emerald-500" icon={<Users className="h-4 w-4" />} />
                       <StatCard label="REVENU TOTAL" value={`$${summary.total_revenue}`} trend="Real-time" color="text-blue-500" barColor="bg-blue-500" icon={<CreditCard className="h-4 w-4" />} />
                       <StatCard label="INSTRUCTEURS" value={summary.total_instructors} trend="+2 New" color="text-indigo-500" barColor="bg-indigo-500" icon={<Award className="h-4 w-4" />} />
                       <StatCard label="ALERTES SYSTÈME" value={summary.pending_projects + summary.pending_applications} trend="Action Req." color="text-rose-500" barColor="bg-rose-500" icon={<ShieldAlert className="h-4 w-4" />} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                       <div className="lg:col-span-2 bg-white rounded-[40px] p-10 shadow-sm border border-slate-100 relative overflow-hidden">
                          <div className="flex items-center justify-between mb-10">
                             <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Courbe d'Activité</h3>
                             <div className="flex gap-2">
                                <span className="h-2 w-2 rounded-full bg-blue-500" />
                                <span className="h-2 w-2 rounded-full bg-slate-200" />
                             </div>
                          </div>
                          <div className="h-72 w-full flex items-end gap-3 px-2">
                             {[40, 70, 45, 90, 65, 80, 50, 85, 60, 75, 40, 60, 95, 55].map((h, i) => (
                                <motion.div 
                                  key={i}
                                  initial={{ height: 0 }} animate={{ height: `${h}%` }}
                                  className="flex-1 rounded-t-xl bg-gradient-to-t from-blue-600 to-blue-400 opacity-20 hover:opacity-100 transition-all cursor-pointer group relative"
                                >
                                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{h}% Engagement</div>
                                </motion.div>
                             ))}
                          </div>
                       </div>

                       <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
                          <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm mb-8 flex items-center gap-2"><History className="h-4 w-4" /> Activité Récente</h3>
                          <div className="space-y-6">
                             {auditLogs.slice(0, 5).map((log) => (
                                <div key={log.id} className="flex gap-4 group">
                                   <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0 group-hover:scale-150 transition-transform" />
                                   <div>
                                      <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{log.action}</p>
                                      <p className="text-[10px] text-slate-400 mt-0.5">{log.details}</p>
                                      <p className="text-[9px] font-bold text-slate-300 mt-2">{new Date(log.created_at).toLocaleTimeString()}</p>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </motion.div>
              )}

              {activeTab === 'instructors' && (
                 <motion.div key="instructors" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-10">
                       <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Gestion des Candidatures</h3>
                       <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-1 rounded-full uppercase">{apps.length} Dossiers</span>
                    </div>

                    <div className="overflow-x-auto">
                       <table className="w-full text-left">
                          <thead>
                             <tr className="border-b border-slate-100">
                                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidat</th>
                                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Expertise</th>
                                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                             {apps.map((app) => (
                                <tr key={app.id} className="group hover:bg-slate-50/50 transition-colors">
                                   <td className="py-4">
                                      <div className="flex items-center gap-3">
                                         <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs uppercase">{app.user_full_name?.[0]}</div>
                                         <div>
                                            <p className="text-xs font-black text-slate-800">{app.user_full_name || 'Sans Nom'}</p>
                                            <p className="text-[9px] font-medium text-slate-400">{app.user_email}</p>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="py-4">
                                      <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-lg">{app.expertise}</span>
                                   </td>
                                   <td className="py-4">
                                      <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${app.status === 'pending' ? 'bg-amber-100 text-amber-600' : app.status === 'accepted' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                         {app.status}
                                      </span>
                                   </td>
                                   <td className="py-4 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                         <button onClick={() => setSelectedApp(app)} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all"><Eye className="h-4 w-4" /></button>
                                         <button onClick={() => quickMessage(app.user, app.user_email)} className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-all"><MessageSquare className="h-4 w-4" /></button>
                                      </div>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </motion.div>
              )}

              {activeTab === 'finance' && (
                 <motion.div key="finance" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
                    <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm mb-10 flex items-center gap-2"><CreditCard className="h-5 w-5 text-emerald-500" /> Grand Livre des Transactions</h3>
                    <div className="overflow-x-auto">
                       <table className="w-full text-left">
                          <thead>
                             <tr className="border-b border-slate-100">
                                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Détail</th>
                                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant</th>
                                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Horodatage</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                             {transactions.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                   <td className="py-4 text-xs font-black text-slate-800">{t.user_email}</td>
                                   <td className="py-4 text-xs font-bold text-slate-500">{t.course_title}</td>
                                   <td className="py-4 text-xs font-black text-emerald-600">${t.amount}</td>
                                   <td className="py-4 text-right text-[10px] font-black text-slate-300 uppercase">{new Date(t.created_at).toLocaleString('fr-FR')}</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </motion.div>
              )}

              {activeTab === 'audit' && (
                 <motion.div key="audit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
                    <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm mb-10 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-blue-600" /> Traçabilité des Actions</h3>
                    <div className="space-y-4">
                       {auditLogs.map((log) => (
                          <div key={log.id} className="p-5 bg-slate-50 rounded-3xl flex items-center justify-between border border-slate-100 hover:bg-slate-100 transition-colors">
                             <div className="flex items-center gap-5">
                                <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm font-black text-xs uppercase">{log.admin_email[0]}</div>
                                <div>
                                   <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full">{log.action}</span>
                                      <span className="text-xs font-black text-slate-800">{log.admin_email}</span>
                                   </div>
                                   <p className="text-[11px] text-slate-400 font-bold mt-1">{log.details}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-[10px] font-black text-slate-500 uppercase">{new Date(log.created_at).toLocaleTimeString()}</p>
                                <p className="text-[9px] font-bold text-slate-300 tracking-widest">{log.ip_address}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </motion.div>
              )}

              {activeTab === 'messages' && (
                 <motion.div key="messages" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="lg:grid lg:grid-cols-3 lg:gap-10">
                    <div className="lg:col-span-2 bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
                       <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm mb-10 flex items-center gap-3"><Send className="h-4 w-4 text-blue-600" /> Communication Center</h3>
                       <form onSubmit={handleSendComm} className="space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Cible de Diffusion</label>
                                <select value={commData.target_type} onChange={(e) => setCommData({...commData, target_type: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 appearance-none">
                                   <option value="students">Tous les Étudiants</option>
                                   <option value="instructors">Tous les Instructeurs</option>
                                   <option value="all">Tout MLAcademy</option>
                                   <option value="single">Utilisateur Ciblé</option>
                                </select>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mode d'Envoi</label>
                                <div className="flex bg-slate-50 p-1 rounded-2xl">
                                   <button type="button" onClick={() => setCommData({...commData, mode: 'message'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${commData.mode === 'message' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>Interne</button>
                                   <button type="button" onClick={() => setCommData({...commData, mode: 'email'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${commData.mode === 'email' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>Real Email</button>
                                </div>
                             </div>
                          </div>
                          
                          {commData.target_type === 'single' && (
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ID Utilisateur / Email</label>
                                <input type="text" value={commData.user_id} onChange={(e) => setCommData({...commData, user_id: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold" placeholder="Ex: 42 ou email@example.com" />
                             </div>
                          )}

                          <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Sujet Officiel</label><input type="text" value={commData.subject} onChange={(e) => setCommData({...commData, subject: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold" placeholder="Objet du message..." /></div>
                          <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Corps du Message</label><textarea rows={6} value={commData.content} onChange={(e) => setCommData({...commData, content: e.target.value})} className="w-full bg-slate-50 border-none rounded-[32px] py-4 px-6 font-medium text-slate-700 resize-none focus:ring-2 focus:ring-blue-500/20" placeholder="Rédigez ici..." /></div>
                          
                          <button type="submit" disabled={sending} className="w-full bg-blue-600 text-white font-black py-5 rounded-[32px] shadow-2xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                             {sending ? <Loader2 className="h-6 w-6 animate-spin" /> : <><Send className="h-5 w-5" /> EXÉCUTER LA DIFFUSION</>}
                          </button>
                       </form>
                    </div>
                    <div className="space-y-8">
                       <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl">
                          <ShieldAlert className="h-10 w-10 text-amber-500 mb-6" />
                          <h4 className="text-xl font-black tracking-tight mb-4 text-white uppercase">Consignes</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed tracking-widest">Chaque message envoyé via cette console est enregistré dans l'Audit Log. Les emails SMTP utilisent le nom de domaine officiel.</p>
                          <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                             <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Statut Serveur</p>
                             <div className="flex items-center justify-center gap-2">
                                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-xs font-bold">Mail Gateway OK</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </motion.div>
              )}

              {activeTab === 'layouts' && (
                 <motion.div key="layouts" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100 space-y-8">
                       <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm flex items-center gap-2"><Palette className="h-4 w-4 text-blue-600" /> Branding Gouvernemental</h3>
                       <div className="space-y-6">
                          <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nom de la Plateforme</label><input type="text" value={platformSettings.site_name} onChange={(e) => setPlatformSettings({...platformSettings, site_name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20" /></div>
                          <div className="grid grid-cols-2 gap-8">
                             <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Couleur Primaire</label><input type="color" value={platformSettings.primary_color} onChange={(e) => setPlatformSettings({...platformSettings, primary_color: e.target.value})} className="h-12 w-full rounded-2xl border-none cursor-pointer bg-transparent" /></div>
                             <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">État Maintenance</label><button onClick={() => setPlatformSettings({...platformSettings, maintenance_mode: !platformSettings.maintenance_mode})} className={`w-full py-3 rounded-2xl font-black uppercase transition-all ${platformSettings.maintenance_mode ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-slate-100 text-slate-400'}`}>{platformSettings.maintenance_mode ? 'ACTIF (Verrouillé)' : 'DÉSACTIVÉ'}</button></div>
                          </div>
                          <button onClick={handleSaveSettings} className="w-full bg-blue-600 text-white font-black py-4 rounded-[32px] shadow-2xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"><Save className="h-5 w-5" /> ENREGISTRER LES MODIFICATIONS</button>
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-24 bg-slate-900/40 backdrop-blur-md">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                 className="bg-white w-full max-w-5xl rounded-[50px] shadow-[0_32px_120px_-10px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-full"
               >
                  <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                     <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-[24px] bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 font-black text-2xl uppercase">{selectedApp.user_full_name?.[0]}</div>
                        <div>
                           <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">{selectedApp.user_full_name}</h2>
                           <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{selectedApp.user_email}</p>
                        </div>
                     </div>
                     <button onClick={() => setSelectedApp(null)} className="p-3 hover:bg-white rounded-2xl shadow-sm transition-all"><XCircle className="h-7 w-7 text-slate-200 hover:text-rose-500" /></button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                           <div className="space-y-4">
                              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Dossier d'Expertise</p>
                              <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100">
                                 <p className="text-xs font-black text-blue-600 uppercase mb-3 px-3 py-1 bg-blue-50 rounded-full inline-block">{selectedApp.expertise}</p>
                                 <p className="text-sm text-slate-600 leading-relaxed font-medium">{selectedApp.expertise_detail || "Détails non fournis."}</p>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Motivation Professionnelle</p>
                              <p className="text-sm text-slate-600 leading-relaxed font-medium bg-indigo-50/30 p-6 rounded-[32px] border border-indigo-50 italic">{selectedApp.motivation}</p>
                           </div>
                        </div>

                        <div className="space-y-8">
                           <div className="space-y-4">
                              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Expérience Pédagogique</p>
                              <p className="text-sm text-slate-600 leading-relaxed font-medium bg-amber-50/30 p-6 rounded-[32px] border border-amber-50">{selectedApp.teaching_experience || "Aucune expérience préalable mentionnée."}</p>
                           </div>
                           <div className="space-y-4">
                              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Réseaux & Documents</p>
                              <div className="grid grid-cols-1 gap-3">
                                 {selectedApp.linkedin_url && (
                                    <a href={selectedApp.linkedin_url} target="_blank" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-all group">
                                       <div className="flex items-center gap-4"><FaLinkedin className="h-5 w-5 text-blue-600" /><span className="text-xs font-black text-slate-700 uppercase">LinkedIn Profile</span></div>
                                       <ExternalLink className="h-4 w-4 text-slate-200 group-hover:text-blue-600" />
                                    </a>
                                 )}
                                 {selectedApp.portfolio_url && (
                                    <a href={selectedApp.portfolio_url} target="_blank" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group">
                                       <div className="flex items-center gap-4"><FaGithub className="h-5 w-5 text-slate-800" /><span className="text-xs font-black text-slate-700 uppercase">Portfolio / GitHub</span></div>
                                       <ExternalLink className="h-4 w-4 text-slate-200 group-hover:text-slate-800" />
                                    </a>
                                 )}
                                 {selectedApp.cv_url && (
                                    <a href={selectedApp.cv_url} target="_blank" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-emerald-50 transition-all group">
                                       <div className="flex items-center gap-4"><FileText className="h-5 w-5 text-emerald-600" /><span className="text-xs font-black text-slate-700 uppercase">Curriculum Vitae</span></div>
                                       <ExternalLink className="h-4 w-4 text-slate-200 group-hover:text-emerald-600" />
                                    </a>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="p-10 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between">
                     <button onClick={() => quickMessage(selectedApp.user, selectedApp.user_email)} className="flex items-center gap-3 text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-[0.2em] px-6 py-3 bg-white rounded-2xl shadow-sm"><Mail className="h-5 w-5" /> Contacter</button>
                     {selectedApp.status === 'pending' ? (
                        <div className="flex items-center gap-4">
                           <button onClick={() => handleReject(selectedApp.id)} className="px-8 py-4 rounded-2xl text-[11px] font-black bg-white border border-rose-100 text-rose-500 hover:bg-rose-50 transition-all uppercase tracking-widest shadow-sm">Rejeter</button>
                           <button onClick={() => handleApprove(selectedApp.id)} className="px-12 py-4 rounded-2xl text-[11px] font-black bg-blue-600 text-white shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all uppercase tracking-widest">Approuver</button>
                        </div>
                     ) : (
                        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
                           <ShieldCheck className="h-5 w-5 text-emerald-500" />
                           <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Dossier Traité ({selectedApp.status})</span>
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

function NavItem({ icon, label, active = false, onClick }: any) {
  return (
    <div onClick={onClick} className={`flex items-center justify-between px-6 py-4 rounded-[20px] cursor-pointer transition-all group ${active ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
      <div className="flex items-center gap-4">
        <div className={`transition-all ${active ? 'text-blue-600 scale-110' : 'text-slate-400 group-hover:text-blue-500'}`}>{icon}</div>
        <span className={`text-[13px] font-black uppercase tracking-tight ${active ? 'text-blue-700' : 'text-slate-600'}`}>{label}</span>
      </div>
      <ChevronRight className={`h-3 w-3 transition-all ${active ? 'opacity-100 translate-x-1 text-blue-600' : 'opacity-0 -translate-x-2'}`} />
    </div>
  );
}

function StatCard({ label, value, trend, color, barColor, icon }: any) {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">{icon}</div>
      <div className="flex justify-between items-start mb-6">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{label}</p>
        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">{icon}</div>
      </div>
      <div className="space-y-4">
         <div className="flex items-end justify-between">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h2>
            <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${color}`}><TrendingUp className="h-3 w-3" /><span>{trend}</span></div>
         </div>
         <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: "70%" }} className={`h-full ${barColor} rounded-full`} />
         </div>
      </div>
    </div>
  );
}
