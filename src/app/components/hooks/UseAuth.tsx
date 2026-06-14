import { useState, useEffect, useCallback } from "react";

// ================================
// TYPES
// ================================

export interface UserSession {
  id: number;
  username: string;
  role: string;
  email?: string;
  whatsapp?: string;
  phone?: string;
}

interface LoginPayload {
  identity: string;
  password: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

interface ApiResponse {
  status: string;
  message?: string;
  user?: UserSession;
}

// ================================
// API BASE
// ================================

const API_BASE = "http://localhost/db_readytoshot";

// ================================
// LOCAL STORAGE HELPER
// ================================

function getStoredUser(): UserSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const session = localStorage.getItem("user_session");

  if (!session) return null;

  try {
    return JSON.parse(session) as UserSession;
  } catch {
    localStorage.removeItem("user_session");
    localStorage.removeItem("user_id");
    return null;
  }
}

// ================================
// USE AUTH
// ================================

export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(() =>
    getStoredUser()
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [isInitialized, setIsInitialized] = useState(false);

  // ================================
  // SAFE JSON PARSER
  // ================================

  const parseJsonResponse = async (
    response: Response
  ): Promise<ApiResponse> => {
    const text = await response.text();

    try {
      const data = JSON.parse(text);

      return {
        status: data.status || "error",
        message: data.message,
        user: data.user,
      };
    } catch {
      console.error("Response server bukan JSON:", text);

      return {
        status: "error",
        message:
          "Response server tidak valid. Cek file PHP apakah ada warning/error.",
      };
    }
  };

  // ================================
  // SAVE SESSION
  // ================================

  const saveSession = useCallback((userData: UserSession) => {
    setUser(userData);
    setError(null);

    localStorage.setItem(
      "user_session",
      JSON.stringify(userData)
    );

    localStorage.setItem("user_id", String(userData.id));
  }, []);

  // ================================
  // CLEAR SESSION
  // ================================

  const clearSession = useCallback(() => {
    setUser(null);
    setError(null);

    localStorage.removeItem("user_session");
    localStorage.removeItem("user_id");
  }, []);

  // ================================
  // CHECK SESSION FROM PHP
  // ================================

  const checkSession = useCallback(async (): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE}/login.php`, {
        method: "GET",
        credentials: "include",
      });

      const data = await parseJsonResponse(response);

      if (
        response.ok &&
        data.status === "already_logged_in" &&
        data.user
      ) {
        saveSession(data.user);
      } else {
        clearSession();
      }

      return data;
    } catch (err) {
      console.error("Session check failed:", err);

      clearSession();

      return {
        status: "error",
        message: "Gagal mengecek session",
      };
    } finally {
      setIsInitialized(true);
    }
  }, [saveSession, clearSession]);

  useEffect(() => {
    let active = true;

    const init = async () => {
      if (!active) return;

      await checkSession();
    };

    init();

    return () => {
      active = false;
    };
  }, [checkSession]);

  // ================================
  // LOGIN
  // ================================

  const login = useCallback(
    async (payload: LoginPayload): Promise<ApiResponse> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/login.php`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identity: payload.identity.trim(),
            password: payload.password,
          }),
        });

        const data = await parseJsonResponse(response);

        if (
          response.ok &&
          data.status === "success" &&
          data.user
        ) {
          saveSession(data.user);
        } else {
          setError(data.message || "Login gagal");
        }

        return data;
      } catch (err) {
        console.error("Login error:", err);

        const message = "Terjadi kesalahan server";

        setError(message);

        return {
          status: "error",
          message,
        };
      } finally {
        setLoading(false);
      }
    },
    [saveSession]
  );

  // ================================
  // REGISTER
  // ================================

  const register = useCallback(
    async (payload: RegisterPayload): Promise<ApiResponse> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/registrasi.php`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: payload.username.trim(),
            email: payload.email.trim(),
            password: payload.password,
          }),
        });

        const data = await parseJsonResponse(response);

        if (!response.ok || data.status !== "success") {
          setError(data.message || "Registrasi gagal");
        }

        return data;
      } catch (err) {
        console.error("Register error:", err);

        const message = "Terjadi kesalahan server";

        setError(message);

        return {
          status: "error",
          message,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ================================
  // LOGOUT
  // ================================

  const logout = useCallback(async (): Promise<ApiResponse> => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/logout.php`, {
        method: "POST",
        credentials: "include",
      });

      const data = await parseJsonResponse(response);

      clearSession();

      return data;
    } catch (err) {
      console.error("Logout error:", err);

      clearSession();

      return {
        status: "error",
        message: "Logout gagal",
      };
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  // ================================
  // RETURN
  // ================================

  return {
    user,
    loading,
    error,
    isInitialized,
    isAuthenticated: !!user,

    login,
    register,
    logout,
    checkSession,
    setError,
    clearSession,
  };
}