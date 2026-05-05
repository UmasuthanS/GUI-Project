import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

interface User {
  email: string;
  name: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);

  // Initialize from localStorage
  const storedUser = localStorage.getItem('authUser');
  if (storedUser) {
    user.value = JSON.parse(storedUser);
    isAuthenticated.value = true;
  }

  // Watch for changes and sync to localStorage
  watch(user, (newUser) => {
    if (newUser) {
      localStorage.setItem('authUser', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('authUser');
    }
  }, { deep: true });

  const login = async (email: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock user creation
    user.value = {
      email,
      name: email.split('@')[0] || 'User',
    };
    isAuthenticated.value = true;
  };

  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
  };

  return {
    user,
    isAuthenticated,
    login,
    logout
  };
});
