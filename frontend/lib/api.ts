'use client';

import { QueryClient } from '@tanstack/react-query';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': 'demo-user',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  audits: {
    list: () => apiFetch('/audits'),
    get: (id: string) => apiFetch(`/audits/${id}`),
    updateStatus: (id: string, status: string) =>
      apiFetch(`/audits/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    sign: (id: string) => apiFetch(`/audits/${id}/sign`, { method: 'POST' }),
    activateAuto: (id: string) => apiFetch(`/audits/${id}/auto/activate`, { method: 'POST' }),
  },
  checklist: {
    list: (auditId: string) => apiFetch(`/audits/${auditId}/checklist`),
    updateStatus: (auditId: string, itemId: string, status: string) =>
      apiFetch(`/audits/${auditId}/checklist/${itemId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    updateNotes: (auditId: string, itemId: string, notes: string) =>
      apiFetch(`/audits/${auditId}/checklist/${itemId}/notes`, { method: 'PATCH', body: JSON.stringify({ notes }) }),
  },
  documents: {
    list: (auditId: string) => apiFetch(`/audits/${auditId}/documents`),
    upload: (auditId: string, file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return fetch(`${API_BASE}/audits/${auditId}/documents`, {
        method: 'POST',
        headers: { 'X-User-Id': 'demo-user' },
        body: formData,
      }).then((res) => res.json());
    },
  },
  queries: {
    list: (auditId: string) => apiFetch(`/audits/${auditId}/queries`),
    create: (auditId: string, data: { subject: string; body: string; accountantEmail: string }) =>
      apiFetch(`/audits/${auditId}/queries`, { method: 'POST', body: JSON.stringify(data) }),
    send: (auditId: string, queryId: string) =>
      apiFetch(`/audits/${auditId}/queries/${queryId}/send`, { method: 'POST' }),
  },
  findings: {
    list: (auditId: string) => apiFetch(`/audits/${auditId}/findings`),
    create: (auditId: string, data: { title: string; description: string; severity: string; sisReference: string }) =>
      apiFetch(`/audits/${auditId}/findings`, { method: 'POST', body: JSON.stringify(data) }),
  },
  dashboard: {
    stats: () => apiFetch('/dashboard/stats'),
    activity: () => apiFetch('/dashboard/activity'),
  },
  funds: {
    list: () => apiFetch('/funds'),
    create: (data: Record<string, unknown>) => apiFetch('/funds', { method: 'POST', body: JSON.stringify(data) }),
  },
};
