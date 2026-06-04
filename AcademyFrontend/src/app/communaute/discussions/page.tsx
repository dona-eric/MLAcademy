"use client";

import { useEffect, useState, useRef } from "react";
import { Hash, Send, MessageSquare, Sparkles, ChevronLeft, Loader2, Plus, MoreVertical, ShieldCheck } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { useChatWebSocket } from "@/hooks/useChatWebSocket";

export default function DiscussionsPage() {
  const { user, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'category' | 'channel' | 'post'>('category');
  const [targetCategoryId, setTargetCategoryId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState('chat');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeThread, setActiveThread] = useState<any>(null); // For forum post replies

  const { messages, isConnected, sendMessage, setInitialMessages } = useChatWebSocket(selectedChannel?.id || null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      loadInitialMessages(selectedChannel.id);
    }
  }, [selectedChannel]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function loadCategories() {
    try {
      const data = await fetchApi("/api/community/categories/");
      const cats = Array.isArray(data) ? data : data.results || [];
      setCategories(cats);
      // Select the first channel of the first category by default
      if (cats.length > 0 && cats[0].channels?.length > 0) {
        setSelectedChannel(cats[0].channels[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadInitialMessages(channelId: number) {
    try {
      const data = await fetchApi("/api/community/channels/${channelId}/messages/");
      setInitialMessages(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChannel || !isConnected) return;

    sendMessage(newMessage);
    setNewMessage("");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsSubmitting(true);

    try {
      if (modalType === 'category') {
        await fetchApi("/api/community/categories/", {
          method: 'POST',
          body: JSON.stringify({ name: newTitle, order: 0 })
        });
      } else {
        await fetchApi("/api/community/channels/", {
          method: 'POST',
          body: JSON.stringify({
            category: targetCategoryId || categories[0]?.id,
            name: newTitle.toLowerCase().replace(/\s+/g, '-'),
            description: newDesc,
            channel_type: newType,
            is_private: false
          })
        });
      }
      setIsCreateModalOpen(false);
      setNewTitle('');
      setNewDesc('');
      await loadCategories();
    } catch (err) {
      console.error("Error creating item:", err);
      alert("Erreur lors de la création.");
    } finally {
      setIsSubmitting(false);
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
          <button onClick={() => { setModalType('category'); setIsCreateModalOpen(true); }} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors" title="Créer un Lab (Catégorie)">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.map(category => (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between px-4 mb-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{category.name}</p>
                <button onClick={() => { setModalType('channel'); setTargetCategoryId(category.id); setIsCreateModalOpen(true); }} className="text-slate-500 hover:text-white" title="Ajouter un salon">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1">
                {category.channels?.map((channel: any) => (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    className={"w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${selectedChannel?.id === channel.id ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}"}
                  >
                    <Hash className={"w-5 h-5 ${selectedChannel?.id === channel.id ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'}"} />
                    <span className="font-bold text-sm tracking-tight">{channel.name}</span>
                  </button>
                ))}
              </div>
            </div>
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
            <div className="flex items-center gap-2 mr-4">
              <div className={"w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}"}></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{isConnected ? 'Connecté' : 'Déconnecté'}</span>
            </div>
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => <div key={i} className="h-8 w-8 rounded-full border-2 border-[#090C14] bg-slate-800" />)}
              <div className="h-8 w-8 rounded-full border-2 border-[#090C14] bg-indigo-600 flex items-center justify-center text-[10px] font-black">+12</div>
            </div>
            <button className="p-2 text-slate-500 hover:text-white transition-colors"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </header>

        {selectedChannel?.channel_type === 'forum' ? (
          <div className="flex-1 overflow-y-auto p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-xl font-black uppercase">Publications</h4>
                <button onClick={() => { setModalType('post'); setIsCreateModalOpen(true); }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Nouvelle Publication
                </button>
              </div>

              <div className="space-y-4">
                {messages.filter(m => !m.parent).length === 0 ? (
                  <div className="text-center opacity-30 py-20">
                    <Sparkles className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-sm font-black uppercase tracking-[0.2em]">Aucune publication...</p>
                  </div>
                ) : (
                  messages.filter(m => !m.parent).map(post => {
                    const replies = messages.filter(m => m.parent === post.id);
                    return (
                      <div key={post.id} onClick={() => setActiveThread(post)} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-lg group-hover:text-indigo-400 transition-colors">{post.title || "Sans Titre"}</h3>
                          <span className="text-[10px] text-slate-500 font-bold">{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-slate-300 line-clamp-2 mb-6">{post.content}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={post.user_avatar || "https://ui-avatars.com/api/?name=${post.user_name}"} className="w-6 h-6 rounded-full" />
                            <span className="text-xs font-bold text-slate-400">{post.user_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                            <MessageSquare className="w-4 h-4" />
                            <span>{replies.length} réponse{replies.length > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-8 space-y-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30 gap-6">
                <Sparkles className="w-12 h-12" />
                <p className="text-sm font-black uppercase tracking-[0.2em]">Commencez la discussion...</p>
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={"flex gap-5 group ${msg.user === user?.id ? 'flex-row-reverse' : ''}"}>
                  <div className="h-12 w-12 rounded-2xl overflow-hidden border border-white/10 shrink-0 shadow-lg">
                    <img
                      src={msg.user_avatar || "https://ui-avatars.com/api/?name=${msg.user_name}&background=333&color=fff"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={"max-w-[70%] space-y-2 ${msg.user === user?.id ? 'items-end' : ''}"}>
                    <div className={"flex items-center gap-3 ${msg.user === user?.id ? 'flex-row-reverse' : ''}"}>
                      <span className="text-[11px] font-black uppercase tracking-tight text-slate-300">{msg.user_name}</span>
                      {msg.is_mentor && <span className="text-[8px] font-black bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20 uppercase tracking-widest flex items-center gap-1"><ShieldCheck className="w-2.5 h-2.5" /> Mentor</span>}
                      <span className="text-[9px] text-slate-600 font-bold">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className={"p-5 rounded-[28px] text-sm leading-relaxed shadow-sm ${msg.user === user?.id ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/10' : 'bg-white/5 text-slate-200 rounded-tl-none border border-white/5'}"}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {selectedChannel?.channel_type !== 'forum' && (
          <div className="p-8">
            <form onSubmit={handleSendMessage} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-[32px] blur opacity-10 group-focus-within:opacity-30 transition-all"></div>
              <div className="relative flex bg-white/5 border border-white/10 rounded-[32px] p-2 backdrop-blur-xl">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={"Envoyer un message dans #${selectedChannel?.name}..."}
                  className="flex-1 bg-transparent border-none outline-none px-6 py-4 font-medium placeholder:text-slate-500 text-sm"
                />
                <button type="submit" className="bg-white text-slate-900 font-black px-8 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-2">
                  <Send className="w-4 h-4" /> ENVOYER
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Forum Thread Sidebar / Modal */}
      {activeThread && (
        <div className="w-96 border-l border-white/5 bg-[#0A0F1C] flex flex-col shadow-2xl z-20">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-black text-sm uppercase tracking-tight truncate pr-4">Thread: {activeThread.title}</h3>
            <button onClick={() => setActiveThread(null)} className="text-slate-500 hover:text-white"><Plus className="w-5 h-5 rotate-45" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Original Post */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <img src={activeThread.user_avatar || "https://ui-avatars.com/api/?name=${activeThread.user_name}"} className="w-8 h-8 rounded-full" />
                <div>
                  <p className="text-sm font-bold">{activeThread.user_name}</p>
                  <p className="text-[10px] text-slate-500">{new Date(activeThread.created_at).toLocaleString()}</p>
                </div>
              </div>
              <p className="text-sm text-slate-300">{activeThread.content}</p>
            </div>

            {/* Replies */}
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Réponses</p>
              {messages.filter(m => m.parent === activeThread.id).map(reply => (
                <div key={reply.id} className="flex gap-3">
                  <img src={reply.user_avatar || "https://ui-avatars.com/api/?name=${reply.user_name}"} className="w-6 h-6 rounded-full shrink-0" />
                  <div className="bg-white/5 rounded-xl p-3 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-400">{reply.user_name}</span>
                      <span className="text-[10px] text-slate-600">{new Date(reply.created_at).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm text-slate-300">{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-white/5 bg-[#090C14]">
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newMessage.trim() || !isConnected) return;
              sendMessage(newMessage, undefined, activeThread.id);
              setNewMessage('');
            }} className="relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Votre réponse..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-indigo-500"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Création */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0A0F1C] border border-white/10 rounded-2xl w-full max-w-md p-6"
          >
            <h3 className="text-xl font-black mb-4">
              {modalType === 'category' ? 'Nouveau Lab Technique' :
                modalType === 'post' ? 'Nouvelle Publication' : 'Nouvel Espace de Discussion'}
            </h3>

            <form onSubmit={(e) => {
              if (modalType === 'post') {
                e.preventDefault();
                if (!newTitle.trim() || !newDesc.trim() || !isConnected) return;
                sendMessage(newDesc, newTitle);
                setIsCreateModalOpen(false);
                setNewTitle('');
                setNewDesc('');
              } else {
                handleCreate(e);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">Titre</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder={modalType === 'category' ? "Ex: INTELLIGENCE ARTIFICIELLE" :
                    modalType === 'post' ? "Ex: Développeur Python chez OpenAI" : "Ex: deep-learning-general"}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              {modalType === 'channel' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2">Type d'espace</label>
                    <select
                      value={newType}
                      onChange={e => setNewType(e.target.value)}
                      className="w-full bg-[#0A0F1C] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="chat">Chat Classique</option>
                      <option value="forum">Espace Publications (Annonces, Emplois, etc.)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2">Description</label>
                    <input
                      type="text"
                      value={newDesc}
                      onChange={e => setNewDesc(e.target.value)}
                      placeholder="Courte description de l'espace..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </>
              )}
              {modalType === 'post' && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">Contenu de la publication</label>
                  <textarea
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    placeholder="Décrivez votre offre, ressource ou partage..."
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              )}

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-400 hover:bg-white/5 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Créer'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
