# Almost Awesome NestJS Boilerplate

[![Awesome NestJS](https://img.shields.io/badge/Awesome-NestJS-blue.svg?longCache=true&style=flat-square)](https://github.com/juliandavidmr/awesome-nestjs)
[![Package Manager Support](https://img.shields.io/badge/Package%20Manager-NPM%20%7C%20PNPM%20%7C%20Yarn%20%7C%20Bun-brightgreen)](https://github.com)
[![Runtime Support](https://img.shields.io/badge/Runtime-Node.js%20%7C%20Bun%20%7C%20Deno-blue)](https://github.com)

> This is an ever-evolving, very opinionated architecture and dev environment for new Node.js projects using [NestJS](https://nestjs.com) with full support for multiple package managers.

## 🚀 Key Features

This project is based on [Awesome NestJS Boilerplate](https://github.com/NarHakobyan/awesome-nest-boilerplate) and enhanced with:

- **Drizzle ORM** - Modern TypeScript ORM with type safety
- **Multiple Package Managers** - Full support for NPM, PNPM, Yarn, and Bun
- **Multiple Runtimes** - Node.js, Bun, and Deno compatibility
- **Docker Support** - Containerized development and production environments
- **Database Seeding** - Pre-populated dummy data for testing
- **Interactive API Documentation** - Swagger UI with working endpoints
- **Comprehensive Testing** - Unit, integration, and E2E tests

## 📦 Package Manager Support

Choose your preferred package manager:

### NPM (Default)

```bash
# Install dependencies
npm install

# Development
npm run start:dev

# Build
npm run build:prod

# Code quality (choose one)
npm run biome:check:fix     # Fast Biome formatting + linting
npm run lint:fix           # Traditional ESLint

# Database operations
npm run db:seed
npm run db:push
npm run db:studio
```

### PNPM (Recommended)

```bash
# Install dependencies
pnpm install

# Development
pnpm start:dev

# Build
pnpm build:prod

# Code quality (choose one)
pnpm biome:check:fix     # Fast Biome formatting + linting
pnpm lint:fix            # Traditional ESLint

# Database operations
pnpm db:seed
pnpm db:push
pnpm db:studio
```

### Yarn

```bash
# Install dependencies
yarn install

# Development
yarn start:dev

# Build
yarn build:prod

# Code quality (choose one)
yarn biome:check:fix     # Fast Biome formatting + linting
yarn lint:fix            # Traditional ESLint

# Database operations
yarn db:seed
yarn db:push
yarn db:studio
```

### Bun

```bash
# Install dependencies
bun install

# Development
bun start:dev:bun

# Build
bun build:bun

# Code quality (choose one)
bun biome:check:fix     # Fast Biome formatting + linting
bun lint:fix            # Traditional ESLint

# Database operations
bun db:seed
bun db:push
bun db:studio
```

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone <THIS_REPOSITORY_URL>
cd awesome-nest-boilerplate

# 2. Create environment variables file
cp .env .env.local  # For local development

# 3. Install dependencies (choose your preferred package manager)
npm install     # or
pnpm install    # or
yarn install    # or
bun install

# 4. Start PostgreSQL and pgAdmin (using Docker)
docker-compose up -d postgres pgadmin

# 5. Push database schema
npm run db:push  # (or pnpm/yarn/bun equivalent)

# 6. Seed the database with dummy data
npm run db:seed  # (or pnpm/yarn/bun equivalent)

# 7. Start development server
npm run start:dev  # (or pnpm/yarn/bun equivalent)

# 8. Open your browser
# API: http://localhost:3000
# API Documentation: http://localhost:3000/documentation
# pgAdmin: http://localhost:8080 (admin@admin.com / admin)
```

## Checklist

When you use this template, try follow the checklist to update your info properly

- [ ] Change the author name in `LICENSE`
- [ ] Change configurations in `.env`
- [ ] Remove the `.github` folder which contains the funding info
- [ ] Clean up the README.md file

And, enjoy :)

## 🏃‍♂️ Runtime Support

<details>
<summary><strong>📦 Node.js Development (Default)</strong></summary>

The project runs on Node.js 22+ by default with full NPM/PNPM/Yarn support.

```bash
# Start development server
npm run start:dev    # or pnpm/yarn equivalent

# Build for production
npm run build:prod   # or pnpm/yarn equivalent

# Run tests
npm test            # or pnpm/yarn equivalent

# Database operations
npm run db:push     # Push schema changes
npm run db:seed     # Seed with dummy data
npm run db:studio   # Open Drizzle Studio
```

Built files will be in the `dist/` directory ready for deployment.

</details>

<details>
<summary><strong>🧅 Bun Development</strong></summary>

High-performance JavaScript runtime with fast package management and bundling.

```bash
# Install dependencies (faster than npm)
bun install

# Start development server
bun run start:dev:bun

# Start with file watcher
bun run watch:bun

# Build for production
bun run build:bun

# Run tests
bun test

# Database operations (use bun for faster execution)
bun run db:push
bun run db:seed
bun run db:studio
```

Bun provides faster installs, faster test execution, and built-in bundling.

</details>

<details>
<summary><strong>🦕 Deno Development</strong></summary>

Secure TypeScript runtime with built-in tools and modern JavaScript features.

```bash
# Start development server
deno task start

# Start with file watcher
deno task watch

# Run tests
deno task test

# Build the application
deno task build

# Compile to executable (experimental)
deno task compile
```

Deno provides security by default, built-in TypeScript support, and modern web APIs.

</details>

## ✨ Features

<dl>
  <dt><b>🔧 Multiple Package Managers</b></dt>
  <dd>Full support for NPM, PNPM (recommended), Yarn, and Bun with optimized scripts for each.</dd>

  <dt><b>🚀 Multiple Runtime Support</b></dt>
  <dd>Run your application on Node.js, Bun, or Deno - choose what works best for your workflow.</dd>

  <dt><b>🗃️ Drizzle ORM</b></dt>
  <dd>Type-safe SQL toolkit with PostgreSQL support, migrations, and database seeding.</dd>

  <dt><b>🔐 JWT Authentication</b></dt>
  <dd>Complete authentication system with registration, login, and protected routes.</dd>

  <dt><b>📚 Interactive API Documentation</b></dt>
  <dd>Swagger UI with working endpoints at <code>http://localhost:3000/documentation</code></dd>

  <dt><b>🐳 Docker Support</b></dt>
  <dd>Containerized PostgreSQL, pgAdmin, and application with optimized development workflow.</dd>

  <dt><b>🌱 Database Seeding</b></dt>
  <dd>Pre-populated dummy data with 10 users, posts, and translations for immediate testing.</dd>

  <dt><b>⚡ Instant Feedback</b></dt>  
  <dd>Hot reload with Vite for lightning-fast development experience.</dd>

  <dt><b>🎯 TypeScript First</b></dt>
  <dd>Strict TypeScript configuration with the latest features and best practices.</dd>

  <dt><b>🧪 Comprehensive Testing</b></dt>
  <dd>Unit tests, integration tests, and E2E testing setup with Jest.</dd>

  <dt><b>📋 CQRS Pattern</b></dt>
  <dd>Command Query Responsibility Segregation for scalable architecture.</dd>

  <dt><b>🌍 Internationalization</b></dt>
  <dd>Multi-language support with English and Russian translations.</dd>

  <dt><b>🔍 Code Quality</b></dt>
  <dd>Biome (fast Rust-based linter/formatter), ESLint, Prettier, and Husky pre-commit hooks for consistent code quality.</dd>

  <dt><b>🏗️ Environment Configuration</b></dt>
  <dd>Separate configurations for development, staging, and production environments.</dd>
</dl>

## Documentation

This project includes a `docs` folder with more details on:

1.  [Setup and development](https://narhakobyan.github.io/awesome-nest-boilerplate/docs/development.html#first-time-setup)
1.  [Architecture](https://narhakobyan.github.io/awesome-nest-boilerplate/docs/architecture.html)
1.  [Naming Cheatsheet](https://narhakobyan.github.io/awesome-nest-boilerplate/docs/naming-cheatsheet.html)
1.  [Linting](https://narhakobyan.github.io/awesome-nest-boilerplate/docs/linting.html)
1.  [Code Generation](https://narhakobyan.github.io/awesome-nest-boilerplate/docs/code-generation.html)

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discuss Almost Awesome NestJS Boilerplate on GitHub](https://github.com/frxception/almost-awesome-nest-boilerplate/discussions)
