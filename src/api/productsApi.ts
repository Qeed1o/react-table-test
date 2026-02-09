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
    
    // Выбираем эндпоинт в зависимости от наличия поиска
    const isSearch = params.search && params.search.trim() !== '';
    let url: string;
    
    if (isSearch) {
      // Для поиска используем /products/search и передаем q параметр
      url = `${this.baseUrl}/products/search`;
      searchParams.append('q', params.search!);
    } else {
      // Для сортировки и обычной загрузки используем /products
      url = `${this.baseUrl}/products`;
      
      // Маппинг полей сортировки для API
      const sortMapping: Record<string, string> = {
        'name': 'title',
        'vendor': 'brand',
        'sku': 'sku',
        'rating': 'rating',
        'price': 'price'
      };
      
      if (params.sortBy && sortMapping[params.sortBy]) {
        searchParams.append('sortBy', sortMapping[params.sortBy]);
      }
      if (params.order) searchParams.append('order', params.order);
    }
    
    const finalUrl = `${url}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    const response = await fetch(finalUrl);

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
