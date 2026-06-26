# Telemart Clone API

NestJS modular monolith backend.

## Setup

```bash
cp ../../.env.example ../../.env
npm run docker:up --prefix ../..
npm install --prefix ../..
npm run db:push --workspace=@telemart/api
npm run db:seed --workspace=@telemart/api
npm run dev --workspace=@telemart/api
```

API runs at http://localhost:3001/api/v1

## Default accounts

- Admin: admin@telemart.local / admin123
- Customer: customer@telemart.local / customer123
