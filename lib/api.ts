export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5153/api";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("kb_auth_token") : null;
  
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (options.body && options.body instanceof FormData) {
    // Let browser set Content-Type with boundary for FormData
  } else if (!headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = "An error occurred";
    if (response.status === 401) {
      errorMessage = "Session expired or unauthorized. Please log in with your Admin credentials.";
    } else if (response.status === 403) {
      errorMessage = "Access denied: Administrator privileges required.";
    } else {
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.errors && typeof errorData.errors === "object") {
          const firstErr = Object.values(errorData.errors).flat()[0];
          if (firstErr) errorMessage = String(firstErr);
        } else if (errorData.title) {
          errorMessage = errorData.title;
        }
      } catch {
        // Ignore JSON parse error if response is not JSON
      }
    }
    throw new Error(errorMessage);
  }

  // Some endpoints like logout return 200 OK with no body or empty json, handling it
  try {
    return await response.json();
  } catch {
    return null;
  }
}
