'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Product } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCarouselProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductCarousel({ products, onAddToCart }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false,
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full px-4 py-8">
      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-10 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-sm rounded-full p-4 shadow-xl hover:bg-white dark:hover:bg-zinc-700 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
        aria-label="Producto anterior"
      >
        <ChevronLeft className="h-8 w-8 text-zinc-700 dark:text-zinc-300 group-hover:text-primary transition-colors" />
      </button>
      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-10 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-sm rounded-full p-4 shadow-xl hover:bg-white dark:hover:bg-zinc-700 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
        aria-label="Producto siguiente"
      >
        <ChevronRight className="h-8 w-8 text-zinc-700 dark:text-zinc-300 group-hover:text-primary transition-colors" />
      </button>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {products.map((product, index) => {
            const mainImage = product.images.find(img => img.type === 'principal') || product.images[0];
            const lowestPrice = Math.min(...product.variants.map(v => v.price));
            const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
            const colors = product.variants.filter(v => v.color).map(v => v.color);
            const isActive = index === selectedIndex;

            return (
              <div
                key={product.id}
                className="flex-[0_0_85%] sm:flex-[0_0_70%] md:flex-[0_0_50%] lg:flex-[0_0_40%] min-w-0 pl-4"
              >
                <div
                  className={`transition-all duration-300 ${
                    isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-60'
                  }`}
                >
                  <Card className="overflow-hidden border-0 shadow-2xl bg-white dark:bg-zinc-900">
                    {/* Product Image */}
                    <Link href={`/producto/${product.slug}`}>
                      <div className="relative aspect-square overflow-hidden cursor-pointer">
                        <Image
                          src={mainImage?.url || '/images/powerbank-principal-cable.png'}
                          alt={mainImage?.alt || product.name}
                          fill
                          sizes="(max-width: 768px) 85vw, (max-width: 1200px) 50vw, 40vw"
                          className="object-cover hover:scale-105 transition-transform duration-500"
                          priority={index < 2}
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {product.featured && (
                            <Badge className="bg-yellow-500/90 backdrop-blur-sm text-white border-0 text-sm px-3 py-1">
                              Destacado
                            </Badge>
                          )}
                          {totalStock < 15 && (
                            <Badge className="bg-red-500/90 backdrop-blur-sm text-white border-0 text-sm px-3 py-1">
                              ¡Últimas {totalStock} uds!
                            </Badge>
                          )}
                        </div>

                        {/* Price overlay */}
                        <div className="absolute bottom-4 left-4">
                          <p className="text-3xl font-bold text-white drop-shadow-lg">
                            {lowestPrice.toFixed(2)} €
                          </p>
                          <p className="text-sm text-white/80">IVA incluido</p>
                        </div>
                      </div>
                    </Link>

                    {/* Product Info */}
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 flex-1">
                          <Badge variant="secondary" className="text-xs mb-1">
                            {product.category}
                          </Badge>
                          <h3 className="font-bold text-lg leading-tight line-clamp-2">
                            {product.name}
                          </h3>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.highlightPhrase}
                      </p>

                      {colors.length > 0 && (
                        <div className="flex gap-1 items-center flex-wrap">
                          <span className="text-xs text-muted-foreground">Disponible en:</span>
                          {colors.map((color) => (
                            <Badge key={color} variant="outline" className="text-xs">
                              {color}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => onAddToCart(product)}
                          disabled={totalStock === 0}
                          className="flex-1 gap-2"
                          size="lg"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Añadir al carrito
                        </Button>
                        {/* Ver más button only visible on desktop */}
                        <Link href={`/producto/${product.slug}`} className="hidden md:block">
                          <Button variant="outline" size="lg">
                            Ver más
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? 'bg-primary w-8'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`Ir al producto ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
