import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './authToken';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1';

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  skipAuth?: boolean;
  /** internal: prevents infinite refresh loops */
  _retried?: boolean;
}

let refreshInFlight: Promise<boolean> | null = null;

async function doRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    });
    if (!res.ok) return false;
    const data = await res.json();
    setTokens(data.access_token, data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

// The backend serializes Mongo documents with their id under the `_id` key
// (Pydantic `Field(alias="_id")`), not `id`. Every list/detail response gets
// normalized here so the rest of the app can just use `.id` everywhere.
function normalizeIds<T>(payload: T): T {
  if (Array.isArray(payload)) {
    return payload.map((item) => normalizeIds(item)) as unknown as T;
  }
  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    if ('_id' in obj && !('id' in obj)) {
      return { ...obj, id: obj._id } as unknown as T;
    }
  }
  return payload;
}

function buildUrl(path: string, params?: RequestOptions['params']): string {
  const url = `${API_BASE}${path}`;
  if (!params) return url;
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  });
  const qs = search.toString();
  return qs ? `${url}?${qs}` : url;
}

export async function apiRequest<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, params, skipAuth, _retried } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(buildUrl(path, params), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  if (res.status === 401 && !skipAuth && !_retried && path !== '/auth/refresh') {
    if (!refreshInFlight) refreshInFlight = doRefresh().finally(() => { refreshInFlight = null; });
    const refreshed = await refreshInFlight;
    if (refreshed) {
      return apiRequest<T>(path, { ...options, _retried: true });
    }
    clearTokens();
    throw new ApiError(401, 'Session expired. Please log in again.');
  }

  let payload: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!res.ok) {
    const body = payload as { error?: string; detail?: unknown } | null;
    const message =
      (body && typeof body.error === 'string' && body.error) ||
      (body && typeof body.detail === 'string' && body.detail) ||
      `Request failed with status ${res.status}`;
    throw new ApiError(res.status, message, body?.detail ?? body);
  }

  return normalizeIds(payload) as T;
}

export const api = {
  get: <T = unknown>(path: string, params?: RequestOptions['params']) =>
    apiRequest<T>(path, { method: 'GET', params }),
  post: <T = unknown>(path: string, body?: unknown, params?: RequestOptions['params']) =>
    apiRequest<T>(path, { method: 'POST', body, params }),
  patch: <T = unknown>(path: string, body?: unknown, params?: RequestOptions['params']) =>
    apiRequest<T>(path, { method: 'PATCH', body, params }),
  put: <T = unknown>(path: string, body?: unknown, params?: RequestOptions['params']) =>
    apiRequest<T>(path, { method: 'PUT', body, params }),
  delete: <T = unknown>(path: string, params?: RequestOptions['params']) =>
    apiRequest<T>(path, { method: 'DELETE', params })
};
