# Notrace — Upload, Process, and Share. Vanish in 24 hours.

## Quickstart

1. Copy `.env.example` to `.env` and fill values.
2. Set `DATABASE_URL` (Postgres) and storage envs.
3. Generate Prisma client:

```
npx prisma generate
```

4. Run dev:

```
npm run dev
```

## Env variables
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GITHUB_ID`, `GITHUB_SECRET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `STORAGE_REGION`, `STORAGE_BUCKET`
- `NEXT_PUBLIC_SITE_URL`

## APIs
- `POST /api/upload` → presigned PUT + create metadata
- `GET /api/files/:id` → metadata
- `POST /api/download/:id` → presigned GET (password-aware)
- `POST /api/cron/cleanup` → deletes expired/limited files

## Deploy
- Platform: Vercel or Railway
- Schedule cleanup via Vercel Cron or external scheduler to hit `/api/cron/cleanup`.
