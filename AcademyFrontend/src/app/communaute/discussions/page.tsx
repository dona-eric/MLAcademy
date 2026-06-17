"use client";

import { useEffect, useState, useRef } from "react";
import { 
  Hash, Send, Users, MessageSquare, 
  Sparkles, Zap, ChevronLeft, Loader2,
  Plus, MoreVertical, Star, ShieldCheck
} from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function DiscussionsPage() {
  const { user } = useAuth();
  const [channels, setChannels] = useState<any[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChannels();
  }, []);

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!selectedChannel) return;

    loadMessages(selectedChannel.id);

    const token = localStorage.getItem('access_token') || '';
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    
    let wsHost = 'localhost:8000';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    try {
      const parsedUrl = new URL(apiUrl);
      wsHost = parsedUrl.host;
    } catch (e) {
      if (typeof window !== 'undefined') {
        wsHost = window.location.host.split(':')[0] + ':8000';
      }
    }
    
    const wsUrl = `${wsProtocol}//${wsHost}/ws/chat/${selectedChannel.id}/?token=${token}`;
    console.log("Connecting to WebSocket:", wsUrl);
    
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.message) {
          setMessages(prev => {
            if (prev.some(m => m.id === data.message.id)) {
              return prev;
            }
            return [...prev, data.message];
          });
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message", err);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  }, [selectedChannel]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function loadChannels() {
    try {
      const data = await fetchApi("/api/community/channels/");
      const chanList = Array.isArray(data) ? data : data.results || [];
      setChannels(chanList);
      if (chanList.length > 0) setSelectedChannel(chanList[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages(channelId: number, silent = false) {
    try {
      const data = await fetchApi(`/api/community/channels/${channelId}/messages/`);
      setMessages(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChannel) return;

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        message: newMessage
      }));
      setNewMessage("");
    } else {
      try {
        await fetchApi(`/api/community/channels/${selectedChannel.id}/messages/`, {
          method: 'POST',
          body: JSON.stringify({ content: newMessage })
        });
        setNewMessage("");
        loadMessages(selectedChannel.id);
      } catch (err) {
        console.error(err);
      }
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
    <div className="flex h-screen bg-[#090C14] text-white overflow-hidden">
      {/* Sidebar Channels */}
      <aside className="w-80 border-r border-white/5 flex flex-col bg-[#0A0F1C]">
        <div className="p-8 flex items-center justify-between border-b border-white/5">
           <div className="flex items-center gap-3">
              <MessageSquare className="text-indigo-400 w-6 h-6" />
              <span className="text-xl font-black tracking-tight uppercase">Pulse Chat</span>
           </div>
           <button className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <Plus className="w-4 h-4" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
           <p className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Canaux Publics</p>
           {channels.map(channel => (
              <button 
                key={channel.id}
                onClick={() => setSelectedChannel(channel)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group ${selectedChannel?.id === channel.id ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              >
                 <Hash className={`w-5 h-5 ${selectedChannel?.id === channel.id ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
                 <span className="font-bold text-sm uppercase tracking-tight">{channel.name}</span>
              </button>
           ))}
        </div>

        <div className="p-6 border-t border-white/5 bg-[#090C14]/50">
           <Link href="/communaute" className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest">
              <ChevronLeft className="w-4 h-4" /> Retour Hub
           </Link>
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col relative">
        <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-white/[0.02] backdrop-blur-md sticky top-0 z-10">
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400">
                 <Hash className="w-6 h-6" />
              </div>
              <div>
                 <h3 className="font-black text-lg uppercase tracking-tight">{selectedChannel?.name}</h3>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{selectedChannel?.description || "Canal de discussion technique"}</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                 {[1,2,3].map(i => <div key={i} className="h-8 w-8 rounded-full border-2 border-[#090C14] bg-slate-800" />)}
                 <div className="h-8 w-8 rounded-full border-2 border-[#090C14] bg-indigo-600 flex items-center justify-center text-[10px] font-black">+12</div>
              </div>
              <button className="p-2 text-slate-500 hover:text-white transition-colors"><MoreVertical className="w-5 h-5" /></button>
           </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
           {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30 gap-6">
                 <Sparkles className="w-12 h-12" />
                 <p className="text-sm font-black uppercase tracking-[0.2em]">Commencez la discussion...</p>
              </div>
           ) : (
              messages.map(msg => (
                <div key={msg.id} className={`flex gap-5 group ${msg.user === user?.id ? 'flex-row-reverse' : ''}`}>
                   <div className="h-12 w-12 rounded-2xl overflow-hidden border border-white/10 shrink-0 shadow-lg">
                      <img 
                        src={msg.user_avatar || `https://ui-avatars.com/api/?name=${msg.user_name}&background=333&color=fff`} 
                        className="w-full h-full object-cover" 
                      />
                   </div>
                   <div className={`max-w-[70%] space-y-2 ${msg.user === user?.id ? 'items-end' : ''}`}>
                      <div className={`flex items-center gap-3 ${msg.user === user?.id ? 'flex-row-reverse' : ''}`}>
                         <span className="text-[11px] font-black uppercase tracking-tight text-slate-300">{msg.user_name}</span>
                         {msg.is_mentor && <span className="text-[8px] font-black bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20 uppercase tracking-widest flex items-center gap-1"><ShieldCheck className="w-2.5 h-2.5" /> Mentor</span>}
                         <span className="text-[9px] text-slate-600 font-bold">{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div className={`p-5 rounded-[28px] text-sm leading-relaxed shadow-sm ${msg.user === user?.id ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/10' : 'bg-white/5 text-slate-200 rounded-tl-none border border-white/5'}`}>
                         {msg.content}
                      </div>
                   </div>
                </div>
              ))
           )}
        </div>

        <div className="p-8">
           <form onSubmit={handleSendMessage} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-[32px] blur opacity-10 group-focus-within:opacity-30 transition-all"></div>
              <div className="relative flex bg-white/5 border border-white/10 rounded-[32px] p-2 backdrop-blur-xl">
                 <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Envoyer un message dans #${selectedChannel?.name}...`}
                    className="flex-1 bg-transparent border-none outline-none px-6 py-4 font-medium placeholder:text-slate-500 text-sm"
                 />
                 <button type="submit" className="bg-white text-slate-900 font-black px-8 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-2">
                    <Send className="w-4 h-4" /> ENVOYER
                 </button>
              </div>
           </form>
        </div>
      </main>
    </div>
  );
}
