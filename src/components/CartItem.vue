<script setup lang="ts">
import { useCartStore } from '../stores/cart';
import type { CartItem } from '../stores/cart';
import { Trash2, Plus, Minus } from 'lucide-vue-next';

const props = defineProps<{
  item: CartItem;
}>();

const cartStore = useCartStore();

const increaseQty = () => {
  cartStore.updateQuantity(props.item.id, props.item.quantity + 1);
};

const decreaseQty = () => {
  cartStore.updateQuantity(props.item.id, props.item.quantity - 1);
};

const removeItem = () => {
  cartStore.removeFromCart(props.item.id);
};
</script>

<template>
  <div class="flex items-center gap-4 py-4 border-b border-zinc-200 dark:border-zinc-800">
    <div class="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
      <img :src="item.thumbnail" :alt="item.title" class="w-full h-full object-cover" />
    </div>
    
    <div class="flex flex-col flex-1 min-w-0">
      <div class="flex justify-between items-start gap-2">
        <h4 class="font-semibold text-zinc-900 dark:text-white line-clamp-2">
          {{ item.title }}
        </h4>
        <p class="font-bold text-zinc-900 dark:text-white shrink-0">
          ${{ (item.price * item.quantity).toFixed(2) }}
        </p>
      </div>
      
      <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
        ${{ item.price }} each
      </p>
      
      <div class="flex items-center justify-between mt-auto pt-2">
        <div class="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
          <button @click="decreaseQty" class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors">
            <Minus class="w-4 h-4" />
          </button>
          <span class="w-10 text-center text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {{ item.quantity }}
          </span>
          <button @click="increaseQty" class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors">
            <Plus class="w-4 h-4" />
          </button>
        </div>
        
        <button @click="removeItem" class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Remove item">
          <Trash2 class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>
