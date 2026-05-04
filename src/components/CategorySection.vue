<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '../services/api';
import ProductGrid from './ProductGrid.vue';

const props = defineProps<{
  category: string;
  products: Product[];
  index: number;
}>();

// Generate distinct greenish gradient classes based on index
const backgroundClass = computed(() => {
  const gradients = [
    'from-emerald-500/10 to-teal-500/5 dark:from-emerald-900/20 dark:to-teal-900/10',
    'from-green-500/10 to-emerald-500/5 dark:from-green-900/20 dark:to-emerald-900/10',
    'from-teal-500/10 to-cyan-500/5 dark:from-teal-900/20 dark:to-cyan-900/10',
    'from-lime-500/10 to-green-500/5 dark:from-lime-900/20 dark:to-green-900/10'
  ];
  return gradients[props.index % gradients.length];
});

const formattedTitle = computed(() => {
  return props.category.replace(/-/g, ' ');
});
</script>

<template>
  <section 
    :id="'category-' + category" 
    class="relative rounded-3xl p-6 lg:p-10 mb-12 border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden"
  >
    <!-- Background Gradient -->
    <div 
      class="absolute inset-0 bg-gradient-to-br opacity-50 dark:opacity-40 pointer-events-none" 
      :class="backgroundClass"
    ></div>
    
    <div class="relative z-10">
      <div class="flex items-center gap-4 mb-8">
        <h2 class="text-3xl font-extrabold text-zinc-900 dark:text-white capitalize tracking-tight">
          {{ formattedTitle }}
        </h2>
        <div class="h-px bg-zinc-200 dark:bg-zinc-800 flex-1 ml-4"></div>
      </div>
      
      <ProductGrid :products="products" :is-loading="false" />
    </div>
  </section>
</template>
