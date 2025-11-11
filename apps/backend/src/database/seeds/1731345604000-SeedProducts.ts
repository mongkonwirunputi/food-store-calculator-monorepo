import { MigrationInterface, QueryRunner } from 'typeorm';

interface SeedProduct {
  id: string;
  name: string;
  price: number;
}

const PRODUCTS: SeedProduct[] = [
  { id: 'red', name: 'Red Set', price: 50 },
  { id: 'green', name: 'Green Set', price: 40 },
  { id: 'blue', name: 'Blue Set', price: 30 },
  { id: 'yellow', name: 'Yellow Set', price: 50 },
  { id: 'pink', name: 'Pink Set', price: 80 },
  { id: 'purple', name: 'Purple Set', price: 90 },
  { id: 'orange', name: 'Orange Set', price: 120 },
];

export class SeedProducts1731345604000 {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('products')
      .values(PRODUCTS)
      .orIgnore()
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('products')
      .where('id IN (:...ids)', { ids: PRODUCTS.map(p => p.id) })
      .execute();
  }
}
