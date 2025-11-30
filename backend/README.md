# PocketLedger Backend

This document explains how to run the backend locally (PostgreSQL configuration).

Prerequisites
- Node.js (>=16)
- PostgreSQL server (or compatible) running and accessible
- `DATABASE_URL` set in an environment file

Quick start (Postgres)
1. Copy `.env.example` to `.env` and set `DATABASE_URL` and `JWT_SECRET`.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Generate Prisma client and run migrations (or deploy existing migrations):

```bash
npx prisma generate
# Create and apply a migration for Postgres
npx prisma migrate dev --name init
```

4. Seed sample data (optional):

```bash
npm run seed
```

5. Start the server:

```bash
npm run dev
```

Tests

Run Jest unit tests:

```bash
npm test
```

Notes
- The Prisma datasource in `prisma/schema.prisma` is configured for PostgreSQL.
- If you previously ran migrations for MySQL, you may need to reset migrations before applying Postgres migrations. You can reset using:

```bash
npx prisma migrate reset
```

- If you prefer a clean migration history for Postgres, remove existing `prisma/migrations` and run `npx prisma migrate dev --name init` to generate new migrations tailored to Postgres.

