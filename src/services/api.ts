import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
});

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export const getProducts = async (limit = 0, skip = 0): Promise<ProductsResponse> => {
  const response = await api.get('/products', { params: { limit, skip } });
  return response.data;
};

export const getProductById = async (id: number | string): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const searchProducts = async (query: string): Promise<ProductsResponse> => {
  const response = await api.get('/products/search', { params: { q: query } });
  return response.data;
};

export const getCategories = async (): Promise<string[]> => {
  const response = await api.get('/products/category-list');
  return response.data;
};

export const getProductsByCategory = async (category: string): Promise<ProductsResponse> => {
  const response = await api.get(`/products/category/${category}`);
  return response.data;
};

export default api;
