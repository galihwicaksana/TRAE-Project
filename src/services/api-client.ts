import type { ApiErrorResponse, ApiSuccessResponse } from '../types/ecoroute';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';
export const API_MODE = import.meta.env.VITE_API_MODE ?? 'demo';

export class ApiClientError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, options?: { code?: string; status?: number }) {
    super(message);
    this.name = 'ApiClientError';
    this.code = options?.code;
    this.status = options?.status;
  }
}

async function parseResponse<T>(response: Response): Promise<ApiSuccessResponse<T>> {
  const payload = (await response.json()) as ApiSuccessResponse<T> | ApiErrorResponse;

  if (!response.ok || !payload.success) {
    const errorPayload = payload as ApiErrorResponse;
    throw new ApiClientError(errorPayload.message ?? 'Permintaan gagal', {
      code: errorPayload.error?.code,
      status: response.status,
    });
  }

  return payload;
}

export async function apiGet<T>(path: string) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  return parseResponse<T>(response);
}

export async function apiPost<T, TBody>(path: string, body: TBody) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return parseResponse<T>(response);
}

export async function withDemoFallback<T>(fetcher: () => Promise<T>, fallback: () => T | Promise<T>) {
  if (API_MODE === 'demo') {
    return fallback();
  }

  try {
    return await fetcher();
  } catch (error) {
    if (API_MODE === 'auto') {
      return fallback();
    }

    throw error;
  }
}
