const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? window.location.origin : "");

type FetchOptions = RequestInit & {
  // Optionnel: passer true si vous souhaitez ignorer l'injection de token
  skipAuth?: boolean;
};

export class ApiError extends Error {
  status: number;
  data: unknown;
  response: Response;

  constructor(message: string, response: Response, data: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.status = response.status;
    this.data = data;
    this.response = response;
  }
}

function buildUrl(endpoint: string) {
  return `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
}

async function parseErrorResponse(
  response: Response,
): Promise<{ message: string; data: unknown }> {
  const contentType = response.headers.get("content-type") || "";
  let data: unknown = null;
  let message = `Erreur HTTP: ${response.status}`;

  try {
    if (contentType.includes("application/json")) {
      data = await response.json();

      if (data && typeof data === "object") {
        const payload = data as Record<string, unknown>;

        const detail = payload.detail;
        if (typeof detail === "string" && detail.trim()) {
          return { message: detail, data };
        }

        const error = payload.error;
        if (typeof error === "string" && error.trim()) {
          return { message: error, data };
        }

        const messageField = payload.message;
        if (typeof messageField === "string" && messageField.trim()) {
          return { message: messageField, data };
        }

        const fieldErrors = Object.entries(payload)
          .filter(([key]) => !["detail", "error", "message"].includes(key))
          .map(([key, value]) => {
            if (Array.isArray(value)) {
              return `${key}: ${value.join(" ")}`;
            }
            if (typeof value === "string") {
              return `${key}: ${value}`;
            }
            return `${key}: ${JSON.stringify(value)}`;
          })
          .filter(Boolean);

        if (fieldErrors.length > 0) {
          message = fieldErrors.join(" | ");
        }
      }
    } else {
      const text = await response.text();
      if (text.trim()) {
        message = text.trim();
        data = text.trim();
      }
    }
  } catch {
    // Si le corps n'est pas lisible, on conserve le message HTTP par défaut.
  }

  return { message, data };
}

// Gestion des rafraîchissements concurrents de Token
let refreshTokenPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return null;

  try {
    const response = await fetch(buildUrl("/api/public/users/token/refresh/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Refresh token expiré ou invalide");
    }

    const data = await response.json();
    if (data.access) {
      localStorage.setItem("access_token", data.access);
      if (data.refresh) localStorage.setItem("refresh_token", data.refresh);
      return data.access;
    }
    return null;
  } catch (error) {
    // En cas d'échec de rafraîchissement, on purge les tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    sessionStorage.removeItem("2fa_verified");
    return null;
  } finally {
    refreshTokenPromise = null;
  }
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const { message, data } = await parseErrorResponse(response);
    throw new ApiError(message, response, data);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await response.json();
  }

  return await response.text();
}

export async function fetchApi(endpoint: string, options: FetchOptions = {}) {
  const { headers: customHeaders, skipAuth = false, ...restOptions } = options;

  const headers = new Headers(customHeaders);
  headers.set("Accept", "application/json");

  if (
    restOptions.body &&
    !headers.has("Content-Type") &&
    !(restOptions.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  // 1. Injection du token d'accès s'il existe
  if (typeof window !== "undefined" && !skipAuth) {
    const token = localStorage.getItem("access_token");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const url = buildUrl(endpoint);

  try {
    let response = await fetch(url, {
      headers,
      credentials: "include",
      ...restOptions,
    });

    // 2. Fallback pour les endpoints publics qui échouent en 401 si un vieux token est envoyé
    if (
      response.status === 401 &&
      endpoint.includes("/api/public/") &&
      headers.has("Authorization")
    ) {
      console.warn(
        `[fetchApi] Requête publique vers ${endpoint} rejetée avec 401. Nouvel essai sans header Authorization...`,
      );
      headers.delete("Authorization");
      response = await fetch(url, {
        headers,
        credentials: "include",
        ...restOptions,
      });
      return await handleResponse(response);
    }

    // 3. Gestion automatique du Refresh Token pour les routes privées (401)
    if (
      response.status === 401 &&
      !endpoint.includes("/api/public/") &&
      typeof window !== "undefined"
    ) {
      console.warn(`[fetchApi] Session expirée sur ${endpoint}. Tentative de refresh...`);

      // Évite plusieurs appels réseau simultanés au refresh
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshAccessToken();
      }

      const newToken = await refreshTokenPromise;

      if (newToken) {
        headers.set("Authorization", `Bearer ${newToken}`);
        response = await fetch(url, {
          headers,
          credentials: "include",
          ...restOptions,
        });
      }
    }

    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error(`[fetchApi] Erreur lors de l'appel à ${endpoint}:`, error);
    throw error;
  }
}