export function getItem<T>(k: string, defaultValue?: T): T | undefined {
  const v = window.localStorage.getItem(k);
  if (v) {
    return JSON.parse(v) as T;
  }
  if (defaultValue !== undefined) {
    window.localStorage.setItem(k, JSON.stringify(defaultValue));
  }
  return defaultValue;
}

export function setItem<T>(k: string, value: T): void {
  window.localStorage.setItem(k, JSON.stringify(value));
}
