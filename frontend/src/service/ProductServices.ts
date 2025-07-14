// src/service/ProductService.

interface ProductData {
  id: string;
  title: string;
  links: number;
  status: 'queued' | 'running' | 'done';
  headers: Array<{
    h1?: number;
    h2?: number;
    h4?: number;
    h5?: number;
    h6?: number;
  }>;
}

export const ProductService = {
  getProductsWithOrdersSmall: async (): Promise<ProductData[]> => {
    return [
      {
        id: '1001',
        title: 'sample.com',
        links: 25,
        status: "queued",
        headers: [
          { h1: 1, h2: 3, h4: 0, h5: 0, h6: 0 }
        ]
      },
      {
        id: '1001',
        title: 'test.com',
        links: 14,
        status: "running",
        headers: [
          { h1: 1 }, { h2: 2 }, { h4: 1 }, { h5: 1 }, { h6: 0 }
        ]
      },
      {
        id: '1001',
        title: 'try.com',
        links: 32,
        status: "done",
        headers: [
          { h1: 0, h2: 2, h4: 0, h5: 1, h6: 0 }
        ]
      },
    ];
  }
}; 