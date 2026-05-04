<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getProductById } from '../services/api';
import type { Product } from '../services/api';
import { useCartStore } from '../stores/cart';
import { Star, ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-vue-next';

const route = useRoute();
const cartStore = useCartStore();

const product = ref<Product | null>(null);
const isLoading = ref(true);
const quantity = ref(1);
const activeImageIndex = ref(0);

const fetchProduct = async () => {
  isLoading.value = true;
  try {
    const id = route.params.id as string;
    product.value = await getProductById(id);
  } catch (error) {
    console.error('Failed to fetch product details:', error);
  } finally {
    isLoading.value = false;
  }
};

const activeImage = computed(() => {
  if (!product.value) return '';
  return product.value.images[activeImageIndex.value] || product.value.thumbnail;
});

const incrementQuantity = () => {
  if (product.value && quantity.value < product.value.stock) {
    quantity.value++;
  }
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const addToCart = () => {
  if (product.value) {
    cartStore.addToCart(product.value, quantity.value);
  }
};

onMounted(() => {
  fetchProduct();
});
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <button @click="$router.back()" class="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors mb-8 group w-max">
      <ArrowLeft class="w-5 h-5 transition-transform group-hover:-translate-x-1" />
      <span>Back</span>
    </button>

    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
      <div class="aspect-square bg-zinc-200 dark:bg-zinc-800 rounded-3xl"></div>
      <div class="space-y-6 pt-8">
        <div class="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
        <div class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
        <div class="h-32 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
      </div>
    </div>

    <div v-else-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-12">
      <!-- Image Gallery -->
      <div class="flex flex-col gap-4">
        <div class="aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex items-center justify-center p-8">
          <img :src="activeImage" :alt="product.title" class="w-full h-full object-contain drop-shadow-xl" />
        </div>
        
        <div v-if="product.images.length > 1" class="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          <button
            v-for="(image, index) in product.images"
            :key="index"
            @click="activeImageIndex = index"
            class="w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-colors"
            :class="activeImageIndex === index ? 'border-emerald-500' : 'border-transparent hover:border-zinc-300 dark:hover:border-zinc-700'"
          >
            <img :src="image" :alt="`${product.title} ${index + 1}`" class="w-full h-full object-cover bg-zinc-100 dark:bg-zinc-900" />
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div class="flex flex-col pt-4">
        <div class="text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider mb-2">
          {{ product.brand }} • {{ product.category }}
        </div>
        
        <h1 class="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
          {{ product.title }}
        </h1>
        
        <div class="flex items-center gap-4 mb-6">
          <div class="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-sm font-medium">
            <Star class="w-4 h-4 fill-amber-500 text-amber-500" />
            {{ product.rating.toFixed(1) }}
          </div>
          <div class="text-zinc-500 dark:text-zinc-400 text-sm">
            <span v-if="product.stock > 0" class="text-emerald-600 dark:text-emerald-400 font-medium">{{ product.stock }} in stock</span>
            <span v-else class="text-red-500 font-medium">Out of stock</span>
          </div>
        </div>

        <div class="flex items-end gap-4 mb-8">
          <span class="text-4xl font-bold text-zinc-900 dark:text-white">
            ${{ product.price }}
          </span>
          <span v-if="product.discountPercentage > 0" class="text-lg text-zinc-400 line-through mb-1">
            ${{ (product.price / (1 - product.discountPercentage / 100)).toFixed(2) }}
          </span>
          <span v-if="product.discountPercentage > 0" class="text-sm font-bold text-red-500 bg-red-100 dark:bg-red-500/10 px-2 py-1 rounded-md mb-1.5">
            -{{ Math.round(product.discountPercentage) }}%
          </span>
        </div>

        <p class="text-zinc-600 dark:text-zinc-300 text-lg leading-relaxed mb-10">
          {{ product.description }}
        </p>

        <div class="mt-auto">
          <div class="flex items-center gap-6 mb-6">
            <div class="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
              <button @click="decrementQuantity" :disabled="quantity <= 1" class="p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 text-zinc-600 dark:text-zinc-300 transition-colors">
                <Minus class="w-5 h-5" />
              </button>
              <span class="w-12 text-center text-lg font-medium text-zinc-900 dark:text-zinc-100">
                {{ quantity }}
              </span>
              <button @click="incrementQuantity" :disabled="quantity >= product.stock" class="p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 text-zinc-600 dark:text-zinc-300 transition-colors">
                <Plus class="w-5 h-5" />
              </button>
            </div>
            
            <button
              @click="addToCart"
              :disabled="product.stock === 0"
              class="flex-1 flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 shadow-lg shadow-emerald-500/30"
            >
              <ShoppingCart class="w-6 h-6" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-20">
      <h2 class="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Product not found</h2>
      <p class="text-zinc-500">The product you're looking for doesn't exist or has been removed.</p>
    </div>
  </main>
</template>

<style scoped>
@reference "../assets/main.css";

.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-zinc-300 dark:bg-zinc-700;
  border-radius: 6px;
}
</style>
