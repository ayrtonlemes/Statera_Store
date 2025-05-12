import { Product } from "./products";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

const CART_STORAGE_KEY = "statera_cart";

export const cartService = {
  getCart(): Cart {
    if (typeof window === "undefined") {
      return { items: [], total: 0 };
    }

    const cart = localStorage.getItem(CART_STORAGE_KEY);
    if (!cart) {
      return { items: [], total: 0 };
    }

    return JSON.parse(cart);
  },

  addItem(product: Product, quantity: number = 1): Cart {
    const cart = this.getCart();
    const existingItem = cart.items.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product, quantity });
    }

    cart.total = this.calculateTotal(cart.items);
    this.saveCart(cart);
    return cart;
  },

  removeItem(productId: number): Cart {
    const cart = this.getCart();
    cart.items = cart.items.filter((item) => item.product.id !== productId);
    cart.total = this.calculateTotal(cart.items);
    this.saveCart(cart);
    return cart;
  },

  updateQuantity(productId: number, quantity: number): Cart {
    const cart = this.getCart();
    const item = cart.items.find((item) => item.product.id === productId);

    if (item) {
      item.quantity = quantity;
      cart.total = this.calculateTotal(cart.items);
      this.saveCart(cart);
    }

    return cart;
  },

  clearCart(): Cart {
    const emptyCart = { items: [], total: 0 };
    this.saveCart(emptyCart);
    return emptyCart;
  },

  private calculateTotal(items: CartItem[]): number {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  },

  private saveCart(cart: Cart): void {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  },
}; 