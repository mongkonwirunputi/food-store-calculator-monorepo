import { DataSource } from 'typeorm';
import { runSeeds } from './run-seeds';

export async function runMigrations(dataSource: DataSource) {
  try {
    await dataSource.runMigrations({
      transaction: 'each',
    });
    await runSeeds(dataSource);
    console.log('✅ Database migrations completed successfully');
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    throw error;
  }
}
