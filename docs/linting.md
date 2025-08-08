# Linting and Code Quality

This guide covers the linting, formatting, and code quality tools used in the Almost Awesome NestJS Boilerplate to maintain consistent, high-quality code.

- [Linting and Code Quality](#linting-and-code-quality)
  - [Overview](#overview)
  - [Biome Configuration](#biome-configuration)
    - [Installation](#installation)
    - [Configuration File](#configuration-file)
    - [Available Commands](#available-commands)
    - [VS Code Integration](#vs-code-integration)
  - [ESLint Configuration](#eslint-configuration)
    - [Installed Plugins](#installed-plugins)
    - [Configuration File](#configuration-file-1)
    - [Custom Rules](#custom-rules)
  - [Prettier Configuration](#prettier-configuration)
    - [Configuration File](#configuration-file-2)
    - [Integration with ESLint](#integration-with-eslint)
  - [TypeScript Configuration](#typescript-configuration)
    - [Compiler Options](#compiler-options)
    - [Strict Mode](#strict-mode)
  - [Git Hooks](#git-hooks)
    - [Husky Configuration](#husky-configuration)
    - [Lint-Staged](#lint-staged)
  - [Available Scripts](#available-scripts)
  - [IDE Integration](#ide-integration)
    - [VS Code Setup](#vs-code-setup)
    - [WebStorm Setup](#webstorm-setup)
  - [Code Quality Rules](#code-quality-rules)
    - [Naming Conventions](#naming-conventions)
    - [Import Organization](#import-organization)
    - [Code Complexity](#code-complexity)
  - [Security Linting](#security-linting)
  - [Performance Linting](#performance-linting)
  - [Custom Linting Rules](#custom-linting-rules)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
    - [Performance Issues](#performance-issues)
  - [Best Practices](#best-practices)
    - [1. Consistent Configuration](#1-consistent-configuration)
    - [2. Gradual Adoption](#2-gradual-adoption)
    - [3. IDE Integration](#3-ide-integration)
    - [4. CI/CD Integration](#4-cicd-integration)
    - [5. Team Guidelines](#5-team-guidelines)
    - [6. Regular Maintenance](#6-regular-maintenance)

## Overview

The project uses a comprehensive linting and formatting setup to ensure code quality:

- **Biome**: Fast, modern formatter and linter with zero configuration
- **ESLint**: JavaScript/TypeScript linting with multiple plugins  
- **Prettier**: Code formatting for consistent style
- **TypeScript**: Strict type checking
- **Husky**: Git hooks for automated quality checks
- **Lint-staged**: Run linters on staged files only

You can use either **Biome** (recommended for speed) or **ESLint + Prettier** (traditional setup) based on your preference.

## Biome Configuration

[Biome](https://biomejs.dev/) is a fast formatter, linter, and more for JavaScript, TypeScript, JSX, TSX, and JSON. It's designed to be a one-stop solution that can replace ESLint, Prettier, and other tools with superior performance.

### Installation

Biome is already installed as a dev dependency:

```json
{
  "devDependencies": {
    "@biomejs/biome": "1.9.4"
  }
}
```

### Configuration File

**`biome.json`** (if you have one):

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "all",
      "semicolons": "always"
    }
  },
  "files": {
    "ignore": [
      "dist/**",
      "node_modules/**",
      "coverage/**",
      ".vuepress/**"
    ]
  }
}
```

### Available Commands

```bash
# Format files with Biome
npm run biome:format              # or pnpm/yarn/bun equivalent

# Check formatting without making changes
npm run biome:format:check        # or pnpm/yarn/bun equivalent

# Run linter
npm run biome:lint                # or pnpm/yarn/bun equivalent

# Run linter with auto-fix
npm run biome:lint:fix            # or pnpm/yarn/bun equivalent

# Run both linter and formatter
npm run biome:check               # or pnpm/yarn/bun equivalent

# Run with auto-fix and formatting
npm run biome:check:fix           # or pnpm/yarn/bun equivalent

# Check all files (including ignored)
npm run biome:check:all           # or pnpm/yarn/bun equivalent

# Check all files with fixes and formatting
npm run biome:check:all:write:fix # or pnpm/yarn/bun equivalent
```

**Package.json scripts**:

```json
{
  "scripts": {
    "biome:format": "biome format --write .",
    "biome:format:check": "biome format --check .",
    "biome:lint": "biome lint .",
    "biome:lint:fix": "biome lint --fix .",
    "biome:check": "biome check .",
    "biome:check:fix": "biome check --fix .",
    "biome:check:all": "biome check --all .",
    "biome:check:all:write:fix": "biome check --all --write --fix ."
  }
}
```

### VS Code Integration

Install the [Biome VS Code extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) for the best experience.

**`.vscode/settings.json`**:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "biomejs.biome",
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[json]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

**Benefits of Biome:**
- ⚡ **30x faster** than ESLint + Prettier
- 🛠️ **Zero configuration** required
- 🎯 **One tool** for formatting and linting
- 📦 **Smaller bundle size** than ESLint ecosystem
- 🔧 **Better error messages** with suggested fixes
- 🚀 **Native binary** written in Rust

## ESLint Configuration

### Installed Plugins

The project uses multiple ESLint plugins for comprehensive code analysis:

```json
{
  "devDependencies": {
    "@eslint/js": "^9.21.0",
    "@typescript-eslint/eslint-plugin": "^8.21.0",
    "@typescript-eslint/parser": "^8.25.0",
    "eslint": "^9.18.0",
    "eslint-config-prettier": "^10.0.1",
    "eslint-import-resolver-typescript": "^4.3.5",
    "eslint-plugin-canonical": "^5.1.3",
    "eslint-plugin-github": "^6.0.0",
    "eslint-plugin-import": "^2.31.0",
    "eslint-plugin-import-helpers": "^2.0.1",
    "eslint-plugin-n": "^17.15.1",
    "eslint-plugin-no-secrets": "^2.2.1",
    "eslint-plugin-prettier": "^5.4.0",
    "eslint-plugin-promise": "^7.2.1",
    "eslint-plugin-simple-import-sort": "^12.1.1",
    "eslint-plugin-sonarjs": "^3.0.2",
    "eslint-plugin-unicorn": "^59.0.1"
  }
}
```

### Configuration File

**`eslint.config.mjs`**:

```javascript
import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import canonical from 'eslint-plugin-canonical';
import github from 'eslint-plugin-github';
import _import from 'eslint-plugin-import';
import importHelpers from 'eslint-plugin-import-helpers';
import n from 'eslint-plugin-n';
import noSecrets from 'eslint-plugin-no-secrets';
import prettier from 'eslint-plugin-prettier';
import promise from 'eslint-plugin-promise';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/dist', '**/node_modules', '**/coverage', '**/.vuepress'],
  },
  ...fixupConfigRules(compat.extends('eslint:recommended', '@typescript-eslint/recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended')),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      canonical,
      github,
      import: _import,
      'import-helpers': importHelpers,
      n,
      'no-secrets': noSecrets,
      prettier,
      promise,
      'simple-import-sort': simpleImportSort,
      sonarjs,
      unicorn,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',

      // Import rules
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/no-unresolved': 'error',
      'import/no-cycle': 'error',
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'error',

      // Code quality rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'object-shorthand': 'error',

      // Security rules
      'no-secrets/no-secrets': 'error',

      // SonarJS rules for code quality
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-duplicate-string': 'error',
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/prefer-immediate-return': 'error',

      // Unicorn rules for modern JavaScript
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/prefer-module': 'error',
      'unicorn/prefer-ternary': 'error',
      'unicorn/no-array-for-each': 'error',
      'unicorn/no-for-loop': 'error',

      // Promise rules
      'promise/always-return': 'error',
      'promise/catch-or-return': 'error',
      'promise/no-nesting': 'error',

      // Prettier integration
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts', '**/test/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'sonarjs/no-duplicate-string': 'off',
    },
  },
];
```

### Custom Rules

The configuration includes several custom rule sets:

1. **TypeScript Rules**: Strict type checking and modern TypeScript features
2. **Import Rules**: Organized imports and dependency management
3. **Security Rules**: Prevention of secrets and security vulnerabilities
4. **Code Quality Rules**: Complexity limits and best practices
5. **Performance Rules**: Optimized code patterns

## Prettier Configuration

### Configuration File

**`.prettierrc`**:

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "quoteProps": "as-needed",
  "jsxSingleQuote": true,
  "proseWrap": "preserve"
}
```

### Integration with ESLint

Prettier is integrated with ESLint through:

- `eslint-config-prettier`: Disables conflicting ESLint rules
- `eslint-plugin-prettier`: Runs Prettier as an ESLint rule

## TypeScript Configuration

### Compiler Options

**`tsconfig.json`**:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2022",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true
  }
}
```

### Strict Mode

The project uses TypeScript strict mode for enhanced type safety:

- `strictNullChecks`: Prevents null/undefined errors
- `noImplicitAny`: Requires explicit type annotations
- `strictBindCallApply`: Strict function binding
- `noFallthroughCasesInSwitch`: Prevents switch fallthrough bugs

## Git Hooks

### Husky Configuration

**`.husky/pre-commit`**:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

yarn lint-staged
```

### Lint-Staged

**`package.json`**:

```json
{
  "lint-staged": {
    "*.ts": ["eslint --fix", "git add"]
  }
}
```

This configuration:

- Runs ESLint with auto-fix on staged TypeScript files
- Automatically stages fixed files
- Prevents commits with linting errors

## Available Scripts

### Biome Scripts (Recommended)

```bash
# Format files with Biome
<pm> biome:format              # Fast formatting

# Check formatting without making changes
<pm> biome:format:check        # Check formatting

# Run linter
<pm> biome:lint                # Fast linting

# Run linter with auto-fix
<pm> biome:lint:fix            # Fix linting issues

# Run both linter and formatter
<pm> biome:check               # Check everything

# Run with auto-fix and formatting
<pm> biome:check:fix           # Fix and format

# Check all files (including ignored)
<pm> biome:check:all           # Check all files

# Check all files with fixes and formatting  
<pm> biome:check:all:write:fix # Fix all files
```

### ESLint + Prettier Scripts (Traditional)

```bash
# Run ESLint on all files
<pm> lint

# Run ESLint with auto-fix
<pm> lint:fix

# Check Prettier formatting
<pm> prettier:check

# Format code with Prettier
<pm> prettier:write

# Run TypeScript compiler check
<pm> type-check

# Run all quality checks
<pm> quality:check
```

**Package.json scripts** (replace `<pm>` with your package manager):

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint --fix .",
    "biome:format": "biome format --write .",
    "biome:format:check": "biome format --check .",
    "biome:lint": "biome lint .",
    "biome:lint:fix": "biome lint --fix .",
    "biome:check": "biome check .",
    "biome:check:fix": "biome check --fix .",
    "biome:check:all": "biome check --all .",
    "biome:check:all:write:fix": "biome check --all --write --fix ."
  }
}
```

## IDE Integration

### VS Code Setup

#### Option 1: Biome (Recommended)

**`.vscode/settings.json`**:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "biomejs.biome",
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[json]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

**`.vscode/extensions.json`**:

```json
{
  "recommendations": [
    "biomejs.biome",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json"
  ]
}
```

#### Option 2: ESLint + Prettier (Traditional)

**`.vscode/settings.json`**:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

**`.vscode/extensions.json`**:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode", 
    "dbaeumer.vscode-eslint", 
    "ms-vscode.vscode-typescript-next", 
    "bradlc.vscode-tailwindcss", 
    "ms-vscode.vscode-json"
  ]
}
```

### WebStorm Setup

1. **Enable ESLint**:

   - Go to `Settings > Languages & Frameworks > JavaScript > Code Quality Tools > ESLint`
   - Check "Automatic ESLint configuration"
   - Enable "Run eslint --fix on save"

2. **Enable Prettier**:
   - Go to `Settings > Languages & Frameworks > JavaScript > Prettier`
   - Set Prettier package path
   - Enable "On code reformat" and "On save"

## Code Quality Rules

### Naming Conventions

```typescript
// ✅ Good - PascalCase for classes
export class UserService {}

// ✅ Good - camelCase for variables and functions
const userName = 'john';
function getUserById(id: string) {}

// ✅ Good - kebab-case for files
// user-service.ts, create-user.dto.ts

// ✅ Good - UPPER_CASE for constants
const MAX_RETRY_ATTEMPTS = 3;

// ❌ Bad - Inconsistent naming
export class userService {} // Should be PascalCase
const UserName = 'john'; // Should be camelCase
```

### Import Organization

```typescript
// ✅ Good - Organized imports
// 1. Node modules
import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../database/drizzle.service';

// 2. Internal imports (absolute paths)
import { User } from '../../types/user.type.ts';
import { CreateUserDto } from '../dtos/create-user.dto.ts';

// 3. Relative imports
import { UserRepository } from './user.repository.ts';

// ❌ Bad - Mixed import order
import { UserRepository } from './user.repository.ts';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto.ts';
```

### Code Complexity

```typescript
// ✅ Good - Low cognitive complexity
function processUser(user: User): ProcessedUser {
  if (!user.isActive) {
    return { ...user, status: 'inactive' };
  }

  if (user.role === 'admin') {
    return { ...user, permissions: getAdminPermissions() };
  }

  return { ...user, permissions: getUserPermissions() };
}

// ❌ Bad - High cognitive complexity
function processUser(user: User): ProcessedUser {
  if (user.isActive) {
    if (user.role === 'admin') {
      if (user.department === 'IT') {
        if (user.experience > 5) {
          // Too many nested conditions
        }
      }
    }
  }
}
```

## Security Linting

The `no-secrets` plugin prevents committing sensitive information:

```typescript
// ❌ Bad - Hardcoded secrets (will be caught by linter)
const apiKey = 'sk-1234567890abcdef'; // ESLint error
const password = 'mySecretPassword123'; // ESLint error

// ✅ Good - Use environment variables
const apiKey = process.env.API_KEY;
const password = process.env.DATABASE_PASSWORD;
```

## Performance Linting

Unicorn plugin enforces performance best practices:

```typescript
// ✅ Good - Use for...of instead of forEach
for (const item of items) {
  processItem(item);
}

// ❌ Bad - forEach is slower
items.forEach((item) => processItem(item));

// ✅ Good - Use optional chaining
const email = user?.profile?.email;

// ❌ Bad - Manual null checking
const email = user && user.profile && user.profile.email;
```

## Custom Linting Rules

You can add custom ESLint rules for project-specific requirements:

```javascript
// eslint-local-rules.js
module.exports = {
  'no-entity-constructor': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Disallow constructors in entity classes',
      },
    },
    create(context) {
      return {
        MethodDefinition(node) {
          if (node.kind === 'constructor' && node.parent.parent.decorators?.some((d) => d.expression.name === 'Entity')) {
            context.report({
              node,
              message: 'Entity classes should not have constructors',
            });
          }
        },
      };
    },
  },
};
```

## Troubleshooting

### Common Issues

**ESLint not working in IDE**:

```bash
# Restart TypeScript service
# VS Code: Ctrl+Shift+P > "TypeScript: Restart TS Server"

# Check ESLint output
yarn lint --debug
```

**Prettier conflicts with ESLint**:

```bash
# Check for conflicting rules
yarn eslint-config-prettier src/main.ts
```

**Import resolution errors**:

```bash
# Check TypeScript paths
yarn tsc --noEmit --listFiles
```

### Performance Issues

**Slow linting**:

```bash
# Use ESLint cache
yarn lint --cache

# Exclude unnecessary files
echo "dist/" >> .eslintignore
echo "node_modules/" >> .eslintignore
```

## Best Practices

### 1. Consistent Configuration

- Use the same linting rules across all team members
- Include configuration files in version control
- Document any custom rules or exceptions

### 2. Gradual Adoption

- Start with basic rules and gradually add stricter ones
- Use `// eslint-disable-next-line` sparingly and with comments
- Regular review and update of linting rules

### 3. IDE Integration

- Configure IDE to show linting errors in real-time
- Enable auto-fix on save
- Use consistent formatting across the team

### 4. CI/CD Integration

- Run linting in CI/CD pipeline
- Fail builds on linting errors
- Generate linting reports for code review

### 5. Team Guidelines

```typescript
// ✅ Good - Document exceptions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// TODO: Replace with proper typing after API update
const legacyData: any = await getLegacyData();

// ❌ Bad - Unexplained disable
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = getData();
```

### 6. Regular Maintenance

- Update linting dependencies regularly
- Review and update custom rules
- Monitor for new security vulnerabilities
- Keep documentation up to date
