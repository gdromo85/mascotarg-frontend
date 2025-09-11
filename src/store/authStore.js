import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toasts } from '../utils/toasts';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: (userData) => {
        const { token, user } = userData;
        set({ 
          user: { token, user },
          isAuthenticated: true
        });
      },
      
      logout: () => {
        set({ 
          user: null,
          isAuthenticated: false
        });
        
        toasts.auth.logoutSuccess();
      },
      
      updateUser: (userData) => {
        set({ 
          user: { ...get().user, ...userData }
        });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);