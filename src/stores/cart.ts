import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { Product } from '../services/api';

export interface CartItem extends Product {
  quantity: number;
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);

  // Load from localStorage on initialization
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    try {
      items.value = JSON.parse(savedCart);
    } catch (e) {
      console.error('Failed to load cart from local storage', e);
    }
  }

  // Persist to localStorage whenever items change
  watch(
    items,
    (newItems) => {
      localStorage.setItem('cart', JSON.stringify(newItems));
    },
    { deep: true }
  );

  const cartTotal = computed(() => {
    return items.value.reduce((total, item) => total + item.price * item.quantity, 0);
  });

  const cartItemCount = computed(() => {
    return items.value.reduce((count, item) => count + item.quantity, 0);
  });

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = items.value.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.value.push({ ...product, quantity });
    }
  };

  const removeFromCart = (productId: number) => {
    items.value = items.value.filter((item) => item.id !== productId);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const item = items.value.find((item) => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        item.quantity = quantity;
      }
    }
  };

  const clearCart = () => {
    items.value = [];
  };

  return {
    items,
    cartTotal,
    cartItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
});
