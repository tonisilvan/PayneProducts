export interface ProductImage {
  url: string;
  alt: string;
  type: 'principal' | 'secundaria';
}

export interface ProductVariant {
  color: string | null;
  reference: string;
  stock: number;
  price: number;
  currency: string;
  priceNote: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  highlightPhrase: string;
  ctaButton: string;
  category: string;
  variants: ProductVariant[];
  features: string[];
  recommendedUses: string[];
  images: ProductImage[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
}
