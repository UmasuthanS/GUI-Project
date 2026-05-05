<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { Mail, Lock, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);

const errors = ref({
  email: '',
  password: ''
});

const isLoading = ref(false);

const validate = () => {
  let isValid = true;
  errors.value = { email: '', password: '' };

  if (!email.value) {
    errors.value.email = 'Email is required';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Please enter a valid email address';
    isValid = false;
  }

  if (!password.value) {
    errors.value.password = 'Password is required';
    isValid = false;
  }

  return isValid;
};

const handleLogin = async () => {
  if (!validate()) return;

  isLoading.value = true;
  try {
    await authStore.login(email.value);
    router.push('/');
  } catch (error) {
    console.error('Login failed', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <main class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-zinc-900 dark:to-emerald-950 relative overflow-hidden">
    <!-- Decorative background blobs -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-green-400/20 dark:bg-green-600/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-emerald-500/5 dark:shadow-emerald-900/10 border border-zinc-100 dark:border-zinc-800 p-8 sm:p-10 relative z-10">
      
      <!-- Logo & Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-6">
          <ShoppingBag class="w-8 h-8" />
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Welcome back</h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Enter your details to access your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Email Input -->
        <div>
          <label for="email" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email address</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
              <Mail class="w-5 h-5" />
            </div>
            <input 
              id="email" 
              v-model="email" 
              type="email" 
              placeholder="you@example.com"
              class="block w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
              :class="errors.email ? 'border-red-300 dark:border-red-500/50 focus:border-red-500' : 'border-zinc-200 dark:border-zinc-700 focus:border-emerald-500 dark:focus:border-emerald-500'"
              @input="errors.email = ''"
            />
          </div>
          <p v-if="errors.email" class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle class="w-3.5 h-3.5" /> {{ errors.email }}
          </p>
        </div>

        <!-- Password Input -->
        <div>
          <label for="password" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Password</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
              <Lock class="w-5 h-5" />
            </div>
            <input 
              id="password" 
              v-model="password" 
              type="password" 
              placeholder="••••••••"
              class="block w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
              :class="errors.password ? 'border-red-300 dark:border-red-500/50 focus:border-red-500' : 'border-zinc-200 dark:border-zinc-700 focus:border-emerald-500 dark:focus:border-emerald-500'"
              @input="errors.password = ''"
            />
          </div>
          <p v-if="errors.password" class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle class="w-3.5 h-3.5" /> {{ errors.password }}
          </p>
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-between mt-6">
          <label class="flex items-center gap-2 cursor-pointer group">
            <div class="relative flex items-center justify-center w-5 h-5 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 group-hover:border-emerald-500 transition-colors"
                 :class="{ 'bg-emerald-500 border-emerald-500 dark:bg-emerald-500 dark:border-emerald-500': rememberMe }">
              <CheckCircle2 v-if="rememberMe" class="w-3.5 h-3.5 text-white" />
              <input type="checkbox" v-model="rememberMe" class="sr-only" />
            </div>
            <span class="text-sm text-zinc-600 dark:text-zinc-400 select-none group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">Remember me</span>
          </label>
          
          <a href="#" class="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors">
            Forgot password?
          </a>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full mt-8 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isLoading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>

      <!-- Footer / Create account -->
      <p class="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Don't have an account? 
        <a href="#" class="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors">Create one</a>
      </p>
    </div>
  </main>
</template>
