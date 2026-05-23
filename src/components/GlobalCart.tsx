'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingCart } from '@/components/ShoppingCart';
import { Toast } from '@/components/Toast';

export function GlobalCart() {
  const {
    items,
    isOpen,
    toastMessage,
    toastVisible,
    closeCart,
    removeItem,
    updateItemQuantity,
    emptyCart,
    hideToast,
  } = useCart();

  return (
    <>
      <ShoppingCart
        items={items}
        onRemoveItem={removeItem}
        onUpdateQuantity={updateItemQuantity}
        onClearCart={emptyCart}
        isOpen={isOpen}
        onClose={closeCart}
      />
      <Toast
        message={toastMessage}
        isVisible={toastVisible}
        onClose={hideToast}
      />
    </>
  );
}
