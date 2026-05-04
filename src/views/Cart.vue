<script setup lang="ts">
import { computed } from 'vue';
import { useCartStore } from '../stores/cart';
import CartItem from '../components/CartItem.vue';
import { ShoppingBag, ArrowRight } from 'lucide-vue-next';

const cartStore = useCartStore();

const cartItems = computed(() => cartStore.items);
const cartTotal = computed(() => cartStore.cartTotal);
const cartCount = computed(() => cartStore.cartItemCount);

const subtotal = computed(() => cartTotal.value);
const tax = computed(() => subtotal.value * 0.1); // 10% tax for demo
const total = computed(() => subtotal.value + tax.value);
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-zinc-900 dark:text-white mb-8">Shopping Cart</h1>

    <div v-if="cartItems.length > 0" class="flex flex-col lg:flex-row gap-12">
      <!-- Cart Items -->
      <div class="flex-1">
        <div class="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800">
          <div class="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 mb-4">
            <h2 class="font-semibold text-lg text-zinc-900 dark:text-white">Items ({{ cartCount }})</h2>
            <button @click="cartStore.clearCart()" class="text-sm text-red-500 hover:text-red-600 font-medium transition-colors">
              Clear All
            </button>
          </div>
          
          <div class="flex flex-col">
            <CartItem
              v-for="item in cartItems"
              :key="item.id"
              :item="item"
            />
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="w-full lg:w-96 shrink-0">
        <div class="sticky top-24 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800">
          <h2 class="font-bold text-xl text-zinc-900 dark:text-white mb-6">Order Summary</h2>
          
          <div class="space-y-4 mb-6 text-zinc-600 dark:text-zinc-300">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span class="font-medium text-zinc-900 dark:text-white">${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Estimated Tax (10%)</span>
              <span class="font-medium text-zinc-900 dark:text-white">${{ tax.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Shipping</span>
              <span class="text-emerald-600 dark:text-emerald-400 font-medium">Free</span>
            </div>
          </div>
          
          <div class="pt-4 border-t border-zinc-200 dark:border-zinc-800 mb-8">
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-zinc-900 dark:text-white">Total</span>
              <span class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${{ total.toFixed(2) }}</span>
            </div>
          </div>
          
          <button class="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-transform transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/30">
            <span>Checkout</span>
            <ArrowRight class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-20">
      <div class="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
        <ShoppingBag class="w-12 h-12 text-zinc-400 dark:text-zinc-500" />
      </div>
      <h2 class="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Your cart is empty</h2>
      <p class="text-zinc-500 dark:text-zinc-400 mb-8 text-center max-w-md">
        Looks like you haven't added anything to your cart yet. Browse our products and find something you like!
      </p>
      <router-link to="/" class="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/30">
        Start Shopping
      </router-link>
    </div>
  </main>
</template>
