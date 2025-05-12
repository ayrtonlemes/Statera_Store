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

class OrderService {
  private orders: Order[] = [];

  createOrder(cart: any, shippingAddress: any, paymentMethod: any): Order {
    const order: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date().toISOString(),
      status: 'pending',
      items: cart.items,
      total: cart.total,
      shippingAddress,
      paymentMethod,
    };

    this.orders.unshift(order); // Adiciona no início do array
    return order;
  }

  getOrders(): Order[] {
    return this.orders;
  }

  getOrder(id: string): Order | undefined {
    return this.orders.find(order => order.id === id);
  }

  updateOrderStatus(id: string, status: Order['status']): Order | undefined {
    const order = this.orders.find(order => order.id === id);
    if (order) {
      order.status = status;
    }
    return order;
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
}

export const orderService = new OrderService(); 