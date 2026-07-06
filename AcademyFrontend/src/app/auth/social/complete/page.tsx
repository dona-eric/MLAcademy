// social auth completion page
"use client";

<<<<<<< HEAD
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
=======
import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchApi, ApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
>>>>>>> develop

type CompleteResponse = {
  message?: string;
  next?: string;
};

function sanitizeNextPath(value: string | null): string {
  if (!value) return "/parcours";
  if (!value.startsWith("/")) return "/parcours";
  if (value.startsWith("//")) return "/parcours";
  return value;
}

<<<<<<< HEAD
export default function SocialAuthCompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
=======
function SocialAuthCompletePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkAuth } = useAuth();
>>>>>>> develop

  const nextPath = useMemo(() => {
    return sanitizeNextPath(searchParams.get("next"));
  }, [searchParams]);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState(
    "Finalisation de votre connexion en cours...",
  );

  useEffect(() => {
    let isMounted = true;
<<<<<<< HEAD
=======
    let timeoutId: number | undefined;
>>>>>>> develop

    async function completeSocialLogin() {
      try {
        const response = (await fetchApi(
<<<<<<< HEAD
          "/api/users/social/complete/",
          {
            method: "GET",
          },
        )) as CompleteResponse;

        if (!isMounted) return;

        setStatus("success");
        setMessage(response?.message || "Connexion sociale réussie.");

        const destination = sanitizeNextPath(response?.next || nextPath);

        window.setTimeout(() => {
          if (!isMounted) return;
          router.replace(destination);
        }, 900);
      } catch (error) {
        if (!isMounted) return;

        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Impossible de finaliser la connexion sociale.",
        );
=======
          "/api/private/users/social/complete/",
          {
            method: "GET",
          },
        )) as CompleteResponse & { access?: string; refresh?: string };

        if (!isMounted) return;

        if (response.access) localStorage.setItem("access_token", response.access);
        if (response.refresh) localStorage.setItem("refresh_token", response.refresh);

        // Synchroniser le contexte utilisateur global avant de rediriger
        await checkAuth();

        if (!isMounted) return;

        // Sauvegarder la destination finale voulue pour après la validation 2FA
        if (typeof window !== "undefined") {
          sessionStorage.setItem("post_2fa_redirect", nextPath);
        }

        setStatus("success");
        setMessage(response?.message || "Connexion sociale réussie. Redirection vers la sécurisation 2FA...");

        timeoutId = window.setTimeout(() => {
          if (!isMounted) return;
          router.replace("/2fa");
        }, 900);
      } catch (error: any) {
        if (!isMounted) return;

        setStatus("error");
        if (error instanceof ApiError) {
          if (error.status === 401) {
            setMessage("Session d'authentification sociale invalide ou expirée.");
          } else if (error.status === 403) {
            setMessage("Accès refusé. Votre compte n'est pas autorisé.");
          } else {
            setMessage(error.message || "Erreur lors de la finalisation.");
          }
        } else {
          setMessage(
            error instanceof Error
              ? error.message
              : "Impossible de finaliser la connexion sociale.",
          );
        }
>>>>>>> develop
      }
    }

    completeSocialLogin();

    return () => {
      isMounted = false;
<<<<<<< HEAD
    };
  }, [nextPath, router]);
=======
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [nextPath, router, checkAuth]);
>>>>>>> develop

  return (
    <div
      className="auth-container"
      style={{
        minHeight: "calc(100vh - 72px)",
        background:
          "radial-gradient(circle at top, rgba(99, 102, 241, 0.05), transparent 40%)",
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "520px",
          padding: "2.75rem",
          textAlign: "center",
        }}
      >
        <h1
          className="text-gradient"
          style={{
            fontSize: "2rem",
            marginBottom: "1rem",
          }}
        >
          {status === "loading"
            ? "Connexion sociale..."
            : status === "success"
              ? "Connexion réussie"
              : "Connexion impossible"}
        </h1>

        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "1.5rem",
            fontSize: "0.98rem",
          }}
        >
          {message}
        </p>

        {status === "loading" && (
          <div
            style={{
              width: "100%",
              height: "6px",
              borderRadius: "999px",
              background: "var(--bg-tertiary)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "40%",
                height: "100%",
                borderRadius: "999px",
                background:
                  "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                animation: "socialAuthPulse 1.2s ease-in-out infinite",
              }}
            />
          </div>
        )}

        {status === "error" && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <Link href="/login" className="btn btn-primary">
<<<<<<< HEAD
              Retour à la connexion
            </Link>
            <Link href="/parcours" className="btn btn-secondary">
              Aller aux cours
=======
              Connexion
            </Link>
            <Link href="/parcours" className="btn btn-secondary">
              Découvrez nos formations
>>>>>>> develop
            </Link>
          </div>
        )}

        {status === "success" && (
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--text-muted)",
              marginTop: "1rem",
            }}
          >
            Redirection vers vos cours...
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes socialAuthPulse {
          0% {
            transform: translateX(-120%);
          }
          50% {
            transform: translateX(120%);
          }
          100% {
            transform: translateX(120%);
          }
        }
      `}</style>
    </div>
  );
}
<<<<<<< HEAD
=======

export default function SocialAuthCompletePage() {
  return (
    <Suspense fallback={
      <div className="auth-container" style={{ minHeight: "calc(100vh - 72px)" }}>
        <div className="glass-panel" style={{ width: "100%", maxWidth: "520px", padding: "2.75rem", textAlign: "center" }}>
          <h1 className="text-gradient" style={{ fontSize: "2rem", marginBottom: "1rem" }}>Chargement...</h1>
        </div>
      </div>
    }>
      <SocialAuthCompletePageContent />
    </Suspense>
  );
}
>>>>>>> develop
