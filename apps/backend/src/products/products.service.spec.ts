import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { PRODUCTS } from '@food-store-calculator/shared';

type RepositoryMock = jest.Mocked<
  Pick<Repository<Product>, 'find' | 'count' | 'create' | 'save'>
>;

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: RepositoryMock;

  const buildMockProducts = () =>
    PRODUCTS.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      createdAt: new Date(),
      updatedAt: new Date(),
    })) as Product[];

  beforeEach(async () => {
    repository = {
      find: jest.fn().mockResolvedValue(buildMockProducts()),
      count: jest.fn().mockResolvedValue(PRODUCTS.length),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all products from database', async () => {
    const products = await service.getProducts();
    expect(repository.find).toHaveBeenCalledTimes(1);
    expect(products.length).toBe(PRODUCTS.length);
    expect(products).toEqual(PRODUCTS);
  });

  it('should cache products after the first load', async () => {
    await service.getProducts();
    await service.getProducts();

    expect(repository.find).toHaveBeenCalledTimes(1);
  });

  it('should return products with correct structure', async () => {
    const products = await service.getProducts();
    products.forEach(product => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(typeof product.price).toBe('number');
    });
  });

  it('should warm the cache during module initialization', async () => {
    await service.onModuleInit();
    expect(repository.count).toHaveBeenCalled();
    expect(repository.find).toHaveBeenCalled();
  });

  it('should fall back to shared products when database returns empty result', async () => {
    repository.find.mockResolvedValueOnce([]);
    (service as any).cachedProducts = null;

    const products = await service.getProducts();
    expect(products).toEqual(PRODUCTS);
  });

  it('should fall back to shared products when database query fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    repository.find.mockRejectedValueOnce(new Error('db down'));
    (service as any).cachedProducts = null;

    const products = await service.getProducts();
    expect(products).toEqual(PRODUCTS);
    consoleErrorSpy.mockRestore();
  });
});
