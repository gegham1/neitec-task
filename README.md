# Neitec Home Task

## Description

REST API for submitting and validating transactions.

## Local Setup

### Installation

```bash
$ cp .env.example .env

$ yarn install
```

### Running the app

```bash
$ docker compose up -d
$ yarn migration:run

# development mode
$ yarn start:dev
```

## General Knowledge

### Security

- `Authoriation`: for authorization we use [paseto](https://github.com/panva/paseto), [see why](https://paragonie.com/blog/2017/03/jwt-json-web-tokens-is-bad-standard-that-everyone-should-avoid)

To generated key pairs for signing access tokens use the following code

```typescript
  const keyStore = await paseto.generateKey('public', { format: 'paserk' });
  console.log('keyStore', keyStore);
```

After, place the keys into appropriate env variables (see .env.example)

### Types of users

- `ADMIN`: validates transactions
- `USER`: general user who sends transaction requests

### Naming

- Directory name must be `singular` with `kebab-case`
- File name must be `kebab-case` and should be `singular`, example exception is `types.ts`

### Modules

- `common` is for anything that are **shared**, **used** or **imported** across different modules
- `config` stores app configuration (all env vars are access through this module)
- `domain` contains all entities and typeorm specific repositories
- `authentication` user authentication logic
- `transaction` transaction related logic
- `user` user related logic

### OpenAPI

#### Documentation

![Example docs](https://docs.nestjs.com/assets/swagger1.png)
Running this repo `locally`, allowing you to access openapi documentation on your browser as the above example, simply by accessing `http://127.0.0.1/docs`. As for the json version (e.g for postman), can access `http://127.0.0.1/docs-json`.


### DB Migrations

```bash
# Generate new migration
yarn run migration:generate src/common/database/migration/<migrationname> <== without extension

# Create new migration
yarn run migration:create src/common/database/migration/<migrationname> <== without extension

# Run migrations
yarn run migration:run

# Run revert migration
yarn run migration:revert
```

## Tasks

- [x] Logging
- [x] Error handling
- [x] Healthcheck
- [x] Meaningful README.md
- [x] Local development mode
- [x] Linter
- [x] Formatter
- [x] Openapi definition
- [ ] Env variables validations
- [ ] Unit tests
- [ ] Contract test for API interface
- [ ] Datadog integration
- [ ] Sentry integration
- [ ] Server secrets handling
- [ ] Deployment pipeline and monitoring

## License

`UNLICENSED`.
