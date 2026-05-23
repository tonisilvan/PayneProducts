import { Product } from '@/types/product';
import productsData from './products.json';

export const products: Product[] = productsData.products as Product[];
export const shippingInfo = productsData.shippingInfo;
export const legalInfo = productsData.legalInfo;
