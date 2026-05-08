"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, Terminal, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface CodeSandboxProps {
  lessonId: string | number;
  initialCode?: string;
}

export default function CodeSandbox({ lessonId, initialCode = "# Bienvenue dans le Bac à Sable MLAcademy\n\ndef solve():\n    print(\"Hello, World!\")\n\nsolve()" }: CodeSandboxProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<any>(null);
  const [executing, setExecuting] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Charger le code sauvegardé s'il existe
    async function loadSavedCode() {
      try {
        const data = await fetchApi(`/api/learning/lessons/${lessonId}/code/`);
        if (data && data.code) {
          setCode(data.code);
        }
      } catch (err) {
        console.error("Erreur chargement code sauvé:", err);
      }
    }
    loadSavedCode();
  }, [lessonId]);

  const handleRun = async () => {
    setExecuting(true);
    setSaving(true);
    try {
      const result = await fetchApi(`/api/learning/lessons/${lessonId}/code/`, {
        method: "POST",
        body: JSON.stringify({ code })
      });
      setOutput(result.execution || { error: "Pas de réponse de la sandbox." });
    } catch (err: any) {
      setOutput({ error: err.message || "Erreur de connexion à la sandbox." });
    } finally {
      setExecuting(false);
      setSaving(false);
    }
  };

  const clearConsole = () => setOutput(null);

  return (
    <div className="flex flex-col h-full gap-4 overflow-hidden">
      
      {/* Editor Header */}
      <div className="flex items-center justify-between shrink-0 bg-[#112240] p-4 rounded-2xl border border-white/5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Terminal className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Éditeur Python</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Python 3.11</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={clearConsole}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            title="Effacer la console"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button 
            onClick={handleRun}
            disabled={executing}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg ${executing ? 'bg-gray-700 text-gray-400' : 'bg-[#00D1FF] text-[#0A192F] hover:scale-105 active:scale-95 shadow-[#00D1FF]/20'}`}
          >
            {executing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            {executing ? "Exécution..." : "Exécuter"}
          </button>
        </div>
      </div>

      {/* Main Sandbox Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
        
        {/* Monaco Editor Container */}
        <div className="flex-[3] bg-[#0B1121] rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative group">
          <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            {saving ? (
              <span className="flex items-center gap-2 text-[10px] font-bold text-gray-500 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                <Loader2 className="w-3 h-3 animate-spin" /> Sauvegarde...
              </span>
            ) : (
              <span className="flex items-center gap-2 text-[10px] font-bold text-green-500/70 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> Sauvegardé
              </span>
            )}
          </div>
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 20 },
              fontFamily: "JetBrains Mono, Menlo, Monaco, 'Courier New', monospace",
              cursorSmoothCaretAnimation: "on",
              smoothScrolling: true,
              lineNumbersMinChars: 3,
              backgroundColor: "#0B1121",
            }}
          />
        </div>

        {/* Output Console Container */}
        <div className="flex-[2] bg-[#0A192F] rounded-3xl border border-white/5 flex flex-col overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-white/5 bg-[#112240]/50 flex items-center gap-2 shrink-0">
            <Terminal className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Console d'exécution</span>
          </div>
          
          <div className="flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {!output && !executing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30"
                >
                  <Terminal className="w-12 h-12 text-gray-600" />
                  <p className="text-gray-500 text-xs italic">Appuyez sur "Exécuter" pour voir le résultat...</p>
                </motion.div>
              )}

              {executing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex items-center justify-center"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-[#00D1FF] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-[#00D1FF] uppercase tracking-widest animate-pulse">Traitement en cours</p>
                  </div>
                </motion.div>
              )}

              {output && !executing && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {output.error && (
                    <div className="flex gap-3 p-4 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-400">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <div className="space-y-1">
                        <p className="font-bold text-xs uppercase tracking-wider">Erreur d'exécution</p>
                        <pre className="text-sm whitespace-pre-wrap">{output.error}</pre>
                      </div>
                    </div>
                  )}

                  {output.stdout && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-green-500 uppercase tracking-widest ml-1">Sortie standard</p>
                      <pre className="p-4 bg-white/5 rounded-2xl border border-white/5 text-gray-300 whitespace-pre-wrap shadow-inner">
                        {output.stdout}
                      </pre>
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

                  {/* Execution Stats */}
                  <div className="flex gap-3 pt-4">
                    <div className="bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                      <p className="text-[8px] font-black text-gray-500 uppercase">Temps</p>
                      <p className="text-xs font-bold text-gray-300">{output.time || "0"}s</p>
                    </div>
                    <div className="bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                      <p className="text-[8px] font-black text-gray-500 uppercase">Mémoire</p>
                      <p className="text-xs font-bold text-gray-300">{(output.memory / 1024).toFixed(1) || "0"} MB</p>
                    </div>
                    <div className="bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                      <p className="text-[8px] font-black text-gray-500 uppercase">Statut</p>
                      <p className={`text-xs font-bold ${output.status?.id === 3 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {output.status?.description || "Inconnu"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

    </div>
  );
}
