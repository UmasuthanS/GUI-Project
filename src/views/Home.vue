<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ProductGrid from '../components/ProductGrid.vue';
import { getProducts, getCategories, getProductsByCategory } from '../services/api';
import type { Product } from '../services/api';

const products = ref<Product[]>([]);
const categories = ref<string[]>([]);
const activeCategory = ref('all');
const isLoading = ref(true);
const isLoadingCategories = ref(true);

const fetchCategories = async () => {
  try {
    categories.value = await getCategories();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  } finally {
    isLoadingCategories.value = false;
  }
};

const fetchProducts = async (category = 'all') => {
  isLoading.value = true;
  try {
    if (category === 'all') {
      const response = await getProducts(20, 0);
      products.value = response.products;
    } else {
      const response = await getProductsByCategory(category);
      products.value = response.products;
    }
  } catch (error) {
    console.error('Failed to fetch products:', error);
  } finally {
    isLoading.value = false;
  }
};

const setCategory = (category: string) => {
  if (activeCategory.value !== category) {
    activeCategory.value = category;
    fetchProducts(category);
  }
};

onMounted(() => {
  fetchCategories();
  fetchProducts();
});
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Sidebar Filters -->
      <aside class="w-full lg:w-64 shrink-0">
        <div class="sticky top-24 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <h2 class="font-bold text-lg text-zinc-900 dark:text-white mb-4">Categories</h2>
          
          <div v-if="isLoadingCategories" class="space-y-2">
            <div v-for="i in 6" :key="i" class="h-8 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
          </div>
          
          <div v-else class="flex flex-col gap-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            <button
              @click="setCategory('all')"
              class="text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="activeCategory === 'all' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'"
            >
              All Products
            </button>
            <button
              v-for="category in categories"
              :key="category"
              @click="setCategory(category)"
              class="text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize"
              :class="activeCategory === category ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'"
            >
              {{ category.replace('-', ' ') }}
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 min-w-0">
        <header class="mb-8">
          <h1 class="text-3xl font-bold text-zinc-900 dark:text-white capitalize">
            {{ activeCategory === 'all' ? 'All Products' : activeCategory.replace('-', ' ') }}
          </h1>
          <p class="text-zinc-500 dark:text-zinc-400 mt-2">
            Showing {{ products.length }} results
          </p>
        </header>

        <ProductGrid :products="products" :is-loading="isLoading" />
      </div>
    </div>
  </main>
</template>

<style scoped>
@reference "../assets/main.css";

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-zinc-300 dark:bg-zinc-700;
  border-radius: 4px;
}
</style>
