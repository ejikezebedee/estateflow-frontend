import { getToken, setSession } from "./auth";
import type { ApiErrorPayload, Listing, MessageThread, Paged, SavedSearch, User } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";

export class ApiError extends Error {
  status: number;
  payload?: ApiErrorPayload;

  constructor(status: number, payload?: ApiErrorPayload) {
    super(payload?.message ?? statusMessage(status));
    this.status = status;
    this.payload = payload;
  }
}

function statusMessage(status: number) {
  if (status === 401) return "Please sign in to continue.";
  if (status === 403) return "Your account does not have access to this action.";
  if (status === 404) return "The requested record was not found.";
  if (status === 422) return "Some fields need correction.";
  if (status >= 500) return "The backend is unavailable. Please try again shortly.";
  return "Request failed.";
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  const payload = text ? (JSON.parse(text) as ApiErrorPayload) : undefined;
  if (!response.ok) throw new ApiError(response.status, payload);
  return payload as T;
}

export function normalizeList<T>(payload: Paged<T> | T[]): { items: T[]; total?: number; page?: number; totalPages?: number } {
  if (Array.isArray(payload)) return { items: payload };
  return {
    items: payload.data ?? payload.items ?? payload.results ?? [],
    total: payload.total ?? payload.meta?.total,
    page: payload.page ?? payload.meta?.page,
    totalPages: payload.totalPages ?? payload.meta?.totalPages
  };
}

export const api = {
  baseUrl: API_BASE,
  register: async (body: { name: string; email: string; password: string; role: string }) => {
    const result = await request<{ accessToken?: string; token?: string; refreshToken?: string; user?: User }>("/auth/register", { method: "POST", body: JSON.stringify(body) });
    setSession(result);
    return result;
  },
  login: async (body: { email: string; password: string }) => {
    const result = await request<{ accessToken?: string; token?: string; refreshToken?: string; user?: User }>("/auth/login", { method: "POST", body: JSON.stringify(body) });
    setSession(result);
    return result;
  },
  me: () => request<User>("/me"),
  searchProperties: (params: URLSearchParams) => request<Paged<Listing> | Listing[]>(`/search/properties?${params.toString()}`),
  listing: (slug: string) => request<Listing>(`/listings/${slug}`),
  favourites: () => request<Paged<Listing> | Listing[]>("/favourites"),
  saveFavourite: (id: string) => request<void>(`/favourites/${id}`, { method: "POST" }),
  unsaveFavourite: (id: string) => request<void>(`/favourites/${id}`, { method: "DELETE" }),
  savedSearches: () => request<Paged<SavedSearch> | SavedSearch[]>("/saved-searches"),
  createSavedSearch: (body: Partial<SavedSearch>) => request<SavedSearch>("/saved-searches", { method: "POST", body: JSON.stringify(body) }),
  updateSavedSearch: (id: string, body: Partial<SavedSearch>) => request<SavedSearch>(`/saved-searches/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteSavedSearch: (id: string) => request<void>(`/saved-searches/${id}`, { method: "DELETE" }),
  contactProvider: (id: string, body: unknown) => request<{ id: string }>(`/listings/${id}/contact`, { method: "POST", body: JSON.stringify(body) }),
  threads: () => request<Paged<MessageThread> | MessageThread[]>("/messages/threads"),
  thread: (id: string) => request<MessageThread>(`/messages/threads/${id}`),
  sendMessage: (id: string, body: string) => request<void>(`/messages/threads/${id}/messages`, { method: "POST", body: JSON.stringify({ body }) }),
  providerDashboard: () => request<Record<string, unknown>>("/provider/dashboard"),
  providerListings: () => request<Paged<Listing> | Listing[]>("/provider/listings"),
  adminMetrics: () => request<Record<string, unknown>>("/admin/metrics"),
  adminPendingListings: () => request<Paged<Listing> | Listing[]>("/admin/listings/pending"),
  approveListing: (id: string) => request<void>(`/admin/listings/${id}/approve`, { method: "POST" }),
  rejectListing: (id: string, reason: string) => request<void>(`/admin/listings/${id}/reject`, { method: "POST", body: JSON.stringify({ reason }) }),
  adminReports: () => request<Paged<Record<string, unknown>> | Record<string, unknown>[]>("/admin/reports")
};

export function imageUrl(listing: Listing) {
  const first = listing.images?.[0];
  if (typeof first === "string") return first;
  return first?.url ?? "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80";
}

export function priceOf(listing: Listing) {
  return listing.price ?? listing.rentPrice ?? listing.salePrice ?? 0;
}

export function areaOf(listing: Listing) {
  return listing.area ?? listing.livingArea ?? 0;
}
