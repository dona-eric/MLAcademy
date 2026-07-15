const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" ? window.location.origin : "");

type FetchOptions = RequestInit & {
  // Les cookies HttpOnly sont envoyés automatiquement avec credentials: include.
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
          message = detail;
          return { message, data };
        }

        const error = payload.error;
        if (typeof error === "string" && error.trim()) {
          message = error;
          return { message, data };
        }

        const messageField = payload.message;
        if (typeof messageField === "string" && messageField.trim()) {
          message = messageField;
          return { message, data };
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

export async function fetchApi(endpoint: string, options: FetchOptions = {}) {
  const { headers: customHeaders, ...restOptions } = options;

  const headers = new Headers(customHeaders);
  headers.set("Accept", "application/json");

  if (
    restOptions.body &&
    !headers.has("Content-Type") &&
    !(restOptions.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (typeof window !== "undefined") {
    // Remplace access_token par la clé exacte que tu utilises dans ton AuthContext pour sauvegarder le token
    const token = localStorage.getItem("access_token"); 
    
    // Si un token existe et que l'en-tête n'est pas déjà défini manuellement
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const url = buildUrl(endpoint);

  try {
    const response = await fetch(url, {
      headers,
      credentials: "include",
      ...restOptions,
    });

    if (!response.ok) {
      if (response.status === 401 && endpoint.includes("/api/public/") && headers.has("Authorization")) {
        console.warn(`Request to public endpoint ${endpoint} failed with 401. Retrying without authorization...`);
        headers.delete("Authorization");
        const retryResponse = await fetch(url, {
          headers,
          credentials: "include",
          ...restOptions,
        });
        if (retryResponse.ok) {
          if (retryResponse.status === 204) return null;
          const contentType = retryResponse.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            return await retryResponse.json();
          }
          return await retryResponse.text();
        }
      }
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
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error(`Erreur lors de l'appel à ${endpoint}:`, error);
    throw error;
  }
}
