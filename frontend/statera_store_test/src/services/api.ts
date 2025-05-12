import { Product, CartItem, Order, ShippingAddress, PaymentMethod } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: any;
}

class ApiService {
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    // Log da requisição
    console.log('API Request:', {
      url: `${API_URL}${endpoint}`,
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...(options.headers as Record<string, string> || {}),
      },
      body: options.body ? JSON.parse(options.body as string) : undefined,
    });

    const headers = new Headers({
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...(options.headers as Record<string, string> || {}),
    });

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      // Log da resposta
      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      // Verifica se o Content-Type é JSON antes de tentar analisar
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        // Log dos dados da resposta
        console.log('API Response data:', data);

        if (!response.ok) {
          return {
            error: data.error || 'Erro na requisição',
            details: data.details,
          };
        }

        return { data };
      } else {
        console.warn('Resposta não é JSON:', response);
        return {
          error: 'Resposta inválida do servidor',
        };
      }
    } catch (error) {
      console.error('API Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  // Auth
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: { id: number; email: string; name: string } }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string): Promise<ApiResponse<{ token: string; user: { id: number; email: string; name: string } }>> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  // Products
  async getProducts(): Promise<ApiResponse<Product[]>> {
    return this.request('/products');
  }

  async getProduct(id: number): Promise<ApiResponse<Product>> {
    return this.request(`/products/${id}`);
  }

  // Cart
  async getCart(): Promise<ApiResponse<CartItem[]>> {
    return this.request('/cart');
  }

  async addToCart(productId: number, quantity: number): Promise<ApiResponse<CartItem>> {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(productId: number, quantity: number): Promise<ApiResponse<CartItem>> {
    return this.request(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(productId: number): Promise<ApiResponse<void>> {
    return this.request(`/cart/${productId}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async createOrder(items: CartItem[], total: number, shippingAddress: ShippingAddress, paymentMethod: PaymentMethod): Promise<ApiResponse<Order>> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({
        items,
        total,
        shippingAddress,
        paymentMethod,
      }),
    });
  }

  async getOrders(): Promise<ApiResponse<Order[]>> {
    return this.request('/orders');
  }

  async getOrder(id: number): Promise<ApiResponse<Order>> {
    return this.request(`/orders/${id}`);
  }
}

export const api = new ApiService(); 