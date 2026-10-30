/**
 * Authentication Service
 * Prepared for FastAPI integration (e.g. POST /api/auth/login, POST /api/auth/register)
 * Google OAuth: redirect to /api/auth/google
 */

const STORAGE_KEY_USER = 'faultlens_auth_user';
const STORAGE_KEY_TOKEN = 'faultlens_auth_token';

export const authService = {
  async login(email, password) {
    // --- Production: replace with real API call ---
    // const res = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // });
    // if (!res.ok) throw new Error((await res.json()).detail || 'Login failed');
    // const { user, token } = await res.json();

    await new Promise((res) => setTimeout(res, 400));

    if (!email || !email.trim()) throw new Error('Email address is required.');
    if (!/\S+@\S+\.\S+/.test(email)) throw new Error('Please enter a valid email address.');
    if (!password) throw new Error('Password is required.');
    if (password.length < 6) throw new Error('Password must be at least 6 characters.');

    const user = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role: 'Site Reliability Engineer',
      avatar: email.slice(0, 2).toUpperCase(),
      team: 'Core Infrastructure',
      joined: new Date().toISOString().split('T')[0],
    };

    const token = `fl_token_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
    return { user, token };
  },

  async register(name, email, password) {
    // --- Production: replace with real API call ---
    // const res = await fetch('/api/auth/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, email, password }),
    // });
    // if (!res.ok) throw new Error((await res.json()).detail || 'Registration failed');
    // const { user, token } = await res.json();

    await new Promise((res) => setTimeout(res, 500));

    if (!name || !name.trim()) throw new Error('Full name is required.');
    if (name.trim().length < 2) throw new Error('Name must be at least 2 characters.');
    if (!email || !email.trim()) throw new Error('Email address is required.');
    if (!/\S+@\S+\.\S+/.test(email)) throw new Error('Please enter a valid email address.');
    if (!password) throw new Error('Password is required.');
    if (password.length < 6) throw new Error('Password must be at least 6 characters.');

    const user = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email,
      role: 'DevOps / Chaos Engineer',
      avatar: name.trim().split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'FL',
      team: 'Resilience Engineering',
      joined: new Date().toISOString().split('T')[0],
    };

    const token = `fl_token_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
    return { user, token };
  },

  getCurrentUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // corrupt storage — clear it
      localStorage.removeItem(STORAGE_KEY_USER);
    }
    return null;
  },

  isAuthenticated() {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    // No auto-init — user must explicitly log in
    return !!token;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  },
};
