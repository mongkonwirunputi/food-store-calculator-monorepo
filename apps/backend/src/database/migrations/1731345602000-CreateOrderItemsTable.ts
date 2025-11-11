import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateOrderItemsTable1731345602000 implements MigrationInterface {
  private readonly orderIdIndex = new TableIndex({
    name: 'idx_order_items_order_id',
    columnNames: ['order_id'],
  });

  private readonly productIdIndex = new TableIndex({
    name: 'idx_order_items_product_id',
    columnNames: ['product_id'],
  });

  private readonly orderForeignKey = new TableForeignKey({
    name: 'fk_order_items_order',
    columnNames: ['order_id'],
    referencedTableName: 'orders',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
  });

  private readonly productForeignKey = new TableForeignKey({
    name: 'fk_order_items_product',
    columnNames: ['product_id'],
    referencedTableName: 'products',
    referencedColumnNames: ['id'],
    onDelete: 'RESTRICT',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'order_items',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'order_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'product_id',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'int',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKeys('order_items', [
      this.orderForeignKey,
      this.productForeignKey,
    ]);

    await queryRunner.createIndices('order_items', [
      this.orderIdIndex,
      this.productIdIndex,
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndices('order_items', [
      this.orderIdIndex,
      this.productIdIndex,
    ]);

    await queryRunner.dropForeignKeys('order_items', [
      this.orderForeignKey,
      this.productForeignKey,
    ]);

    await queryRunner.dropTable('order_items');
  }
}
