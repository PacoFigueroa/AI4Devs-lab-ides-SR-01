import request from 'supertest';
import { app } from '../../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Candidate API - Integration Tests', () => {
  // Clean up test data after tests
  afterAll(async () => {
    // Clean up test candidates
    await prisma.candidate.deleteMany({
      where: {
        email: {
          contains: 'test@'
        }
      }
    });
    await prisma.$disconnect();
  });

  describe('POST /api/candidates', () => {
    it('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/candidates')
        .field('candidateData', JSON.stringify({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          educations: [],
          experiences: []
        }));

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 400 when email format is invalid', async () => {
      const response = await request(app)
        .post('/api/candidates')
        .field('candidateData', JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          email: 'invalid-email',
          phone: '+1234567890',
          educations: [],
          experiences: []
        }));

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 when phone format is invalid', async () => {
      const response = await request(app)
        .post('/api/candidates')
        .field('candidateData', JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@test.com',
          phone: 'invalid-phone',
          educations: [],
          experiences: []
        }));

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should create candidate with valid data', async () => {
      const uniqueEmail = `test${Date.now()}@example.com`;
      
      const response = await request(app)
        .post('/api/candidates')
        .field('candidateData', JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          email: uniqueEmail,
          phone: '+1234567890',
          address: '123 Main St',
          educations: [],
          experiences: []
        }));

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.firstName).toBe('John');
      expect(response.body.data.lastName).toBe('Doe');
      expect(response.body.data.email).toBe(uniqueEmail);
    });

    it('should return 409 when email already exists', async () => {
      const uniqueEmail = `duplicate${Date.now()}@example.com`;
      
      // Create first candidate
      await request(app)
        .post('/api/candidates')
        .field('candidateData', JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          email: uniqueEmail,
          phone: '+1234567890',
          educations: [],
          experiences: []
        }));

      // Try to create duplicate
      const response = await request(app)
        .post('/api/candidates')
        .field('candidateData', JSON.stringify({
          firstName: 'Jane',
          lastName: 'Smith',
          email: uniqueEmail,
          phone: '+0987654321',
          educations: [],
          experiences: []
        }));

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('already exists');
    });

    it('should create candidate with education and experience', async () => {
      const uniqueEmail = `complete${Date.now()}@example.com`;
      
      const response = await request(app)
        .post('/api/candidates')
        .field('candidateData', JSON.stringify({
          firstName: 'Jane',
          lastName: 'Smith',
          email: uniqueEmail,
          phone: '+1234567890',
          educations: [{
            institution: 'Harvard University',
            degree: 'Bachelor',
            fieldOfStudy: 'Computer Science',
            startDate: '2015-09-01',
            endDate: '2019-06-01',
            current: false
          }],
          experiences: [{
            company: 'Google',
            position: 'Software Engineer',
            startDate: '2019-07-01',
            endDate: '2023-12-01',
            current: false
          }]
        }));

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.educations).toHaveLength(1);
      expect(response.body.data.experiences).toHaveLength(1);
    });
  });

  describe('GET /api/candidates', () => {
    it('should return list of candidates', async () => {
      const response = await request(app)
        .get('/api/candidates');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.candidates).toBeDefined();
      expect(Array.isArray(response.body.data.candidates)).toBe(true);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/candidates?page=1&limit=5');

      expect(response.status).toBe(200);
      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(5);
    });
  });

  describe('GET /api/candidates/:id', () => {
    it('should return 404 for non-existent candidate', async () => {
      const response = await request(app)
        .get('/api/candidates/999999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should return candidate by id', async () => {
      // Create a candidate first
      const uniqueEmail = `getbyid${Date.now()}@example.com`;
      const createResponse = await request(app)
        .post('/api/candidates')
        .field('candidateData', JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          email: uniqueEmail,
          phone: '+1234567890',
          educations: [],
          experiences: []
        }));

      const candidateId = createResponse.body.data.id;

      const response = await request(app)
        .get(`/api/candidates/${candidateId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(candidateId);
    });
  });

  describe('GET /api/candidates/autocomplete/institutions', () => {
    it('should return 400 without query parameter', async () => {
      const response = await request(app)
        .get('/api/candidates/autocomplete/institutions');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return suggestions for institutions', async () => {
      const response = await request(app)
        .get('/api/candidates/autocomplete/institutions?query=harv');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/candidates/autocomplete/companies', () => {
    it('should return 400 without query parameter', async () => {
      const response = await request(app)
        .get('/api/candidates/autocomplete/companies');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return suggestions for companies', async () => {
      const response = await request(app)
        .get('/api/candidates/autocomplete/companies?query=goog');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});

