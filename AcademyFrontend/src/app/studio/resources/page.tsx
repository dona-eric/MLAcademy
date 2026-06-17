"use client";

import { useState } from "react";
import {
  FolderOpen, Upload, Search, Plus,
  FileText, Database, FileCode, Presentation, FileSpreadsheet,
  Download, Trash2, MoreVertical, Eye,
  CheckSquare, Square, Filter, Loader2
} from "lucide-react";

interface Resource {
  id: number;
  name: string;
  type: "dataset" | "notebook" | "pdf" | "slides" | "template";
  size: string;
  downloads: number;
  date: string;
}

const TYPE_CONFIG: Record<string, { icon: any; label: string; color: string }> = {
  dataset: { icon: Database, label: "Dataset", color: "cyan" },
  notebook: { icon: FileCode, label: "Notebook", color: "amber" },
  pdf: { icon: FileText, label: "PDF", color: "rose" },
  slides: { icon: Presentation, label: "Slides", color: "purple" },
  template: { icon: FileSpreadsheet, label: "Template", color: "emerald" },
};

// Demo data
const DEMO_RESOURCES: Resource[] = [
  { id: 1, name: "iris_dataset_cleaned.csv", type: "dataset", size: "2.4 MB", downloads: 142, date: "2026-06-10" },
  { id: 2, name: "intro_pytorch.ipynb", type: "notebook", size: "890 KB", downloads: 87, date: "2026-06-08" },
  { id: 3, name: "cheatsheet_pandas.pdf", type: "pdf", size: "1.2 MB", downloads: 312, date: "2026-06-05" },
  { id: 4, name: "presentation_mlops.pptx", type: "slides", size: "8.5 MB", downloads: 56, date: "2026-06-01" },
  { id: 5, name: "project_template_ml.zip", type: "template", size: "3.1 MB", downloads: 201, date: "2026-05-28" },
];

export default function InstructorResourcesPage() {
  const [resources] = useState<Resource[]>(DEMO_RESOURCES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [activeType, setActiveType] = useState("all");

  const filtered = resources.filter((r) => {
    if (activeType !== "all" && r.type !== activeType) return false;
    if (searchQuery) {
      return r.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const allSelected = filtered.length > 0 && filtered.every((r) => selectedIds.has(r.id));

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((r) => r.id)));
  };

  const toggleOne = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Bibliothèque de Ressources</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Centralisez vos datasets, notebooks, slides et templates</p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white rounded-xl text-[12px] font-bold hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20 shrink-0">
          <Upload className="w-4 h-4" /> Uploader une ressource
        </button>
      </div>

      {/* Type Filter + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-white/[0.03] rounded-xl p-1 border border-white/[0.06] flex-wrap">
          {[
            { key: "all", label: "Tous" },
            ...Object.entries(TYPE_CONFIG).map(([key, cfg]) => ({ key, label: cfg.label })),
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveType(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                activeType === tab.key
                  ? "bg-white/[0.08] text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une ressource..."
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2 pl-10 pr-4 text-[12px] text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/40 transition-all"
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-4 px-4 py-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl animate-in fade-in duration-200">
          <span className="text-[12px] font-bold text-indigo-400">{selectedIds.size} sélectionné{selectedIds.size > 1 ? "s" : ""}</span>
          <div className="h-4 w-px bg-indigo-500/20" />
          <button className="text-[11px] font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1"><Download className="w-3 h-3" /> Télécharger</button>
          <button className="text-[11px] font-bold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"><Trash2 className="w-3 h-3" /> Supprimer</button>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 space-y-4 bg-white/[0.02] border border-dashed border-white/[0.08] rounded-2xl">
          <FolderOpen className="w-12 h-12 text-slate-800 mx-auto" />
          <div>
            <p className="text-[14px] font-semibold text-white">Aucune ressource trouvée</p>
            <p className="text-[12px] text-slate-500 mt-1">Uploadez votre premier fichier pour commencer.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[40px_1fr_100px_80px_100px_100px_50px] items-center px-4 py-3 border-b border-white/[0.06] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <button onClick={toggleAll} className="flex items-center justify-center">
              {allSelected ? <CheckSquare className="w-4 h-4 text-indigo-400" /> : <Square className="w-4 h-4 text-slate-600" />}
            </button>
            <span>Nom du fichier</span>
            <span>Type</span>
            <span>Taille</span>
            <span className="text-center">Téléchargements</span>
            <span>Date d'ajout</span>
            <span></span>
          </div>

          {/* Rows */}
          {filtered.map((resource) => {
            const cfg = TYPE_CONFIG[resource.type];
            return (
              <div
                key={resource.id}
                className={`grid grid-cols-[40px_1fr_100px_80px_100px_100px_50px] items-center px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.03] transition-all group ${
                  selectedIds.has(resource.id) ? "bg-indigo-500/[0.04]" : ""
                }`}
              >
                <button onClick={() => toggleOne(resource.id)} className="flex items-center justify-center">
                  {selectedIds.has(resource.id) ? (
                    <CheckSquare className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-700 group-hover:text-slate-500" />
                  )}
                </button>

                {/* Name */}
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <div className={`w-9 h-9 rounded-lg bg-${cfg.color}-500/10 flex items-center justify-center shrink-0`}>
                    <cfg.icon className={`w-4 h-4 text-${cfg.color}-400`} />
                  </div>
                  <span className="text-[13px] font-medium text-white truncate">{resource.name}</span>
                </div>

                {/* Type */}
                <span className={`text-[10px] font-bold uppercase bg-${cfg.color}-500/10 text-${cfg.color}-400 px-2 py-0.5 rounded w-fit`}>
                  {cfg.label}
                </span>

                {/* Size */}
                <span className="text-[12px] text-slate-500 font-medium">{resource.size}</span>

                {/* Downloads */}
                <div className="flex items-center justify-center gap-1 text-[12px] text-slate-400 font-medium">
                  <Download className="w-3 h-3" />
                  {resource.downloads}
                </div>

                {/* Date */}
                <span className="text-[11px] text-slate-600 font-medium">
                  {new Date(resource.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/[0.08] text-slate-500 hover:text-white transition-all" title="Télécharger">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
