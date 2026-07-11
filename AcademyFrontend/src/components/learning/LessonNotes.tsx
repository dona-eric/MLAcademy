"use client";

import React, { useState, useEffect } from "react";
import { Clock, Plus, Trash2, StickyNote } from "lucide-react";

interface Note {
  id: string;
  timecode: number;
  content: string;
}

interface LessonNotesProps {
  lessonId: string;
  currentTime: number;
  onSeek: (time: number) => void;
}

export default function LessonNotes({ lessonId, currentTime, onSeek }: LessonNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");

  // Charger les notes depuis le localStorage pour l'instant
  useEffect(() => {
    const saved = localStorage.getItem(`notes_${lessonId}`);
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, [lessonId]);

  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    localStorage.setItem(`notes_${lessonId}`, JSON.stringify(updatedNotes));
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    const note: Note = {
      id: Date.now().toString(),
      timecode: currentTime,
      content: newNote,
    };
    const updated = [...notes, note].sort((a, b) => a.timecode - b.timecode);
    saveNotes(updated);
    setNewNote("");
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    saveNotes(updated);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? `${h}:` : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="glass-card p-6 bg-white/5 border-white/10">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-indigo-400" />
          Prendre une note
        </h3>
        <div className="space-y-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Votre réflexion à ce moment de la vidéo..."
            className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-indigo-500 outline-none transition min-h-[100px]"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
              Timecode: {formatTime(currentTime)}
            </span>
            <button
              onClick={addNote}
              className="btn btn-primary py-2 px-4 text-xs gap-2"
            >
              <Plus className="w-4 h-4" /> Ajouter la note
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">
          Vos notes ({notes.length})
        </h4>
        {notes.length === 0 ? (
          <div className="text-center py-10 text-slate-500 italic text-sm">
            Aucune note pour le moment.
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="glass-card p-4 bg-white/5 border-white/5 group hover:border-indigo-500/30 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <button
                  onClick={() => onSeek(note.timecode)}
                  className="flex items-center gap-2 text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <Clock className="w-3 h-3" /> {formatTime(note.timecode)}
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {note.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
