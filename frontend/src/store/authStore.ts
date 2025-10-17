import { create } from 'zustand';
import api from '@/lib/api';

interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  bio?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  updateUser: (data: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await api.post('/api/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    localStorage.setItem('access_token', response.data.access_token);
    
    // Fetch user data
    const userResponse = await api.get('/api/users/me');
    set({ user: userResponse.data, isAuthenticated: true, isLoading: false });
  },

  register: async (data: any) => {
    await api.post('/api/auth/register', data);
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({ user: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        set({ isLoading: false });
        return;
      }

      const response = await api.get('/api/users/me');
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateUser: async (data: any) => {
    const response = await api.put('/api/users/me', data);
    set({ user: response.data });
  },
}));

