import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export const productsService = {
  async getProducts(): Promise<Product[]> {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  },

  async getProduct(id: number): Promise<Product> {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  },
}; 