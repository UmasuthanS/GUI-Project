import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import ProductDetails from '../views/ProductDetails.vue';
import Cart from '../views/Cart.vue';
import Search from '../views/Search.vue';
import Login from '../views/Login.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/product/:id',
      name: 'product-details',
      component: ProductDetails,
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart,
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
