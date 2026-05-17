export function getToken() {
  try { return localStorage.getItem('lele-token'); } catch { return null; }
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('lele-token', token);
  } else {
    localStorage.removeItem('lele-token');
  }
}

export function getStoredUser() {
  try {
    const data = localStorage.getItem('lele-user');
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

export function setStoredUser(user) {
  if (user) {
    localStorage.setItem('lele-user', JSON.stringify(user));
  } else {
    localStorage.removeItem('lele-user');
  }
}

async function apiPost(endpoint, data = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`/api${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || '请求失败');
  return json;
}

async function apiGet(endpoint) {
  const token = getToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`/api${endpoint}`, { headers });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || '请求失败');
  return json;
}

export async function register(username, password, displayName, grade) {
  const result = await apiPost('/auth/register', { username, password, displayName, grade });
  setToken(result.token);
  setStoredUser(result.user);
  return result.user;
}

export async function login(username, password) {
  const result = await apiPost('/auth/login', { username, password });
  setToken(result.token);
  setStoredUser(result.user);
  return result.user;
}

export function logout() {
  setToken(null);
  setStoredUser(null);
}

export async function verifyToken() {
  const token = getToken();
  if (!token) return null;
  try {
    const result = await apiGet('/auth/me');
    return result.user;
  } catch {
    setToken(null);
    setStoredUser(null);
    return null;
  }
}

export async function saveGameDataToServer(gameData) {
  try {
    await apiPost('/user/save', { gameData });
    return true;
  } catch { return false; }
}

export async function loadGameDataFromServer() {
  try {
    const result = await apiGet('/user/load');
    return result.gameData || null;
  } catch { return null; }
}

export async function getSubscription() {
  try {
    return await apiGet('/user/subscription');
  } catch { return { tier: 'free', valid: true }; }
}

// ===== 父母管理 =====

export async function parentRegister(username, password, displayName) {
  const result = await apiPost('/parent/register', { username, password, displayName });
  setToken(result.token);
  setStoredUser(result.user);
  return result.user;
}

export async function bindChild(inviteCode) {
  return await apiPost('/parent/bind', { inviteCode });
}

export async function getChildren() {
  return await apiGet('/parent/children');
}

export async function getChildActivity(childUsername, days = 7) {
  return await apiGet(`/parent/activity?child=${childUsername}&days=${days}`);
}

export async function getChildAnalysis(childUsername) {
  return await apiGet(`/parent/analysis?child=${childUsername}`);
}

export async function getChildMastery(childUsername) {
  return await apiGet(`/parent/mastery?child=${childUsername}`);
}
