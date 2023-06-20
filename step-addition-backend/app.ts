import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Pool } from 'pg';
import stepRoutes from './routes/step';

const app: Express = express();
const port: number = 3001;

const pool: Pool = new Pool({
  user: 'root',
  host: 'localhost',
  database: 'step',
  password: 'root',
  port: 5432,
});
app.use(bodyParser.json());
app.use(cors());
app.use('/', stepRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
