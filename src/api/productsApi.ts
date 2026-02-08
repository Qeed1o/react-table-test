import type { Product } from '../types';

export interface ProductResponse {
  id: number;
  title: string;
  price: number;
  brand: string;
  sku: string;
  rating: number;
  description: string;
  thumbnail: string;
  category: string;
}

export interface ProductsResponse {
  products: ProductResponse[];
  total: number;
  skip: number;
  limit: number;
}

class ProductsApi {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getProducts(params: {
    limit?: number;
    skip?: number;
    select?: string;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  } = {}): Promise<{ products: Product[]; total: number }> {
    const searchParams = new URLSearchParams();
    
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.skip) searchParams.append('skip', params.skip.toString());
    if (params.select) searchParams.append('select', params.select);
    if (params.search) searchParams.append('q', params.search);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.order) searchParams.append('order', params.order);

    const url = `${this.baseUrl}/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Не удалось загрузить товары');
    }

    const data: ProductsResponse = await response.json();

    const transformedProducts: Product[] = data.products.map(product => ({
      id: product.id.toString(),
      name: product.title,
      price: product.price,
      vendor: product.brand,
      sku: product.sku,
      rating: product.rating,
      description: product.description,
      image: product.thumbnail,
      category: product.category,
    }));

    return {
      products: transformedProducts,
      total: data.total,
    };
  }
}

export const productsApi = new ProductsApi(import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com');
