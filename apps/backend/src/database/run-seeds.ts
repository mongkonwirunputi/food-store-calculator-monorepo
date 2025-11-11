import { DataSource } from 'typeorm';
import { seeds } from './seeds';

export async function runSeeds(dataSource: DataSource) {
  if (seeds.length === 0) {
    return;
  }

  const queryRunner = dataSource.createQueryRunner();

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    for (const Seed of seeds) {
      console.log(`🌱 Running seed: ${Seed.name}`);
      const instance = new Seed();
      await instance.up(queryRunner);
    }

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Error running seeds:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}
