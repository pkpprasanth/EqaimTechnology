import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as path from 'path';
import  Home  from '../app/page';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/steps (POST)', () => {
    it('should generate steps for given numbers', () => {
      const filePath = path.resolve(__dirname, 'test-data/numbers.json');
      const numbers = require(filePath);

      return request(app.getHttpServer())
        .post('/api/steps')
        .send(numbers)
        .expect(201)
        .expect((response:any) => {
          const { steps } = response.body;
          expect(steps).toBeDefined();
        });
    });

    it('should handle errors if numbers are not provided', () => {
      return request(app.getHttpServer())
        .post('/api/steps')
        .send({})
        .expect(400)
        .expect((response:any) => {
          const { message } = response.body;
          expect(message).toBe('Numbers are required.');
          // Perform additional assertions on the error response
        });
    });
  });

  describe('/api/save-results (POST)', () => {
    it('should save results to the database', () => {
      const filePath = path.resolve(__dirname, 'test-data/results.json');
      const results = require(filePath);

      return request(app.getHttpServer())
        .post('/api/save-results')
        .send({
          steps: results,
        })
        .expect(201)
        .expect((response:any) => {
          const { success } = response.body;
          expect(success).toBe(true);
        });
    });
  });

  describe('/api/results (GET)', () => {
    it('should fetch saved results from the database', () => {
      return request(app.getHttpServer())
        .get('/api/results')
        .expect(200)
        .expect((response:any) => {
          const { results } = response.body;
          expect(results).toBeDefined();
        });
    });
  });
});
