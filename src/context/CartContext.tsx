'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CartItem, Product } from '@/types/product';
import { addToCart, removeFromCart, updateQuantity, clearCart } from '@/lib/cart';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  toastMessage: string;
  toastVisible: boolean;
  cartCount: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  emptyCart: () => void;
  hideToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const hideToast = useCallback(() => setToastVisible(false), []);

  const addItem = useCallback((product: Product) => {
    setItems(prev => addToCart(prev, product));
    showToast(`${product.name.length > 35 ? product.name.slice(0, 35) + '...' : product.name} añadido`);
  }, [showToast]);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => removeFromCart(prev, productId));
  }, []);

  const updateItemQuantity = useCallback((productId: string, quantity: number) => {
    setItems(prev => updateQuantity(prev, productId, quantity));
  }, []);

  const emptyCart = useCallback(() => {
    setItems(clearCart());
  }, []);

  return (
    <CartContext.Provider value={{
      items,
      isOpen,
      toastMessage,
      toastVisible,
      cartCount,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateItemQuantity,
      emptyCart,
      hideToast,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
