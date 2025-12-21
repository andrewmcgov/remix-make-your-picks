# Make your picks

An app for picking winners in the NFL playoffs.

## Development

Install dependencies and generate the Prisma client:
```pnpm install```

Start the dev server:
```pnpm dev```

Create a new migration:
```pnpm prisma:migrate:dev```

Deploy the migration

Change the DATABASE_URL in the .env to the production database URL and run:

```pnpm prisma:migrate:prod```



