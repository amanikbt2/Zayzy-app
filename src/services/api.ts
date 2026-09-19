import Constants from 'expo-constants';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  Constants.expoConfig?.extra?.apiUrl ||
  'http://localhost:5000/api';

export const fetchApi = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 4000); // 4 second timeout for offline responsiveness

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    clearTimeout(id);
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (error: any) {
    // Graceful offline degradation - log warning without throwing uncaught app crash
    console.warn(`[Api Service] Backend endpoint unreachable (${url}):`, error?.message || error);
    return null;
  }
};
