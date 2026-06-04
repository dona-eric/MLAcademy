"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Play, RotateCcw, Terminal, AlertCircle, Loader2,
  CheckCircle2, Eye, EyeOff, Image as ImageIcon
} from "lucide-react";
import { fetchApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface CodeSandboxProps {
  lessonId: string | number;
  initialCode?: string;
}

export default function CodeSandbox({ lessonId, initialCode = "# Bienvenue dans le Bac à Sable MLAcademy\n\nimport matplotlib.pyplot as plt\nimport numpy as np\n\ndef solve():\n    print(\"Hello ML!\")\n\nsolve()" }: CodeSandboxProps) {
  const [code, setCode] = useState(initialCode);
  const [starterCode, setStarterCode] = useState("");
  const [solutionCode, setSolutionCode] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [executing, setExecuting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Charger le code sauvegardé
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchApi("/api/learning/lessons/${lessonId}/code/");
        if (data) {
          if (data.code) setCode(data.code);
          if (data.starter_code) setStarterCode(data.starter_code);
          if (data.solution_code) setSolutionCode(data.solution_code);
          if (data.last_result) setOutput(data.last_result);
        }
      } catch (err) {
        console.error("Erreur chargement:", err);
      }
    }
    loadData();
  }, [lessonId]);

  // Auto-save logic
  useEffect(() => {
    const timer = setInterval(() => {
      if (code !== starterCode && code !== "") {
        handleSave();
      }
    }, 30000); // 30s
    return () => clearInterval(timer);
  }, [code, starterCode]);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await fetchApi("/api/learning/lessons/${lessonId}/code/", {
        method: "POST",
        body: JSON.stringify({ code, save_only: true })
      });
      setLastSaved(new Date());
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleRun = async () => {
    setExecuting(true);
    setSaving(true);
    try {
      const result = await fetchApi("/api/learning/lessons/${lessonId}/code/", {
        method: "POST",
        body: JSON.stringify({ code })
      });
      setOutput(result.execution || { error: "Pas de réponse de la sandbox." });
      setLastSaved(new Date());
    } catch (err: any) {
      setOutput({ error: err.message || "Erreur de connexion à la sandbox." });
    } finally {
      setExecuting(false);
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Voulez-vous vraiment réinitialiser votre code ?")) {
      setCode(starterCode || initialCode);
    }
  };

  // Parsing des images dans la sortie
  const renderOutput = () => {
    if (!output) return null;

    const stdout = output.stdout || "";
    // Recherche de patterns type IMAGE:base64
    const parts = stdout.split(/(IMAGE:[A-Za-z0-9+/=]+)/g);

    return (
      <div className="space-y-4">
        {output.error && (
          <div className="flex gap-3 p-4 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="space-y-1">
              <p className="font-bold text-xs uppercase tracking-wider">Erreur</p>
              <pre className="text-sm whitespace-pre-wrap">{output.error}</pre>
            </div>
          </div>
        )}

        {stdout && (
          <div className="space-y-3">
            <p className="text-[10px] font-black text-green-500 uppercase tracking-widest ml-1">Console & Visualisations</p>
            <div className="space-y-4">
              {parts.map((part: string, i: number) => {
                if (part.startsWith("IMAGE:")) {
                  const base64 = part.replace("IMAGE:", "");
                  return (
                    <div key={i} className="rounded-2xl border border-white/5 bg-white/5 overflow-hidden p-2">
                      <img src={"data:image/png;base64,${base64}"} alt="Visualization" className="w-full h-auto" />
                      <div className="px-3 py-1 bg-black/20 flex items-center gap-2 text-[8px] text-gray-500">
                        <ImageIcon className="w-3 h-3" /> Figure Matplotlib
                      </div>
                    </div>
                  );
                }
                if (part.trim() === "") return null;
                return (
                  <pre key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-gray-300 whitespace-pre-wrap shadow-inner">
                    {part}
                  </pre>
                );
              })}
            </div>
          </div>
        )}

        {output.stderr && (
          <div className="space-y-2">
            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">Sortie d'erreur</p>
            <pre className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10 text-red-300/80 text-xs whitespace-pre-wrap">
              {output.stderr}
            </pre>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-white/5">
          <div className="bg-white/5 px-3 py-2 rounded-xl border border-white/5 text-center flex-1">
            <p className="text-[8px] font-black text-gray-500 uppercase">Temps</p>
            <p className="text-xs font-bold text-gray-300">{output.time || "0"}s</p>
          </div>
          <div className="bg-white/5 px-3 py-2 rounded-xl border border-white/5 text-center flex-1">
            <p className="text-[8px] font-black text-gray-500 uppercase">Mémoire</p>
            <p className="text-xs font-bold text-gray-300">{(output.memory / 1024).toFixed(1) || "0"} MB</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full gap-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0 bg-[#112240] p-4 rounded-2xl border border-white/5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
            <Terminal className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Notebook Interactif</h3>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded font-black uppercase tracking-widest">Python 3.11</span>
              {lastSaved && (
                <span className="text-[9px] text-gray-500 italic">
                  Sauvé à {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            title="Réinitialiser"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {solutionCode && (
            <button
              onClick={() => setShowSolution(!showSolution)}
              className={"flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${showSolution ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'}"}
            >
              {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              Solution
            </button>
          )}

          <button
            onClick={handleRun}
            disabled={executing}
            className={"flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg ${executing ? 'bg-gray-700 text-gray-400' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20'}"}
          >
            {executing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            {executing ? "Running..." : "Run Code"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
        {/* Editor */}
        <div className="flex-[3] flex flex-col bg-[#0B1121] rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative">
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={showSolution ? solutionCode : code}
              onChange={(val) => !showSolution && setCode(val || "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                readOnly: showSolution,
                scrollBeyondLastLine: false,
                padding: { top: 20 },
                fontFamily: "JetBrains Mono, Menlo, Monaco, 'Courier New', monospace",
              }}
            />
          </div>
          {showSolution && (
            <div className="absolute inset-0 pointer-events-none border-4 border-amber-500/20 animate-pulse"></div>
          )}
        </div>

        {/* Console */}
        <div className="flex-[2] bg-[#0A192F] rounded-3xl border border-white/5 flex flex-col overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-white/5 bg-[#112240]/50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Output Console</span>
            </div>
            <button onClick={() => setOutput(null)} className="text-[9px] font-bold text-gray-600 hover:text-white transition-colors">Clear</button>
          </div>
          <div className="flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {!output && !executing && (
                <motion.div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                  <ImageIcon className="w-12 h-12" />
                  <p className="text-xs italic">Sorties console et graphiques ici...</p>
                </motion.div>
              )}
              {executing && (
                <motion.div className="h-full flex flex-col items-center justify-center">
                  <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">Computing...</p>
                </motion.div>
              )}
              {output && !executing && renderOutput()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
