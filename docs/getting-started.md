# Getting Started

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Start](#quick-start)
  - [Available Scripts](#available-scripts)
    - [Development](#development)
    - [Production](#production)
    - [Testing](#testing)
    - [Database Operations](#database-operations)
    - [Code Quality](#code-quality)
  - [Runtime Support](#runtime-support)
    - [Node.js (Default)](#nodejs-default)
    - [Bun](#bun)
    - [Deno](#deno)
  - [Initial Setup Checklist](#initial-setup-checklist)
    - [1. Project Configuration](#1-project-configuration)
    - [2. Environment Setup](#2-environment-setup)
    - [3. Database Setup](#3-database-setup)
    - [4. Development Environment](#4-development-environment)
  - [Environment Configuration](#environment-configuration)
  - [Next Steps](#next-steps)

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (LTS version 22+ recommended)
- **One of the following package managers:**
  - [NPM](https://www.npmjs.com/) (comes with Node.js)
  - [PNPM](https://pnpm.io/installation) (recommended for performance)
  - [Yarn](https://yarnpkg.com/getting-started/install) (v1.22.22+ or v3+)
  - [Bun](https://bun.sh/docs/installation) (for high-performance builds)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) (optional, for containerized development)
- A PostgreSQL database (v12+ recommended, or use Docker)

## Quick Start

Choose your preferred package manager and follow the instructions:

### Using NPM
```bash
# Clone the repository
git clone <THIS_REPOSITORY_URL>
cd awesome-nest-boilerplate

# Create environment variables file
cp .env .env.local

# Install dependencies
npm install

# Start PostgreSQL (using Docker)
docker-compose up -d postgres pgadmin

# Push database schema
npm run db:push

# Seed database with dummy data
npm run db:seed

# Start development server
npm run start:dev
```

### Using PNPM (Recommended)
```bash
# Clone the repository
git clone <THIS_REPOSITORY_URL>
cd awesome-nest-boilerplate

# Create environment variables file
cp .env .env.local

# Install dependencies
pnpm install

# Start PostgreSQL (using Docker)
docker-compose up -d postgres pgadmin

# Push database schema
pnpm db:push

# Seed database with dummy data
pnpm db:seed

# Start development server
pnpm start:dev
```

### Using Yarn
```bash
# Clone the repository
git clone <THIS_REPOSITORY_URL>
cd awesome-nest-boilerplate

# Create environment variables file
cp .env .env.local

# Install dependencies
yarn install

# Start PostgreSQL (using Docker)
docker-compose up -d postgres pgadmin

# Push database schema
yarn db:push

# Seed database with dummy data
yarn db:seed

# Start development server
yarn start:dev
```

### Using Bun
```bash
# Clone the repository
git clone <THIS_REPOSITORY_URL>
cd awesome-nest-boilerplate

# Create environment variables file
cp .env .env.local

# Install dependencies
bun install

# Start PostgreSQL (using Docker)
docker-compose up -d postgres pgadmin

# Push database schema
bun db:push

# Seed database with dummy data
bun db:seed

# Start development server
bun start:dev:bun
```

### 🌐 Access Your Application

Your application will be available at:
- **API**: `http://localhost:3000`
- **API Documentation**: `http://localhost:3000/documentation`
- **pgAdmin**: `http://localhost:8080` (admin@admin.com / admin)

## Available Scripts

Replace `<pm>` with your chosen package manager (`npm run`, `pnpm`, `yarn`, or `bun run`):

### Development
```bash
# Start development server with Vite
<pm> start:dev

# Start with NestJS CLI (alternative)
<pm> nest:start:dev

# Start with file watching
<pm> watch:dev

# Start with debugger  
<pm> nest:start:debug
```

**For Bun users**, use these optimized commands:
```bash
bun run start:dev:bun    # Start development server
bun run watch:bun        # Start with file watching
```

### Production
```bash
# Build for production
<pm> build:prod

# Start production server
<pm> start:prod
```

**For Bun users**:
```bash
bun run build:bun       # Build with Bun
```

### Testing
```bash
# Run unit tests
<pm> test

# Run tests in watch mode
<pm> test:watch

# Run e2e tests
<pm> test:e2e

# Run test coverage
<pm> test:cov

# Run tests with debugger
<pm> test:debug
```

### Database Operations (Drizzle ORM)
```bash
# Generate new migration
<pm> db:generate

# Push schema changes to database
<pm> db:push

# Run migrations
<pm> db:migrate

# Seed database with dummy data
<pm> db:seed

# Open Drizzle Studio (database GUI)
<pm> db:studio
```

### Code Quality
```bash
# Run ESLint
<pm> lint

# Fix ESLint issues
<pm> lint:fix

# Update dependencies (if taze is installed)
<pm> taze
```

## Runtime Support

This boilerplate supports multiple JavaScript runtimes for maximum flexibility:

### Node.js (Default)
The traditional and most stable runtime environment with full ecosystem support.

```bash
# Development
yarn start:dev

# Production
yarn build:prod && yarn start:prod
```

### Bun
High-performance JavaScript runtime with built-in bundler and package manager.

```bash
# Start development server with Bun
bun start:dev:bun

# Watch mode with Bun
bun watch:bun

# Run tests with Bun
bun test

# Build with Bun
bun build:bun
```

### Deno
Secure runtime for JavaScript and TypeScript with built-in tooling.

```bash
# Start development server with Deno
deno task start

# Watch mode with Deno
deno task watch

# Run tests with Deno
deno task test

# Build with Deno
deno task buildr
```

## Initial Setup Checklist

After creating your project, complete these steps:

### 1. Project Configuration
- [ ] Update `package.json` with your project details (name, description, author)
- [ ] Modify `LICENSE` with your name/organization
- [ ] Update `README.md` with project-specific information
- [ ] Remove `.github` folder if not needed

### 2. Environment Setup
- [ ] Configure `.env` with your environment variables:
  ```env
  # Database
  DB_HOST=localhost
  DB_PORT=5432
  DB_USERNAME=postgres
  DB_PASSWORD=postgres
  DB_DATABASE=nest_boilerplate

  # JWT
  JWT_SECRET=your-secret-key
  JWT_EXPIRATION_TIME=3600

  # Application
  PORT=3000
  NODE_ENV=development

  # CORS
  CORS_ORIGINS=http://localhost:3000
  ```

### 3. Database Setup
- [ ] Set up your PostgreSQL database (or use Docker: `docker-compose up -d postgres pgadmin`)
- [ ] Update database configurations in `.env`
- [ ] Push initial schema: `<pm> db:push`
- [ ] Seed database with dummy data: `<pm> db:seed`

### 4. Development Environment
- [ ] Configure your IDE/editor with TypeScript support
- [ ] Install recommended extensions (ESLint, Prettier)
- [ ] Set up git hooks (Husky is pre-configured)

## Environment Configuration

The application supports multiple environments:

- **Development**: Full debugging, hot reload, detailed logging
- **Staging**: Production-like environment for testing
- **Production**: Optimized for performance and security

Key environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Application port | `3000` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `JWT_SECRET` | JWT signing secret | Required |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:3000` |

## Next Steps

1. **Explore the Architecture**: Read the [Architecture Documentation](./architecture.md) to understand the project structure and design patterns

2. **Development Setup**: Check the [Development Guide](./development.md) for detailed development instructions and Docker setup

3. **Code Standards**: Review the [Code Style and Patterns](./code-style-and-patterns.md) for coding conventions and best practices

4. **API Documentation**: Visit `http://localhost:3000/documentation` when running the server to explore the auto-generated Swagger documentation

5. **Testing**: Learn about testing strategies in the [Testing Guide](./testing.md)

6. **Deployment**: When ready to deploy, consult the [Deployment Guide](./deployment.md)

7. **Naming Conventions**: Reference the [Naming Cheatsheet](./naming-cheatsheet.md) for consistent naming across your project
