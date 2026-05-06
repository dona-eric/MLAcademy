"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Clock,
  Flame,
  Play,
  Sparkles,
  Target,
} from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    async function loadData() {
      try {
        const enrollments = await fetchApi("/api/users/me/enrollments/");
        setEnrolledCourses(enrollments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-6 py-8 lg:px-8 lg:py-10">
      <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-700">
              <Sparkles className="h-3 w-3" /> Votre espace étudiant
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
              Bonjour,{" "}
              <span className="text-gradient">
                {user?.first_name || user?.username || "Étudiant"}
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600">
              Reprends ton apprentissage, suis ta progression et continue à avancer sur tes parcours.
            </p>
          </div>
          <Link href="/parcours" className="btn btn-primary">
            Explorer les parcours <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {[
          {
            label: "Cours en cours",
            value: enrolledCourses.length,
            icon: <BookOpen className="h-7 w-7 text-indigo-600" />,
            bg: "bg-indigo-50",
          },
          {
            label: "Série actuelle",
            value: "3 jours",
            icon: <Flame className="h-7 w-7 text-amber-500" />,
            bg: "bg-amber-50",
          },
          {
            label: "Certificats",
            value: "0",
            icon: <Award className="h-7 w-7 text-slate-900" />,
            bg: "bg-slate-100",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.bg}`}
            >
              {card.icon}
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-500">
              {card.label}
            </p>
            <p className="mt-1 text-3xl font-bold text-slate-950">
              {card.value}
            </p>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-950">
            Reprendre l’apprentissage
          </h2>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center md:p-16">
            <Target className="mx-auto h-14 w-14 text-slate-300" />
            <h3 className="mt-4 text-xl font-semibold text-slate-950">
              Aucun parcours en cours
            </h3>
            <p className="mx-auto mt-2 max-w-md text-slate-600">
              Tu n’es inscrit à aucun parcours pour le moment. Découvre le
              catalogue pour commencer.
            </p>
            <Link href="/parcours" className="btn btn-secondary mt-6">
              Parcourir le catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {enrolledCourses.map((enrollment: any) => {
              const course = enrollment.course;
              const progress =
                enrollment.progress || Math.floor(Math.random() * 60) + 10;

              return (
                <div
                  key={enrollment.id}
                  className="group flex flex-col gap-6 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl md:flex-row md:p-6"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.5rem] bg-slate-900 md:w-56 md:shrink-0 md:aspect-square">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-white/20">
                        <BarChart3 className="h-12 w-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
                  </div>

                  <div className="flex flex-1 flex-col justify-center space-y-5">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold leading-tight text-slate-950 transition group-hover:text-indigo-700">
                        {course.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-4 w-4" /> {course.duration_hours}h
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Play className="h-4 w-4" />{" "}
                          {course.modules_count || 5} modules
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                        <span>Progression</span>
                        <span className="text-indigo-600">{progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      href={`/learning/${course.slug}/lesson/`}
                      className="btn btn-primary w-full py-4 text-sm"
                    >
                      Continuer <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
