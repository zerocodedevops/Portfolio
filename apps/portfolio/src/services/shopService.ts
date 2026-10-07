import { mockProducts } from '@ecommerce/data/mockProducts';
import type { Product } from '@ecommerce/services/productsApi';

/** Legacy shop data stays local; this service intentionally has no database connection. */
export const ShopService = {
  getProducts: async (): Promise<Product[]> => mockProducts as Product[],
  seedDatabase: async (): Promise<boolean> => false,
  getProductById: async (id: string): Promise<Product | null> =>
    (mockProducts.find((product) => String(product.id) === id) as Product | undefined) ?? null,
};
