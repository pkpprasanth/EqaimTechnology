import { PoolConfig } from 'pg';

const dbConfig: PoolConfig = {
  user: 'root',
  host: 'localhost',
  database: 'step',
  password: 'root',
  port: 5432,
};

export default dbConfig;
