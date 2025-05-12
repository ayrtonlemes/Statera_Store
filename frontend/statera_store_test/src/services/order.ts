import { api } from './api';
import { Order as ApiOrder, CartItem, ShippingAddress, PaymentMethod } from '../types';

export interface OrderItem {
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: {
    type: 'credit_card' | 'boleto' | 'pix';
    lastDigits?: string;
  };
}

// Mapeia os status do backend para o frontend
const statusMap: Record<string, Order['status']> = {
  pending: 'pending',
  paid: 'processing', // ou 'paid' se quiser igual ao backend
  cancelled: 'cancelled',
};

class OrderService {
  private orders: Order[] = [];

  async createOrder(cart: { items: CartItem[]; total: number }, shippingAddress: ShippingAddress, paymentMethod: PaymentMethod): Promise<Order> {
    const user = localStorage.getItem('user');
    if (!user) {
      throw new Error('Usuário não está logado');
    }

    try {
      const response = await api.createOrder(
        cart.items,
        cart.total,
        shippingAddress,
        paymentMethod
      );

      // Log da resposta da API
      console.log('API Response:', response);

      if (!response.data) {
        throw new Error(response.error || 'Erro desconhecido ao criar pedido');
      }
      const data = response.data;
      // Cria o pedido no frontend com os dados do backend
      const order: Order = {
        id: String(data.id),
        date: data.date || data.createdAt,
        status: statusMap[data.status] || 'pending',
        items: cart.items.map(item => ({
          product: {
            id: item.productId,
            name: item.product?.name || '',
            price: item.price,
            imageUrl: item.product?.image || '',
          },
          quantity: item.quantity,
        })),
        total: data.total,
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
      };
      this.orders.unshift(order);
      return order;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erro ao criar pedido: ${error.message}`);
      }
      throw new Error('Erro desconhecido ao criar pedido');
    }
  }

  async getOrders(): Promise<Order[]> {
    try {
      const response = await api.getOrders();
      if (!response.data) {
        throw new Error(response.error || 'Erro ao buscar pedidos');
      }
      // Atualiza a lista de pedidos com os dados do backend
      this.orders = response.data.map((order: ApiOrder) => ({
        id: String(order.id),
        date: order.date || order.createdAt,
        status: statusMap[order.status] || 'pending',
        items: (order.items || []).map((item: any) => ({
          product: {
            id: item.productId,
            name: item.product?.name || '',
            price: item.price,
            imageUrl: item.product?.image || '',
          },
          quantity: item.quantity,
        })),
        total: order.total,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
      }));
      return this.orders;
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      // Em caso de erro, retorna os pedidos em cache
      return this.orders;
    }
  }

  getOrder(id: string): Order | undefined {
    return this.orders.find(order => order.id === id);
  }

  // Simula atualizações de status para demonstração
  simulateOrderUpdates() {
    this.orders.forEach(order => {
      if (order.status === 'pending') {
        setTimeout(() => {
          this.updateOrderStatus(order.id, 'processing');
        }, 5000);
      } else if (order.status === 'processing') {
        setTimeout(() => {
          this.updateOrderStatus(order.id, 'shipped');
        }, 10000);
      } else if (order.status === 'shipped') {
        setTimeout(() => {
          this.updateOrderStatus(order.id, 'delivered');
        }, 15000);
      }
    });
  }

  private updateOrderStatus(id: string, status: Order['status']): Order | undefined {
    const order = this.orders.find(order => order.id === id);
    if (order) {
      order.status = status;
    }
    return order;
  }
}

export const orderService = new OrderService(); 