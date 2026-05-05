<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { Search, ShoppingCart, ShoppingBag, Moon, Sun, Menu, X, User, LogOut } from 'lucide-vue-next';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();
const searchQuery = ref('');
const isMobileMenuOpen = ref(false);
const isProfileDropdownOpen = ref(false);

const cartItemCount = computed(() => cartStore.cartItemCount);

const handleProfileClick = () => {
  if (authStore.isAuthenticated) {
    isProfileDropdownOpen.value = !isProfileDropdownOpen.value;
  } else {
    router.push('/login');
    isMobileMenuOpen.value = false;
  }
};

const handleLogout = () => {
  authStore.logout();
  isProfileDropdownOpen.value = false;
  router.push('/');
};

// close dropdown when clicking outside roughly
router.afterEach(() => {
  isProfileDropdownOpen.value = false;
});

// Dark mode setup
// Fallback if vueuse is not installed, but since it's a bonus, we will implement manually if needed.
// Wait, I didn't install vueuse. Let me implement manual dark mode toggle.
const isDark = ref(document.documentElement.classList.contains('dark'));

const toggleDark = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'search', query: { q: searchQuery.value.trim() } });
    isMobileMenuOpen.value = false;
  }
};
</script>

<template>
  <nav class="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2 group">
          <div class="p-2 bg-emerald-500 rounded-lg group-hover:bg-emerald-600 transition-colors">
            <ShoppingBag class="w-6 h-6 text-white" />
          </div>
          <span class="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">EmeraldStore</span>
        </router-link>

        <!-- Desktop Search -->
        <div class="hidden md:flex flex-1 max-w-md mx-8">
          <form @submit.prevent="handleSearch" class="relative w-full">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products..."
              class="w-full pl-10 pr-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-800 focus:ring-0 outline-none transition-all text-sm text-zinc-900 dark:text-zinc-100"
            />
            <Search class="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
          </form>
        </div>

        <!-- Desktop Actions -->
        <div class="hidden md:flex items-center gap-4">
          <button @click="toggleDark" class="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-300">
            <Sun v-if="isDark" class="w-5 h-5" />
            <Moon v-else class="w-5 h-5" />
          </button>
          
          <router-link to="/cart" class="relative p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-300">
            <ShoppingCart class="w-5 h-5" />
            <span
              v-if="cartItemCount > 0"
              class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-emerald-500 rounded-full"
            >
              {{ cartItemCount }}
            </span>
          </router-link>

          <div class="relative">
            <button @click="handleProfileClick" class="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-300">
              <User class="w-5 h-5" />
            </button>
            
            <!-- Profile Dropdown -->
            <div v-if="authStore.isAuthenticated && isProfileDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg py-2 z-50">
              <div class="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                <p class="text-sm font-medium text-zinc-900 dark:text-white">{{ authStore.user?.name }}</p>
                <p class="text-xs text-zinc-500 truncate">{{ authStore.user?.email }}</p>
              </div>
              <a href="#" class="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Profile</a>
              <button @click="handleLogout" class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2">
                <LogOut class="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="flex items-center md:hidden gap-2">
          <button @click="handleProfileClick" class="p-2 text-zinc-600 dark:text-zinc-300">
            <User class="w-5 h-5" />
          </button>
          
          <router-link to="/cart" class="relative p-2 text-zinc-600 dark:text-zinc-300">
            <ShoppingCart class="w-5 h-5" />
            <span
              v-if="cartItemCount > 0"
              class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-emerald-500 rounded-full"
            >
              {{ cartItemCount }}
            </span>
          </router-link>
          
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="p-2 text-zinc-600 dark:text-zinc-300">
            <X v-if="isMobileMenuOpen" class="w-6 h-6" />
            <Menu v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-show="isMobileMenuOpen" class="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-4 space-y-4">
      <form @submit.prevent="handleSearch" class="relative w-full">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:border-emerald-500 outline-none text-sm text-zinc-900 dark:text-zinc-100"
        />
        <Search class="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
      </form>
      
      <div class="flex items-center justify-between pt-2">
        <span class="text-sm font-medium text-zinc-600 dark:text-zinc-300">Theme</span>
        <button @click="toggleDark" class="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300">
          <Sun v-if="isDark" class="w-5 h-5" />
          <Moon v-else class="w-5 h-5" />
        </button>
      </div>

      <div v-if="authStore.isAuthenticated" class="pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400">
            <User class="w-5 h-5" />
          </div>
          <div>
            <p class="text-sm font-medium text-zinc-900 dark:text-white">{{ authStore.user?.name }}</p>
            <p class="text-xs text-zinc-500">{{ authStore.user?.email }}</p>
          </div>
        </div>
        <a href="#" class="block py-2 text-sm text-zinc-700 dark:text-zinc-300">Profile</a>
        <button @click="handleLogout" class="w-full text-left py-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
          <LogOut class="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  </nav>
</template>
