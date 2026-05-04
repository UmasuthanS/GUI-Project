<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import HeroCard from '../components/HeroCard.vue';
import CategorySection from '../components/CategorySection.vue';
import CategorySidebar from '../components/CategorySidebar.vue';
import { getProducts } from '../services/api';
import type { Product } from '../services/api';

const products = ref<Product[]>([]);
const groupedProducts = ref<Record<string, Product[]>>({});
const categories = ref<string[]>([]);
const activeCategory = ref('top');
const isLoading = ref(true);

let observer: IntersectionObserver | null = null;

const fetchAllProducts = async () => {
  isLoading.value = true;
  try {
    // Fetch a large batch of products (limit=0 means all in dummyjson usually, but setting a high limit works too)
    const response = await getProducts(0, 0);
    products.value = response.products;
    
    // Group products by category
    const grouped: Record<string, Product[]> = {};
    const catSet = new Set<string>();
    
    response.products.forEach(product => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category]!.push(product);
      catSet.add(product.category);
    });
    
    groupedProducts.value = grouped;
    categories.value = Array.from(catSet);
    
    // Wait for DOM updates then setup scroll spy
    setTimeout(setupScrollSpy, 100);
  } catch (error) {
    console.error('Failed to fetch products:', error);
  } finally {
    isLoading.value = false;
  }
};

const scrollToCategory = (category: string) => {
  activeCategory.value = category;
  
  if (category === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  
  const element = document.getElementById(`category-${category}`);
  if (element) {
    // Offset for sticky header
    const y = element.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};

const setupScrollSpy = () => {
  const options = {
    root: null,
    rootMargin: '-120px 0px -40% 0px',
    threshold: 0.1
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.id === 'hero-top') {
          activeCategory.value = 'top';
        } else {
          // Extract category name from id (e.g., category-smartphones)
          activeCategory.value = entry.target.id.replace('category-', '');
        }
      }
    });
  }, options);

  // Observe hero
  const heroEl = document.getElementById('hero-top');
  if (heroEl) observer.observe(heroEl);

  // Observe category sections
  categories.value.forEach(category => {
    const el = document.getElementById(`category-${category}`);
    if (el) observer!.observe(el);
  });
};

onMounted(() => {
  fetchAllProducts();
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div id="hero-top">
      <HeroCard v-if="products.length > 0" :products="products" />
    </div>
    
    <div class="flex flex-col lg:flex-row gap-8 relative">
      <!-- Sticky Sidebar Navigation -->
      <CategorySidebar 
        :categories="categories" 
        :active-category="activeCategory" 
        @scroll-to="scrollToCategory" 
      />

      <!-- Main Content (Stacked Categories) -->
      <div class="flex-1 min-w-0">
        <div v-if="isLoading" class="space-y-12">
          <!-- Loading skeletons for sections -->
          <div v-for="i in 3" :key="i" class="rounded-3xl p-6 lg:p-10 border border-zinc-200 dark:border-zinc-800 animate-pulse">
            <div class="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4 mb-8"></div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="j in 3" :key="j" class="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
            </div>
          </div>
        </div>
        
        <div v-else>
          <CategorySection
            v-for="(cat, index) in categories"
            :key="cat"
            :category="cat"
            :products="groupedProducts[cat] || []"
            :index="index"
          />
        </div>
      </div>
    </div>
  </main>
</template>
