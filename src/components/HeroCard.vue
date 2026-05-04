<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '../services/api';
import { useCartStore } from '../stores/cart';
import { ShoppingCart } from 'lucide-vue-next';

const props = defineProps<{
  products: Product[];
}>();

const cartStore = useCartStore();

// Get one product from each unique category, up to 4 products
const featuredProducts = computed(() => {
  const uniqueCategories = new Set<string>();
  const featured: Product[] = [];
  
  for (const product of props.products) {
    if (!uniqueCategories.has(product.category)) {
      uniqueCategories.add(product.category);
      featured.push(product);
    }
    if (featured.length >= 4) break;
  }
  
  return featured;
});

const addToCart = (product: Product) => {
  cartStore.addToCart(product);
};
</script>

<template>
  <div class="relative w-full bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-10 shadow-lg flex flex-col lg:flex-row">
    <!-- Green Gradient Left Corner / Background -->
    <div class="absolute top-0 left-0 w-full lg:w-1/2 h-full bg-gradient-to-br from-emerald-500/20 via-emerald-400/5 to-transparent pointer-events-none"></div>
    <div class="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/30 rounded-full blur-3xl pointer-events-none"></div>
    
    <!-- Left Content -->
    <div class="relative p-8 lg:p-12 lg:w-1/3 flex flex-col justify-center">
      <h2 class="text-3xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 leading-tight">
        Latest <span class="text-emerald-600 dark:text-emerald-400">Collections</span>
      </h2>
      <p class="text-zinc-600 dark:text-zinc-300 mb-8 text-lg">
        Discover our handpicked selection of top products across different categories. Grab them before they're gone!
      </p>
    </div>

    <!-- Right Content (Featured Products Carousel) -->
    <div class="relative py-6 lg:py-8 lg:w-2/3 flex overflow-hidden items-center mask-edges w-full">
      <div class="carousel-track flex gap-6 w-max">
        <!-- Render 2 identical sets for seamless loop -->
        <div v-for="setIndex in 2" :key="'set-' + setIndex" class="flex gap-6 shrink-0" :aria-hidden="setIndex === 2">
          <div v-for="product in featuredProducts" :key="product.id" class="min-w-[260px] w-[260px] bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shrink-0 flex flex-col group">
            <router-link :to="{ name: 'product-details', params: { id: product.id } }" class="aspect-square rounded-xl overflow-hidden mb-4 bg-zinc-50 dark:bg-zinc-900 relative">
              <img :src="product.thumbnail" :alt="product.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </router-link>
            
            <div class="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">
              {{ product.category.replace('-', ' ') }}
            </div>
            
            <router-link :to="{ name: 'product-details', params: { id: product.id } }">
              <h3 class="font-bold text-zinc-900 dark:text-white line-clamp-1 mb-3 hover:text-emerald-500 transition-colors">{{ product.title }}</h3>
            </router-link>
            
            <div class="mt-auto flex items-center justify-between">
              <span class="font-bold text-xl text-zinc-900 dark:text-white">${{ product.price }}</span>
              <button @click="addToCart(product)" class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95">
                <ShoppingCart class="w-4 h-4" />
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../assets/main.css";

.mask-edges {
  mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
}

.carousel-track {
  animation: scroll 20s linear infinite;
}

.carousel-track:hover {
  animation-play-state: paused;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-50% - 12px));
  }
}
</style>
