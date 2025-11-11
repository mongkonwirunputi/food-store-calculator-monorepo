import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product as ProductType, PRODUCTS } from '@food-store-calculator/shared';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService implements OnModuleInit {
  private cachedProducts: ProductType[] | null = null;
  private loadingPromise: Promise<ProductType[]> | null = null;

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async onModuleInit() {
    // Seed products if database is empty
    const count = await this.productRepository.count();
    if (count === 0) {
      await this.seedProducts();
    }

    // Warm the cache so the first HTTP request does not wait on the database
    await this.ensureProductsCached(true);
  }

  private async seedProducts() {
    const products = PRODUCTS.map(p =>
      this.productRepository.create({
        id: p.id,
        name: p.name,
        price: p.price,
      })
    );
    await this.productRepository.save(products);
  }

  private normalizePrice(price: unknown): number {
    if (typeof price === 'number') {
      return price;
    }
    if (typeof price === 'string') {
      return parseFloat(price);
    }
    return Number(price);
  }

  private mapEntityToProduct(entity: Product): ProductType {
    const price = this.normalizePrice(entity.price);

    return {
      id: entity.id,
      name: entity.name,
      price,
    };
  }

  private async loadProductsFromDatabase(): Promise<ProductType[]> {
    const dbProducts = await this.productRepository.find({
      select: ['id', 'name', 'price'],
      order: { price: 'ASC' },
    });

    if (dbProducts.length === 0) {
      return PRODUCTS;
    }

    return dbProducts.map(entity => this.mapEntityToProduct(entity));
  }

  private async ensureProductsCached(forceReload = false): Promise<ProductType[]> {
    if (!forceReload && this.cachedProducts) {
      return this.cachedProducts;
    }

    if (!this.loadingPromise) {
      this.loadingPromise = (async () => {
        try {
          const products = await this.loadProductsFromDatabase();
          this.cachedProducts = products;
          return products;
        } catch (error) {
          console.error('Failed to load products from database:', error);
          if (!this.cachedProducts) {
            this.cachedProducts = PRODUCTS;
          }
          // Sort the cached products by price in ascending order before returning.
          return this.cachedProducts;
        } finally {
          this.loadingPromise = null;
        }
      })();
    }

    return this.loadingPromise;
  }

  async getProducts(): Promise<ProductType[]> {
    const products = await this.ensureProductsCached();
    return products.sort((a, b) => a.price - b.price);
  }
}
