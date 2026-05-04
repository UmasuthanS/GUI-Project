<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { searchProducts } from '../services/api';
import type { Product } from '../services/api';
import ProductGrid from '../components/ProductGrid.vue';
import { Search as SearchIcon } from 'lucide-vue-next';

const route = useRoute();
const products = ref<Product[]>([]);
const isLoading = ref(false);
const totalResults = ref(0);

const fetchSearchResults = async (query: string) => {
  if (!query) {
    products.value = [];
    totalResults.value = 0;
    return;
  }
  
  isLoading.value = true;
  try {
    const response = await searchProducts(query);
    products.value = response.products;
    totalResults.value = response.total;
  } catch (error) {
    console.error('Search failed:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const query = route.query.q as string;
  if (query) {
    fetchSearchResults(query);
  }
});

watch(
  () => route.query.q,
  (newQuery) => {
    fetchSearchResults((newQuery as string) || '');
  }
);
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-3">
        <SearchIcon class="w-8 h-8 text-emerald-500" />
        Search Results
      </h1>
      <p class="text-zinc-500 dark:text-zinc-400">
        <span v-if="route.query.q">
          Showing {{ products.length }} results for "<span class="font-semibold text-zinc-900 dark:text-white">{{ route.query.q }}</span>"
        </span>
        <span v-else>
          Please enter a search query.
        </span>
      </p>
    </div>

    <div v-if="isLoading" class="mt-8">
      <ProductGrid :products="[]" :is-loading="true" />
    </div>
    
    <div v-else-if="products.length > 0" class="mt-8">
      <ProductGrid :products="products" :is-loading="false" />
    </div>
    
    <div v-else-if="route.query.q" class="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
      <div class="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
        <SearchIcon class="w-10 h-10 text-zinc-400 dark:text-zinc-500" />
      </div>
      <h2 class="text-2xl font-bold text-zinc-900 dark:text-white mb-2">No results found</h2>
      <p class="text-zinc-500 dark:text-zinc-400 mb-6">
        We couldn't find any products matching "{{ route.query.q }}".
      </p>
      <button @click="$router.push('/')" class="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
        Browse all products
      </button>
    </div>
  </main>
</template>
