const RESULT_PREFIX = 'examResult_';
const EXPIRE_DAYS = 30;

export function saveResult(examCode, resultData) {
  const key = `${RESULT_PREFIX}${examCode}_${Date.now()}`;
  const expiresAt = Date.now() + EXPIRE_DAYS * 24 * 60 * 60 * 1000;
  const data = { ...resultData, expiresAt };
  localStorage.setItem(key, JSON.stringify(data));
  return key;
}

export function getAllSavedResults() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(RESULT_PREFIX)) keys.push(k);
  }
  const results = [];
  for (const key of keys) {
    try {
      const item = JSON.parse(localStorage.getItem(key));
      if (item && item.expiresAt > Date.now()) {
        results.push({ ...item, _key: key });
      } else if (item && item.expiresAt <= Date.now()) {
        localStorage.removeItem(key);
      }
    } catch (e) {}
  }
  return results.sort((a, b) => (b.attemptedAt || 0) - (a.attemptedAt || 0));
}

export function deleteSavedResult(key) {
  localStorage.removeItem(key);
}

export function clearAllSavedResults() {
  const toRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(RESULT_PREFIX)) toRemove.push(key);
  }
  toRemove.forEach(k => localStorage.removeItem(k));
}
