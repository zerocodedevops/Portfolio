import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { mockProducts } from '../data/mockProducts';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// Using local mock data to ensure Spanish content
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }), // Dummy base url
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      queryFn: async () => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return { data: mockProducts };
      },
    }),
    getProductById: builder.query<Product, string>({
      queryFn: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const product = mockProducts.find(p => p.id === Number(id));
        return { data: product || mockProducts[0] };
      },
    }),
    getCategories: builder.query<string[], void>({
       queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const categories = Array.from(new Set(mockProducts.map(p => p.category)));
        return { data: categories };
      },
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery, useGetCategoriesQuery } = productsApi;
