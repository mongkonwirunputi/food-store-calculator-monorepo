#!/usr/bin/env ts-node
/**
 * Standalone migration script
 * Usage: ts-node src/database/migrate.ts
 */
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';
import { runMigrations } from './run-migrations';
import { migrations } from './migrations';

// Load environment variables from .env file
config({ path: path.join(__dirname, '../../.env') });

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'food_store_calculator',
  entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations,
  synchronize: false,
  logging: true,
});

async function migrate() {
  try {
    await dataSource.initialize();
    console.log('📦 Database connection established');
    
    await runMigrations(dataSource);
    
    await dataSource.destroy();
    console.log('✅ Migration completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
