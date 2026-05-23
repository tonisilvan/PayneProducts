'use client';

import { Product } from '@/types/product';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const mainImage = product.images.find(img => img.type === 'principal') || product.images[0];
  const lowestPrice = Math.min(...product.variants.map(v => v.price));
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const hasMultipleVariants = product.variants.length > 1;
  const colors = product.variants.filter(v => v.color).map(v => v.color);

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={mainImage?.url || '/images/powerbank-principal-cable.png'}
            alt={mainImage?.alt || product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.featured && (
            <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600">
              Destacado
            </Badge>
          )}
          {totalStock < 15 && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              ¡Últimas {totalStock} uds!
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
          <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {product.shortDescription}
          </p>
          <p className="text-xs font-medium italic text-primary/80">
            {product.highlightPhrase}
          </p>
          {hasMultipleVariants && colors.length > 0 && (
            <div className="flex gap-1 items-center">
              <span className="text-xs text-muted-foreground">Colores:</span>
              {colors.map((color) => (
                <Badge key={color} variant="outline" className="text-xs">
                  {color}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          <div>
            <p className="text-2xl font-bold text-primary">
              {lowestPrice.toFixed(2)} €
            </p>
            <p className="text-xs text-muted-foreground">
              IVA incl. · Ref: {product.variants[0].reference}
            </p>
          </div>
          <Button
            onClick={() => onAddToCart(product)}
            disabled={totalStock === 0}
            className="gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Añadir
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
