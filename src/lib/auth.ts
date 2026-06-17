import type { User } from "./types";

const tokenKey = "estateflow_access_token";
const refreshKey = "estateflow_refresh_token";
const userKey = "estateflow_user";

export function getToken() {
  return sessionStorage.getItem(tokenKey);
}

export function getUser(): User | null {
  const raw = localStorage.getItem(userKey);
  return raw ? (JSON.parse(raw) as User) : null;
}

export function setSession(payload: { accessToken?: string; token?: string; refreshToken?: string; user?: User }) {
  const token = payload.accessToken ?? payload.token;
  if (token) sessionStorage.setItem(tokenKey, token);
  if (payload.refreshToken) localStorage.setItem(refreshKey, payload.refreshToken);
  if (payload.user) localStorage.setItem(userKey, JSON.stringify(payload.user));
  window.dispatchEvent(new Event("estateflow-auth"));
}

export function clearSession() {
  sessionStorage.removeItem(tokenKey);
  localStorage.removeItem(refreshKey);
  localStorage.removeItem(userKey);
  window.dispatchEvent(new Event("estateflow-auth"));
}
