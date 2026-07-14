"use client";

import { useEffect, useState, useRef } from "react";
import { Send, MessageSquare, Sparkles, ChevronLeft, Loader2, ArrowLeft, MoreVertical, Briefcase } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MessagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    loadConversations();
  }, [user]);

  // Polling setup since WebSockets aren't configured for DM yet
  useEffect(() => {
    if (!selectedConvo) return;
    
    // Load immediately
    loadMessages(selectedConvo.id);
    
    // Poll every 5 seconds
    const interval = setInterval(() => {
      loadMessages(selectedConvo.id, true);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [selectedConvo]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function loadConversations() {
    try {
      const data = await fetchApi("/api/community/dm/conversations/");
      const convoList = Array.isArray(data) ? data : data.results || [];
      setConversations(convoList);
      
      if (convoList.length > 0 && !selectedConvo) {
        setSelectedConvo(convoList[0]);
      }
    } catch (err) {
      console.error("Erreur chargement conversations", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages(convoId: number, silent = false) {
    try {
      const data = await fetchApi(`/api/community/dm/${convoId}/messages/`);
      setMessages(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Erreur chargement messages", err);
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConvo) return;

    const content = newMessage;
    setNewMessage(""); // Optimistic clear

    try {
      await fetchApi(`/api/community/dm/${selectedConvo.id}/send/`, {
        method: 'POST',
        body: JSON.stringify({ content })
      });
      loadMessages(selectedConvo.id);
      loadConversations(); // Update timestamps in sidebar
    } catch (err) {
      console.error("Erreur envoi message", err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090C14] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#090C14] text-white overflow-hidden font-sans">
      {/* Sidebar Conversations */}
      <aside className="w-80 md:w-96 border-r border-white/5 flex flex-col bg-[#0A0F1C] shrink-0">
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/5">
           <div className="flex items-center gap-3">
              <MessageSquare className="text-indigo-400 w-6 h-6" />
              <span className="text-lg md:text-xl font-black tracking-tight uppercase">Messages</span>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
           <p className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Conversations Récentes</p>
           {conversations.length === 0 && (
             <div className="text-center py-8 text-slate-500 text-sm">
                Aucune conversation pour le moment.
             </div>
           )}
           {conversations.map(convo => {
              // Find the other participant
              const otherParticipant = convo.participants_details?.find((p: any) => p.id !== user?.id) || convo.participants_details?.[0];
              const isActive = selectedConvo?.id === convo.id;
              
              return (
                <button 
                  key={convo.id}
                  onClick={() => setSelectedConvo(convo)}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group text-left ${
                    isActive 
                      ? 'bg-indigo-600/10 border border-indigo-500/20' 
                      : 'border border-transparent hover:bg-white/5'
                  }`}
                >
                   <div className="relative">
                     <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${otherParticipant?.username || 'U'}&background=333&color=fff`} 
                          alt="avatar"
                          className="w-full h-full object-cover" 
                        />
                     </div>
                   </div>
                   <div className="flex-1 overflow-hidden">
                     <div className="flex justify-between items-center mb-1">
                        <span className={`font-bold text-sm truncate ${isActive ? 'text-indigo-400' : 'text-slate-200 group-hover:text-white'}`}>
                          {otherParticipant?.first_name ? `${otherParticipant.first_name} ${otherParticipant.last_name}` : otherParticipant?.username || "Utilisateur"}
                        </span>
                     </div>
                     <span className="text-xs text-slate-500 truncate block">
                        {convo.job_title ? `Offre: ${convo.job_title}` : "Discussion directe"}
                     </span>
                   </div>
                </button>
              );
           })}
        </div>

        <div className="p-6 border-t border-white/5 bg-[#090C14]/50">
           <Link href="/communaute" className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
              <ChevronLeft className="w-4 h-4" /> Retour Hub
           </Link>
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col relative bg-[#090C14]">
        {selectedConvo ? (
          <>
            <header className="h-20 border-b border-white/5 px-6 md:px-8 flex items-center justify-between bg-white/[0.02] backdrop-blur-md sticky top-0 z-10">
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 overflow-hidden border border-indigo-500/20">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${selectedConvo.participants_details?.find((p: any) => p.id !== user?.id)?.username || 'U'}&background=333&color=fff`} 
                      alt="avatar"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                     <h3 className="font-black text-lg tracking-tight text-white">
                        {selectedConvo.participants_details?.find((p: any) => p.id !== user?.id)?.fullName || selectedConvo.participants_details?.find((p: any) => p.id !== user?.id)?.username}
                     </h3>
                     {selectedConvo.job_title ? (
                       <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-1">
                         <Briefcase className="w-3 h-3" /> {selectedConvo.job_title}
                       </p>
                     ) : (
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Discussion Privée</p>
                     )}
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <button className="p-2 text-slate-500 hover:text-white transition-colors"><MoreVertical className="w-5 h-5" /></button>
               </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
               {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 gap-6">
                     <MessageSquare className="w-12 h-12" />
                     <p className="text-sm font-black uppercase tracking-[0.2em] text-center max-w-xs">Envoyez le premier message pour démarrer la discussion.</p>
                  </div>
               ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={`flex gap-4 group ${msg.sender_id === user?.id ? 'flex-row-reverse' : ''}`}>
                       <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl overflow-hidden border border-white/10 shrink-0 shadow-lg">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${msg.sender_name}&background=333&color=fff`} 
                            alt="avatar"
                            className="w-full h-full object-cover" 
                          />
                       </div>
                       <div className={`max-w-[75%] md:max-w-[65%] space-y-1.5 ${msg.sender_id === user?.id ? 'items-end' : ''}`}>
                          <div className={`flex items-center gap-3 ${msg.sender_id === user?.id ? 'flex-row-reverse' : ''}`}>
                             <span className="text-[11px] font-black uppercase tracking-tight text-slate-300">{msg.sender_name}</span>
                             <span className="text-[9px] text-slate-600 font-bold">{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <div className={`p-4 md:p-5 rounded-[24px] md:rounded-[28px] text-sm leading-relaxed shadow-sm ${
                            msg.sender_id === user?.id 
                              ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/10' 
                              : 'bg-white/5 text-slate-200 rounded-tl-none border border-white/5'
                          }`}>
                             {msg.content}
                          </div>
                       </div>
                    </div>
                  ))
               )}
            </div>

            <div className="p-6 md:p-8 bg-gradient-to-t from-[#090C14] to-transparent">
               <form onSubmit={handleSendMessage} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-[32px] blur opacity-10 group-focus-within:opacity-30 transition-all"></div>
                  <div className="relative flex bg-[#111827] border border-white/10 rounded-[32px] p-2 backdrop-blur-xl">
                     <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Écrivez votre message..."
                        className="flex-1 bg-transparent border-none outline-none px-4 md:px-6 py-3 md:py-4 font-medium placeholder:text-slate-500 text-sm text-white"
                     />
                     <button 
                       type="submit" 
                       disabled={!newMessage.trim()}
                       className="bg-white text-slate-900 font-black px-6 md:px-8 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-900"
                     >
                        <Send className="w-4 h-4 hidden sm:block" /> <span className="hidden sm:inline">ENVOYER</span>
                        <Send className="w-4 h-4 sm:hidden" />
                     </button>
                  </div>
               </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-50 gap-6">
            <MessageSquare className="w-16 h-16 text-slate-600" />
            <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Sélectionnez une conversation</p>
          </div>
        )}
      </main>
    </div>
  );
}
