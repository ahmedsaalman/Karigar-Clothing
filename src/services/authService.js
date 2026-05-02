import {
  getRequest,
  postRequest,
  setAccessToken,
  refreshAccessToken,
  registerUnauthorizedHandler,
} from './apiClient';

async function register(name, email, password) {
  const data = await postRequest('/auth/register', { name, email, password });
  setAccessToken(data.token);
  return data.user;
}

async function login(email, password) {
  const data = await postRequest('/auth/login', { email, password });
  setAccessToken(data.token);
  return data.user;
}

async function getMe() {
  const refreshed = await refreshAccessToken();
  if (!refreshed) return null;
  const data = await getRequest('/auth/me');
  return data.user;
}

async function logout() {
  try {
    await postRequest('/auth/logout', {});
  } finally {
    setAccessToken(null);
  }
}

function onUnauthorized(handler) {
  registerUnauthorizedHandler(handler);
}

export { register, login, getMe, logout, onUnauthorized };
