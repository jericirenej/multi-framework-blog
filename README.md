# Blog app in multiple frameworks

The goal is to recreate the same simple blog application within multiple frameworks. All app instances will communicate with the same base API based on Hono and Kysely (SQLite)

## Setup

- Create `.env` file, based on the `.env-example` file
- Install dependencies: `pnpm install`
- Prepare database: `pnpm run migrate`
- Create base dataset: `pnpm run seed`

- Run API server: `pnpm run server`

## Existing examples

- [Angular](./packages/angular/README.md)

## Other

Lint, test, and check (a combination of lint and test) scripts can be run for all projects via the `pnpm run [lint|test|check]` commands.
