export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface PaymentMethod {
  type: 'credit_card' | 'boleto' | 'pix';
  lastDigits?: string;
}

export interface Order {
  id: number;
  date: string;
  status: 'pending' | 'paid' | 'cancelled';
  items: {
    productId: number;
    quantity: number;
    price: number;
  }[];
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
} 

export interface CreateOrderRequest {
  items: {
    productId: number;
    quantity: number;
    price: number;
  }[];
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
}


export interface OrderResponse {
  id: number;
  date: string;
  status: 'pending' | 'paid' | 'cancelled';
  items: {
    productId: number;
    quantity: number;
    price: number;
  }[];
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
}