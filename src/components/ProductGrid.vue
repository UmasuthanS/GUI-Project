<script setup lang="ts">
import ProductCard from './ProductCard.vue';
import SkeletonLoader from './SkeletonLoader.vue';
import type { Product } from '../services/api';

defineProps<{
  products: Product[];
  isLoading: boolean;
}>();
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <template v-if="isLoading">
      <SkeletonLoader v-for="i in 8" :key="i" />
    </template>
    <template v-else-if="products.length > 0">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </template>
    <div v-else class="col-span-full py-12 text-center text-zinc-500 dark:text-zinc-400">
      <p class="text-lg">No products found.</p>
    </div>
  </div>
</template>
