// Google Analytics 4 Events

// Global gtag function declaration
declare global {
  function gtag(...args: any[]): void;
}

interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  currency?: string;
}

// Eventos de conversión estándar de GA4
export const analyticsEvents = {
  // Producto añadido al carrito
  addToCart: (productName: string, productId: string, price: number, quantity: number = 1) => {
    gtag('event', 'add_to_cart', {
      currency: 'EUR',
      value: price * quantity,
      items: [{
        item_id: productId,
        item_name: productName,
        quantity: quantity,
        price: price
      }]
    });
  },

  // Inicio del proceso de checkout
  beginCheckout: (cartValue: number, itemCount: number) => {
    gtag('event', 'begin_checkout', {
      currency: 'EUR',
      value: cartValue,
      items: [] // Se puede poblar con los items del carrito si se quiere más detalle
    });
  },

  // Compra completada
  purchase: (orderId: string, totalValue: number, itemCount: number) => {
    gtag('event', 'purchase', {
      transaction_id: orderId,
      currency: 'EUR',
      value: totalValue,
      items: [] // Se puede poblar con los items del carrito si se quiere más detalle
    });
  },

  // Vista de producto
  viewItem: (productName: string, productId: string, price: number) => {
    gtag('event', 'view_item', {
      currency: 'EUR',
      value: price,
      items: [{
        item_id: productId,
        item_name: productName,
        price: price
      }]
    });
  },

  // Búsqueda
  search: (searchTerm: string) => {
    gtag('event', 'search', {
      search_term: searchTerm
    });
  },

  // Evento personalizado genérico
  customEvent: (eventName: string, parameters?: Record<string, any>) => {
    gtag('event', eventName, parameters);
  }
};

// Helper para verificar si gtag está disponible
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const isGAReady = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};
