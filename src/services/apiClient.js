const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

let accessToken = localStorage.getItem('karigar_access_token') || null;
let onUnauthorized = null;

export function setAccessToken(token) {
  accessToken = token || null;
  if (token) {
    localStorage.setItem('karigar_access_token', token);
  } else {
    localStorage.removeItem('karigar_access_token');
  }
}

export function registerUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

async function request(path, options = {}, retryOn401 = true) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401 && retryOn401 && path !== '/auth/refresh-token') {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return request(path, options, false);
    }
    if (onUnauthorized) onUnauthorized();
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    let msg = payload?.error?.message || payload?.message;
    if (!msg && payload?.errors && Array.isArray(payload.errors) && payload.errors.length > 0) {
      msg = payload.errors[0].msg;
    }
    throw new Error(msg || 'Request failed');
  }

  return payload;
}

export async function refreshAccessToken() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) return false;
    const payload = await response.json();
    setAccessToken(payload.token);
    return true;
  } catch {
    return false;
  }
}

export function getRequest(path) {
  return request(path, { method: 'GET' });
}

export function postRequest(path, data) {
  return request(path, { method: 'POST', body: JSON.stringify(data || {}) });
}

export function putRequest(path, data) {
  return request(path, { method: 'PUT', body: JSON.stringify(data || {}) });
}

export function patchRequest(path, data) {
  return request(path, { method: 'PATCH', body: JSON.stringify(data || {}) });
}

export function deleteRequest(path) {
  return request(path, { method: 'DELETE' });
}
