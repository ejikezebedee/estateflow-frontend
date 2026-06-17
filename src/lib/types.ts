export type Role = "seeker" | "landlord" | "agent" | "admin";

export type User = {
  id: string;
  name?: string;
  email: string;
  role: Role;
};

export type Paged<T> = {
  data?: T[];
  items?: T[];
  results?: T[];
  page?: number;
  total?: number;
  totalPages?: number;
  meta?: { page?: number; total?: number; totalPages?: number };
};

export type Listing = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  city?: string;
  district?: string;
  address?: string;
  price?: number;
  rentPrice?: number;
  salePrice?: number;
  rooms?: number;
  area?: number;
  livingArea?: number;
  propertyType?: string;
  listingGoal?: string;
  status?: string;
  availableFrom?: string;
  provider?: { id?: string; name?: string; type?: string; email?: string };
  images?: Array<string | { url?: string; alt?: string }>;
  amenities?: string[] | Array<{ name: string }>;
  energyCertificate?: Record<string, unknown>;
  energyClass?: string;
  location?: { lat?: number; lng?: number; latitude?: number; longitude?: number };
  latitude?: number;
  longitude?: number;
  views?: number;
  favourites?: number;
  leads?: number;
  updatedAt?: string;
};

export type SavedSearch = {
  id: string;
  name: string;
  query?: string;
  alertFrequency?: "instant" | "daily" | "weekly" | "off";
  frequency?: "instant" | "daily" | "weekly" | "off";
};

export type MessageThread = {
  id: string;
  listing?: Listing;
  participant?: { name?: string; email?: string };
  leadStatus?: string;
  messages?: Array<{ id: string; body: string; authorName?: string; createdAt?: string }>;
};

export type ApiErrorPayload = {
  message?: string;
  errors?: Record<string, string[] | string>;
};
