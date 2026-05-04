<script setup lang="ts">
const props = defineProps<{
  categories: string[];
  activeCategory: string;
}>();

const emit = defineEmits<{
  (e: 'scrollTo', category: string): void;
}>();
</script>

<template>
  <aside class="w-full lg:w-64 shrink-0">
    <div class="sticky top-24 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <h2 class="font-bold text-lg text-zinc-900 dark:text-white mb-4">Categories</h2>
      
      <div v-if="categories.length === 0" class="space-y-2">
        <div v-for="i in 6" :key="i" class="h-8 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
      </div>
      
      <div v-else class="flex lg:flex-col gap-2 max-h-96 overflow-y-auto lg:overflow-y-auto overflow-x-auto lg:overflow-x-visible pr-2 custom-scrollbar">
        <!-- Optional Top link -->
        <button
          @click="emit('scrollTo', 'top')"
          class="text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors shrink-0"
          :class="activeCategory === 'top' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'"
        >
          Latest Collections
        </button>
        <button
          v-for="category in categories"
          :key="category"
          @click="emit('scrollTo', category)"
          class="text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize shrink-0"
          :class="activeCategory === category ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'"
        >
          {{ category.replace('-', ' ') }}
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
@reference "../assets/main.css";

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d4d4d8;
  border-radius: 4px;
}
:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #3f3f46;
}
</style>
