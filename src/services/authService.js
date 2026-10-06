/**
 * Authentication Service
 * Prepared for FastAPI integration (e.g. POST /api/auth/login, POST /api/auth/register)
 */

const STORAGE_KEY_USER = 'faultlens_auth_user';
const STORAGE_KEY_TOKEN = 'faultlens_auth_token';

// Default initial user for instant seamless experience
const DEFAULT_USER = {
  id: 'usr_dev_01',
  name: 'Alex Rivera',
  email: 'alex.rivera@engineering.org',
  role: 'Senior Site Reliability Engineer',
  avatar: 'AR',
  team: 'Core Infrastructure',
  joined: '2026-01-15',
};

export const authService = {
  async login(email, password) {
    // In production: return fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    await new Promise((res) => setTimeout(res, 400));

    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const user = {
      ...DEFAULT_USER,
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    };

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY_TOKEN, 'fl_jwt_mock_token_secure_sandbox');
    return { user, token: 'fl_jwt_mock_token_secure_sandbox' };
  },

  async register(name, email, password) {
    // In production: return fetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
    await new Promise((res) => setTimeout(res, 500));

    if (!name || !email || !password) {
      throw new Error('All registration fields are required.');
    }

    const user = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: 'DevOps / Chaos Engineer',
      avatar: name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'FL',
      team: 'Resilience Engineering',
      joined: new Date().toISOString().split('T')[0],
    };

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY_TOKEN, 'fl_jwt_mock_token_secure_sandbox');
    return { user, token: 'fl_jwt_mock_token_secure_sandbox' };
  },

  getCurrentUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      // fallback
    }
    // Default logged in user so user can immediately evaluate the engineering dashboard
    return DEFAULT_USER;
  },

  isAuthenticated() {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    // If not explicitly set, auto-initialize with demo session
    if (!token) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEFAULT_USER));
      localStorage.setItem(STORAGE_KEY_TOKEN, 'fl_jwt_mock_token_secure_sandbox');
      return true;
    }
    return !!token;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  }
};
