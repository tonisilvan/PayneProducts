'use client';

import { useEffect } from 'react';
import { CartItem } from '@/types/product';
import { calculateCartTotal } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

interface ShoppingCartProps {
  items: CartItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppingCart({ 
  items, 
  onRemoveItem, 
  onUpdateQuantity, 
  onClearCart, 
  isOpen, 
  onClose 
}: ShoppingCartProps) {
  const cart = calculateCartTotal(items);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full sm:max-w-md bg-background shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Carrito ({items.length})</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 space-y-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
              <div>
                <p className="font-medium text-lg">Tu carrito está vacío</p>
                <p className="text-sm text-muted-foreground mt-1">Añade productos para empezar</p>
              </div>
              <Button variant="outline" onClick={onClose}>
                Seguir comprando
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div 
                  key={item.product.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                    <Image
                      src={item.product.images[0]?.url || '/images/powerbank-principal-cable.png'}
                      alt={item.product.images[0]?.alt || item.product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-1">{item.product.name}</h3>
                    <p className="text-sm font-semibold text-primary mt-0.5">
                      {item.product.variants[0].price.toFixed(2)} € <span className="text-xs font-normal text-muted-foreground">+ IVA</span>
                    </p>
                    
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md border bg-background hover:bg-accent transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md border bg-background hover:bg-accent transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <p className="text-sm font-semibold">
                      {(item.product.variants[0].price * item.quantity).toFixed(2)} €
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4 bg-muted/30">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>{cart.subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IVA (21%):</span>
                <span>{cart.tax.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío:</span>
                <span className="text-green-600 font-medium">Gratis</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span className="text-primary">{cart.total.toFixed(2)} €</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button className="w-full h-12 text-base font-semibold">
                Finalizar Compra
              </Button>
              <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={onClearCart}>
                Vaciar carrito
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
