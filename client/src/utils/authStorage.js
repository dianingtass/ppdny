export const AUTH_STORAGE_EVENT = "auth-storage-changed";

export const emitAuthStorageChanged = () => {
  window.dispatchEvent(new Event(AUTH_STORAGE_EVENT));
};

export const getAuthToken = () => localStorage.getItem("token");

/**
 * Decode JWT payload client-side (no signature verification).
 * Returns { id, nama, role } from the token, or null if token is missing/invalid.
 * Role checking for routing is safe here since the server still validates on every API call.
 */
export const getStoredAuthUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const setAuthSession = ({ token }) => {
  if (token) {
    localStorage.setItem("token", token);
  }
  emitAuthStorageChanged();
};

export const clearAuthSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user"); // cleanup legacy key jika masih ada di browser lama
  emitAuthStorageChanged();
};
