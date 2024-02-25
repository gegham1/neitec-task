import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config({ path: '.env' });

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['src/domain/**/entity.ts'],
  migrations: ['src/common/database/migration/*.ts'],
});
