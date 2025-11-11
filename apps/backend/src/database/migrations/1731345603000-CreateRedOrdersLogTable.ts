import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateRedOrdersLogTable1731345603000 implements MigrationInterface {
  private readonly orderedAtIndex = 'idx_red_orders_log_ordered_at';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'red_orders_log',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'ordered_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      })
    );

    await queryRunner.createIndex(
      'red_orders_log',
      new TableIndex({
        name: this.orderedAtIndex,
        columnNames: ['ordered_at'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('red_orders_log', this.orderedAtIndex);
    await queryRunner.dropTable('red_orders_log');
  }
}
