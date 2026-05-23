import { Product, CartItem, Cart } from '@/types/product';

export const calculateCartTotal = (items: CartItem[]): Cart => {
  const subtotal = items.reduce((total, item) => total + (item.product.variants[0].price * item.quantity), 0);
  const tax = subtotal * 0.21; // 21% IVA
  const shipping = 0; // Envío gratuito para Península española y Portugal peninsular
  const total = subtotal + tax + shipping;

  return {
    items,
    subtotal,
    tax,
    shipping,
    total
  };
};

export const addToCart = (cart: CartItem[], product: Product, quantity: number = 1): CartItem[] => {
  const existingItem = cart.find(item => item.product.id === product.id);
  
  if (existingItem) {
    return cart.map(item =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  }
  
  return [...cart, { product, quantity, addedAt: new Date() }];
};

export const removeFromCart = (cart: CartItem[], productId: string): CartItem[] => {
  return cart.filter(item => item.product.id !== productId);
};

export const updateQuantity = (cart: CartItem[], productId: string, quantity: number): CartItem[] => {
  if (quantity <= 0) {
    return removeFromCart(cart, productId);
  }
  
  return cart.map(item =>
    item.product.id === productId
      ? { ...item, quantity }
      : item
  );
};

export const clearCart = (): CartItem[] => {
  return [];
};
