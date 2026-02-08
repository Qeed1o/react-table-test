import { TOKEN_KEYS } from '../constants';

export const tokenStorage = {
  saveTokens: (accessToken: string, refreshToken: string, rememberMe: boolean) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEYS.ACCESS, accessToken);
    storage.setItem(TOKEN_KEYS.REFRESH, refreshToken);
  },

  getTokens: () => {
    const token = localStorage.getItem(TOKEN_KEYS.ACCESS) || sessionStorage.getItem(TOKEN_KEYS.ACCESS);
    const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH) || sessionStorage.getItem(TOKEN_KEYS.REFRESH);
    return { token, refreshToken };
  },

  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEYS.ACCESS);
    localStorage.removeItem(TOKEN_KEYS.REFRESH);
    sessionStorage.removeItem(TOKEN_KEYS.ACCESS);
    sessionStorage.removeItem(TOKEN_KEYS.REFRESH);
  },

  hasTokens: () => {
    const { token, refreshToken } = tokenStorage.getTokens();
    return !!(token && refreshToken);
  },

  isRemembered: () => {
    return localStorage.getItem(TOKEN_KEYS.ACCESS) !== null;
  },
};
