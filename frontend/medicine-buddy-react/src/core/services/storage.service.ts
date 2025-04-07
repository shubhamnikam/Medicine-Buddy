// Encode string to base64
const getEncodedText = (str: string): string | null => (str ? btoa(str) : null);

// Decode base64 to string
const getDecodedText = (str: string): string | null => (str ? atob(str) : null);

// Retrieve data from local storage (Generic)
export const getFromLocalStorage = <T>(key: string): T | null => {
  const encodedData = localStorage.getItem(key);
  if (!encodedData) return null;

  try {
    const decodedData = getDecodedText(encodedData);
    if (!decodedData) return null;

    return JSON.parse(decodedData) as T;
  } catch (error) {
    console.error(`Error parsing data from localStorage for key: ${key}`, error);
    return null;
  }
};

// Save data to local storage (Generic)
export const setToLocalStorage = <T>(key: string, value: T): boolean => {
  if (!key || value === undefined) return false;

  try {
    const encodedData = getEncodedText(JSON.stringify(value));
    if (!encodedData) return false;

    localStorage.setItem(key, encodedData);
    return true;
  } catch (error) {
    console.error(`Error saving data to localStorage for key: ${key}`, error);
    return false;
  }
};

// Remove item from local storage
export const removeFromLocalStorage = (key: string): boolean => {
  if (!key) return false;
  localStorage.removeItem(key);
  return true;
};

// Clear all local storage
export const clearAllLocalStorage = (): boolean => {
  localStorage.clear();
  return true;
};

// Retrieve data from session storage (Generic)
export const getFromSessionStorage = <T>(key: string): T | null => {
  const encodedData = sessionStorage.getItem(key);
  if (!encodedData) return null;

  try {
    const decodedData = getDecodedText(encodedData);
    if (!decodedData) return null;

    return JSON.parse(decodedData) as T;
  } catch (error) {
    console.error(`Error parsing data from sessionStorage for key: ${key}`, error);
    return null;
  }
};

// Save data to session storage (Generic)
export const setToSessionStorage = <T>(key: string, value: T): boolean => {
  if (!key || value === undefined) return false;

  try {
    const encodedData = getEncodedText(JSON.stringify(value));
    if (!encodedData) return false;

    sessionStorage.setItem(key, encodedData);
    return true;
  } catch (error) {
    console.error(`Error saving data to sessionStorage for key: ${key}`, error);
    return false;
  }
};

// Remove item from session storage
export const removeFromSessionStorage = (key: string): boolean => {
  if (!key) return false;
  sessionStorage.removeItem(key);
  return true;
};

// Clear all session storage
export const clearAllSessionStorage = (): boolean => {
  sessionStorage.clear();
  return true;
};
