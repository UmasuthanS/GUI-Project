<script setup lang="ts">
import { useCartStore } from '../stores/cart';
import type { Product } from '../services/api';
import { Star, ShoppingCart } from 'lucide-vue-next';

const props = defineProps<{
  product: Product;
}>();

const cartStore = useCartStore();

const addToCart = () => {
  cartStore.addToCart(props.product);
};
</script>

<template>
  <div class="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-1">
    <router-link :to="{ name: 'product-details', params: { id: product.id } }" class="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
      <img
        :src="product.thumbnail"
        :alt="product.title"
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <!-- Discount Badge -->
      <div v-if="product.discountPercentage > 10" class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
        -{{ Math.round(product.discountPercentage) }}%
      </div>
    </router-link>

    <div class="flex flex-col flex-1 p-5">
      <div class="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-2 uppercase tracking-wider">
        {{ product.category }}
      </div>
      
      <router-link :to="{ name: 'product-details', params: { id: product.id } }" class="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
        <h3 class="font-semibold text-lg text-zinc-900 dark:text-white line-clamp-1 mb-1" :title="product.title">
          {{ product.title }}
        </h3>
      </router-link>
      
      <p class="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 flex-1">
        {{ product.description }}
      </p>

      <div class="flex items-center gap-1 mb-4">
        <Star class="w-4 h-4 fill-amber-400 text-amber-400" />
        <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{ product.rating.toFixed(1) }}</span>
      </div>

      <div class="flex items-center justify-between mt-auto">
        <div class="flex flex-col">
          <span class="text-xl font-bold text-zinc-900 dark:text-white">${{ product.price }}</span>
        </div>
        <button
          @click="addToCart"
          class="flex items-center justify-center p-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors group/btn"
          title="Add to cart"
        >
          <ShoppingCart class="w-5 h-5 transition-transform group-hover/btn:scale-110" />
        </button>
      </div>
    </div>
  </div>
</template>
