"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import { Users, Loader2, AlertCircle, Search } from "lucide-react";

export default function InstructorStudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function load() {
      try {
        // Récupère les inscriptions aux cours de l'instructeur
        const data = await fetchApi("/api/instructor/courses/");
        const courses = data.results ?? data ?? [];

        // Agrège les étudiants depuis chaque cours
        const allStudents: any[] = [];
        await Promise.all(
          courses.map(async (course: any) => {
            try {
              const enrollments = await fetchApi("/api/instructor/courses/${course.id}/enrollments/");
              const list = enrollments.results ?? enrollments ?? [];
              list.forEach((e: any) => {
                if (!allStudents.find((s) => s.id === e.user?.id)) {
                  allStudents.push({ ...e.user, enrolled_course: course.title });
                }
              });
            } catch {
              // L'endpoint peut ne pas exister encore
            }
          })
        );
        setStudents(allStudents);
      } catch (err: any) {
        setError("Impossible de charger la liste des étudiants.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = students.filter((s) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      s.username?.toLowerCase().includes(q) ||
      s.first_name?.toLowerCase().includes(q) ||
      s.last_name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 lg:p-12 max-w-5xl mx-auto space-y-8">
      <div className="pb-6">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Mes Étudiants</h1>
        <p className="text-sm text-slate-500 mt-1">Liste des apprenants inscrits à vos formations.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-slate-50 border border-dashed rounded-lg p-16 text-center">
          <Users className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-slate-900 mb-1">Aucun étudiant pour le moment</h3>
          <p className="text-xs text-slate-500">Vos apprenants apparaîtront ici une fois inscrits à vos cours.</p>
        </div>
      ) : (
        <>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un étudiant..."
              className="w-full bg-white border border-slate-300 rounded-md py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="divide-y divide-slate-100">
              {filtered.map((student, i) => (
                <div key={student.id ?? i} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-sm shrink-0">
                    {(student.first_name?.[0] || student.username?.[0] || "?").toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {student.first_name && student.last_name
                        ? "${student.first_name} ${student.last_name}"
                        : student.username}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{student.email}</p>
                  </div>
                  {student.enrolled_course && (
                    <span className="text-xs text-slate-500 truncate max-w-[160px]">{student.enrolled_course}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
