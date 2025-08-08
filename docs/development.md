# Development Guide

- [Development Guide](#development-guide)
  - [First-time Setup](#first-time-setup)
  - [Installation](#installation)
  - [Database Configuration](#database-configuration)
    - [PostgreSQL (Default)](#postgresql-default)
    - [MySQL/MariaDB Alternative](#mysqlmariadb-alternative)
    - [Database Operations](#database-operations)
      - [Migration Examples](#migration-examples)
  - [Development Server](#development-server)
  - [Project Structure](#project-structure)
  - [Code Generation](#code-generation)
  - [Environment Variables](#environment-variables)
  - [Docker Development](#docker-development)
    - [Prerequisites](#prerequisites)
    - [Running with Docker](#running-with-docker)
    - [Docker Compose Services](#docker-compose-services)
  - [Development Workflow](#development-workflow)
  - [Debugging](#debugging)
    - [VS Code Configuration](#vs-code-configuration)
    - [Debug Commands](#debug-commands)
  - [Performance Optimization](#performance-optimization)
    - [Development Performance](#development-performance)
    - [Production Considerations](#production-considerations)

## First-time Setup

Ensure you have the required tools installed:

- [Node.js](https://nodejs.org/en/) (v22+ LTS recommended)
- **One of the following package managers:**
  - [NPM](https://www.npmjs.com/) (comes with Node.js)
  - [PNPM](https://pnpm.io/installation) (recommended for performance)
  - [Yarn](https://yarnpkg.com/lang/en/docs/install/) (v1.22.22+ or v3+)
  - [Bun](https://bun.sh/docs/installation) (for high-performance builds)
- [PostgreSQL](https://www.postgresql.org/) (v12+) or [Docker](https://www.docker.com/)
- [Git](https://git-scm.com/)

## Installation

Choose your preferred package manager:

### NPM
```bash
# Install dependencies from package.json
npm install
```

### PNPM (Recommended)
```bash
# Install dependencies from package.json
pnpm install
```

### Yarn
```bash
# Install dependencies from package.json  
yarn install
```

### Bun
```bash
# Install dependencies from package.json
bun install
```

> **Note**: Don't delete lock files (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, or `bun.lockb`) before installation as they ensure consistent dependency versions across environments.

## Database Configuration

The project uses [Drizzle ORM](https://orm.drizzle.team/) with a schema-first approach and supports PostgreSQL as the primary database.

### PostgreSQL (Default)

1. Install and start PostgreSQL
2. Create a database for your application
3. Configure your `.env` file:

```env
# Database Configuration
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=nest_boilerplate

# Enable Drizzle logging (development only)
ENABLE_DRIZZLE_LOGS=true
```

### Database Schema

The project uses Drizzle ORM with a schema-first approach. Database schemas are defined in TypeScript and migrations are generated automatically.

#### Schema Definition Example

```typescript
// src/database/schema/user.ts
import { pgTable, varchar, pgEnum, uuid } from 'drizzle-orm/pg-core';
import { baseTable } from './base';

export const roleEnum = pgEnum('users_role_enum', ['USER', 'ADMIN']);

export const users = pgTable('users', {
  ...baseTable,
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
  role: roleEnum('role').default('USER').notNull(),
  email: varchar('email').unique(),
  password: varchar('password'),
});
```

### Database Operations

> **Note**: Drizzle ORM uses Drizzle Kit for migrations and schema management:
> - `db:generate` generates migrations from schema changes
> - `db:migrate` applies migrations to the database
> - `db:push` pushes schema changes directly to the database (development only)
> - `db:studio` opens Drizzle Studio for database management

#### Migration Examples

**Generating migration from schema changes:**
```bash
# 1. Create or modify your schema (e.g., src/database/schema/gift.ts)
# 2. Generate migration based on schema changes
yarn db:generate

# 3. Review the generated migration file
# 4. Run the migration
yarn db:migrate
```

**Complete workflow example:**
```bash
# 1. Create schema
# Edit: src/database/schema/gift.ts

# 2. Generate migration
yarn migration:generate src/database/migrations/gifts-table

# 3. Review generated migration
# File: src/database/migrations/1754340825698-gifts-table.ts

# 4. Run migration
yarn migration:run

# 5. Verify migration status
yarn migration:show

# Revert the last migration
yarn migration:revert

# Drop entire database schema (⚠️ destructive)
yarn schema:drop

```

## Development Server

The project uses Vite for fast development with hot module replacement:

```bash
# Start development server with Vite (recommended)
yarn start:dev

# Alternative: Start with NestJS CLI
yarn nest:start:dev

# Start with file watching
yarn watch:dev

# Start with debugger enabled
yarn nest:start:debug
```

> **Note**: If you're on Linux and see an `ENOSPC` error, you must [increase the number of available file watchers](https://stackoverflow.com/questions/22475849/node-js-error-enospc#answer-32600959).

The development server will be available at:
- **Application**: `http://localhost:3000`
- **API Documentation**: `http://localhost:3000/documentation`

## Project Structure

```
src/
├── common/                 # Shared DTOs, utilities, and base classes
│   ├── dto/               # Common data transfer objects
│   └── abstract.entity.ts # Base entity class
├── constants/             # Application-wide constants
├── database/              # Database configuration and migrations
│   ├── schema/           # Drizzle ORM schema definitions
│   └── migrations/       # Drizzle ORM migration files
├── decorators/            # Custom decorators
├── entity-subscribers/   # Entity subscribers (legacy)
├── exceptions/            # Custom exception classes
├── filters/               # Exception filters
├── guards/                # Authentication and authorization guards
├── i18n/                  # Internationalization files
│   ├── en_US/            # English translations
│   └── ru_RU/            # Russian translations
├── interceptors/          # Request/Response interceptors
├── interfaces/            # TypeScript interfaces
├── modules/               # Feature modules
│   ├── auth/             # Authentication module
│   ├── user/             # User management module
│   ├── post/             # Post management module
│   └── health-checker/   # Health check module
├── providers/             # Custom providers
├── shared/                # Shared services and utilities
│   └── services/         # Global services
└── validators/            # Custom validators
```

## Code Generation

Use NestJS CLI for rapid development:

```bash
# Install NestJS CLI globally (if not already installed)
yarn global add @nestjs/cli

# Generate a new module
nest generate module feature-name

# Generate a new service
nest generate service feature-name

# Generate a new controller
nest generate controller feature-name

# Generate a complete resource (module, service, controller, DTOs)
nest generate resource feature-name

# Use project-specific generator
yarn generate service feature-name
yarn g controller feature-name
```

> **Note**: The project includes custom schematics via `awesome-nestjs-schematics` for enhanced code generation.

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=nest_boilerplate
ENABLE_DRIZZLE_LOGS=true

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION_TIME=3600

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# API Documentation
ENABLE_DOCUMENTATION=true

# Throttling
THROTTLE_TTL=60
THROTTLE_LIMIT=10

# NATS (optional)
NATS_ENABLED=false
NATS_HOST=localhost
NATS_PORT=4222
```

## Docker Development

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running with Docker

```bash
# Start all services (app + database)
PORT=3000 docker-compose up

# Start in detached mode
PORT=3000 docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build
```

### Docker Compose Services

The `docker-compose.yml` includes:

- **app**: NestJS application
- **postgres**: PostgreSQL database
- **adminer**: Database administration tool (available at `http://localhost:8080`)

For MySQL development, use:
```bash
docker-compose -f docker-compose_mysql.yml up
```

## Development Workflow

1. **Feature Development**:
   ```bash
   # Create feature branch
   git checkout -b feature/new-feature

   # Generate module structure
   yarn g resource feature-name

   # Implement feature
   # Write tests
   # Update documentation
   ```

2. **Code Quality**:
   ```bash
   # Run linting
   yarn lint

   # Fix linting issues
   yarn lint:fix

   # Run tests
   yarn test

   # Check test coverage
   yarn test:cov
   ```

3. **Database Changes**:
   ```bash
   # Create/modify entities
   # Generate migration
   yarn migration:generate src/database/migrations/FeatureName

   # Review generated migration
   # Run migration
   yarn migration:run
   ```

## Debugging

### VS Code Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug NestJS",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/main.ts",
      "runtimeArgs": ["--loader", "ts-node/esm"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Debug Commands

```bash
# Start with debugger
yarn nest:start:debug

# Debug tests
yarn test:debug

# Debug specific test file
yarn test:debug -- user.service.spec.ts
```

## Performance Optimization

### Development Performance

1. **Use Vite for Development**:
   - Faster startup times
   - Hot module replacement
   - Optimized bundling

2. **Database Query Optimization**:
   ```bash
   # Enable query logging
   ENABLE_ORM_LOGS=true

   # Monitor slow queries
   # Add database indexes
   # Use query builders for complex queries
   ```

3. **Memory Management**:
   ```bash
   # Monitor memory usage
   node --inspect src/main.ts

   # Increase Node.js memory limit if needed
   node --max-old-space-size=4096 src/main.ts
   ```

### Production Considerations

- Use `yarn build:prod` for optimized builds
- Enable compression middleware
- Configure proper caching strategies
- Set up monitoring and logging
- Use environment-specific configurations
