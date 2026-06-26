import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Telemart API (e2e)', () => {
  let app: INestApplication;
  let productId: string;
  const cartId = `test-cart-${Date.now()}`;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    it('POST /auth/login — customer demo account', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'customer@telemart.local', password: 'customer123' })
        .expect((res) => {
          expect([200, 201]).toContain(res.status);
          expect(res.body.accessToken).toBeDefined();
          expect(res.body.refreshToken).toBeDefined();
          expect(res.body.user.email).toBe('customer@telemart.local');
        });
    });

    it('POST /auth/login — rejects invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'customer@telemart.local', password: 'wrong' })
        .expect(401);
    });

    it('POST /auth/refresh — issues new access token', async () => {
      const login = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'customer@telemart.local', password: 'customer123' });

      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: login.body.refreshToken })
        .expect((res) => {
          expect([200, 201]).toContain(res.status);
          expect(res.body.accessToken).toBeDefined();
          expect(res.body.refreshToken).toBeDefined();
        });
    });
  });

  describe('Catalog', () => {
    it('GET /catalog/featured — returns product cards', () => {
      return request(app.getHttpServer())
        .get('/api/v1/catalog/featured')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].slug).toBeDefined();
          productId = res.body[0].id;
        });
    });

    it('GET /catalog/products — paginated listing', () => {
      return request(app.getHttpServer())
        .get('/api/v1/catalog/products?subcategory=smartphones')
        .expect(200)
        .expect((res) => {
          expect(res.body.items).toBeDefined();
          expect(res.body.total).toBeGreaterThan(0);
        });
    });
  });

  describe('Checkout', () => {
    it('POST /cart/items → POST /orders — guest COD order', async () => {
      expect(productId).toBeDefined();

      await request(app.getHttpServer())
        .post('/api/v1/cart/items')
        .set('x-cart-id', cartId)
        .send({ productId, quantity: 1 })
        .expect((res) => expect([200, 201]).toContain(res.status));

      return request(app.getHttpServer())
        .post('/api/v1/orders')
        .set('x-cart-id', cartId)
        .send({
          paymentMethod: 'COD',
          guestEmail: 'guest@test.local',
          shippingAddress: {
            fullName: 'Test User',
            phone: '03001234567',
            email: 'guest@test.local',
            city: 'Karachi',
            area: 'Clifton',
            streetAddress: '123 Test Street',
            landmark: 'Near Park',
          },
        })
        .expect((res) => {
          expect([200, 201]).toContain(res.status);
          expect(res.body.orderNumber).toBeDefined();
        });
    });
  });
});
