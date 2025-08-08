# Package Manager Guide

This project supports multiple package managers to give you flexibility in your development workflow. Choose the one that best fits your needs and preferences.

## Table of Contents

- [Package Manager Guide](#package-manager-guide)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [NPM (Default)](#npm-default)
    - [Installation](#installation)
    - [Common Commands](#common-commands)
    - [Pros and Cons](#pros-and-cons)
  - [PNPM (Recommended)](#pnpm-recommended)
    - [Installation](#installation-1)
    - [Common Commands](#common-commands-1)
    - [Pros and Cons](#pros-and-cons-1)
  - [Yarn](#yarn)
    - [Installation](#installation-2)
    - [Common Commands](#common-commands-2)
    - [Pros and Cons](#pros-and-cons-2)
  - [Bun](#bun)
    - [Installation](#installation-3)
    - [Common Commands](#common-commands-3)
    - [Pros and Cons](#pros-and-cons-3)
  - [Performance Comparison](#performance-comparison)
  - [Migration Between Package Managers](#migration-between-package-managers)
    - [From NPM to PNPM](#from-npm-to-pnpm)
    - [From Yarn to PNPM](#from-yarn-to-pnpm)
    - [From any PM to Bun](#from-any-pm-to-bun)
  - [Troubleshooting](#troubleshooting)
    - [Lock File Conflicts](#lock-file-conflicts)
    - [Dependency Issues](#dependency-issues)
  - [CI/CD Considerations](#cicd-considerations)
  - [Recommendations](#recommendations)

## Overview

| Package Manager | Speed | Disk Usage | Ecosystem | Stability | Learning Curve |
|-----------------|-------|------------|-----------|-----------|----------------|
| **NPM**         | ⭐⭐⭐   | ⭐⭐        | ⭐⭐⭐⭐⭐    | ⭐⭐⭐⭐⭐     | ⭐⭐⭐⭐⭐       |
| **PNPM**        | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐    | ⭐⭐⭐⭐     | ⭐⭐⭐⭐      | ⭐⭐⭐         |
| **Yarn**        | ⭐⭐⭐⭐  | ⭐⭐⭐      | ⭐⭐⭐⭐⭐    | ⭐⭐⭐⭐      | ⭐⭐⭐⭐        |
| **Bun**         | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐     | ⭐⭐⭐       | ⭐⭐⭐        | ⭐⭐⭐         |

## NPM (Default)

NPM is the default package manager that comes with Node.js. It's the most widely used and has the best ecosystem support.

### Installation

NPM comes pre-installed with Node.js. No additional installation required.

### Common Commands

```bash
# Install dependencies
npm install

# Install a package
npm install <package-name>
npm install --save-dev <package-name>  # dev dependency

# Run scripts
npm run start:dev
npm run build:prod
npm test

# Database operations
npm run db:push
npm run db:seed
npm run db:studio

# Code quality
npm run lint
npm run lint:fix
```

### Pros and Cons

**Pros:**
- ✅ Comes with Node.js (no additional installation)
- ✅ Most stable and widely supported
- ✅ Largest ecosystem and community
- ✅ Best documentation and tutorials

**Cons:**
- ❌ Slower installation times
- ❌ Higher disk usage
- ❌ Can have dependency resolution issues

## PNPM (Recommended)

PNPM is a fast, disk-efficient package manager that uses hard links and symlinks to save disk space.

### Installation

```bash
# Using npm
npm install -g pnpm

# Using Homebrew (macOS)
brew install pnpm

# Using Scoop (Windows)
scoop install pnpm

# Using standalone script
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### Common Commands

```bash
# Install dependencies
pnpm install

# Install a package  
pnpm add <package-name>
pnpm add --save-dev <package-name>  # dev dependency

# Run scripts
pnpm start:dev
pnpm build:prod  
pnpm test

# Database operations
pnpm db:push
pnpm db:seed
pnpm db:studio

# Code quality
pnpm lint
pnpm lint:fix
```

### Pros and Cons

**Pros:**
- ✅ **Fastest installation** (up to 2x faster than npm)
- ✅ **Disk efficient** (uses hard links, saves 50-90% disk space)
- ✅ **Strict dependency resolution** (no phantom dependencies)
- ✅ **Monorepo friendly**
- ✅ **NPM-compatible** (can use npm packages)

**Cons:**
- ❌ Newer ecosystem (some edge cases)
- ❌ Requires separate installation
- ❌ Some tooling might not support it yet

## Yarn

Yarn is a popular alternative to NPM with focus on performance and security.

### Installation

```bash
# Using npm
npm install -g yarn

# Using Homebrew (macOS)
brew install yarn

# Using Chocolatey (Windows)  
choco install yarn
```

### Common Commands

```bash
# Install dependencies
yarn install

# Install a package
yarn add <package-name>
yarn add --dev <package-name>  # dev dependency

# Run scripts
yarn start:dev
yarn build:prod
yarn test

# Database operations
yarn db:push
yarn db:seed
yarn db:studio

# Code quality
yarn lint
yarn lint:fix
```

### Pros and Cons

**Pros:**
- ✅ Fast installation and caching
- ✅ Deterministic installs (lockfile)
- ✅ Good workspace support (monorepos)
- ✅ Large community and ecosystem
- ✅ Security features (license checking)

**Cons:**
- ❌ Requires separate installation
- ❌ Can be memory intensive
- ❌ Occasional compatibility issues

## Bun

Bun is a modern JavaScript runtime and package manager focused on speed and performance.

### Installation

```bash
# Using curl
curl -fsSL https://bun.sh/install | bash

# Using npm
npm install -g bun

# Using Homebrew (macOS)  
brew tap oven-sh/bun
brew install bun

# Using Scoop (Windows)
scoop install bun
```

### Common Commands

```bash
# Install dependencies
bun install

# Install a package
bun add <package-name>
bun add --dev <package-name>  # dev dependency

# Run scripts (optimized for Bun)
bun run start:dev:bun
bun run build:bun
bun test

# Database operations
bun run db:push
bun run db:seed  
bun run db:studio

# Code quality
bun run lint
bun run lint:fix
```

### Pros and Cons

**Pros:**
- ✅ **Extremely fast** (written in Zig, up to 25x faster)
- ✅ **Built-in runtime** (can run JavaScript/TypeScript directly)
- ✅ **Built-in bundler and transpiler**
- ✅ **Hot reloading** out of the box
- ✅ **Small footprint**

**Cons:**
- ❌ **Newer ecosystem** (potential compatibility issues)
- ❌ **Still in active development** (some features unstable)
- ❌ **Limited Windows support** (improving)
- ❌ **Smaller community**

## Performance Comparison

Based on typical operations for this project:

| Operation | NPM | PNPM | Yarn | Bun |
|-----------|-----|------|------|-----|
| **Cold Install** | ~45s | ~20s | ~30s | ~15s |
| **Cached Install** | ~30s | ~8s | ~15s | ~5s |
| **Adding Package** | ~10s | ~5s | ~7s | ~3s |
| **Running Tests** | ~8s | ~8s | ~8s | ~3s |
| **Building** | ~25s | ~25s | ~25s | ~8s |

*Times are approximate and may vary based on system specifications.*

## Migration Between Package Managers

### From NPM to PNPM

```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Install pnpm
npm install -g pnpm

# Install dependencies with pnpm
pnpm install
```

### From Yarn to PNPM  

```bash
# Remove node_modules and yarn.lock
rm -rf node_modules yarn.lock

# Install pnpm
npm install -g pnpm

# Install dependencies with pnpm
pnpm install
```

### From any PM to Bun

```bash
# Remove node_modules and existing lock files
rm -rf node_modules package-lock.json yarn.lock pnpm-lock.yaml

# Install bun
curl -fsSL https://bun.sh/install | bash

# Install dependencies with bun
bun install
```

## Troubleshooting

### Lock File Conflicts

If you encounter lock file conflicts:

```bash
# Delete all lock files and node_modules
rm -rf node_modules package-lock.json yarn.lock pnpm-lock.yaml bun.lockb

# Choose one package manager and reinstall
pnpm install  # or npm install, yarn install, bun install
```

### Dependency Issues

1. **Clear cache:**
   ```bash
   npm cache clean --force     # NPM
   pnpm store prune           # PNPM  
   yarn cache clean          # Yarn
   bun pm cache rm           # Bun
   ```

2. **Reinstall from scratch:**
   ```bash
   rm -rf node_modules
   <package-manager> install
   ```

## CI/CD Considerations

For CI/CD pipelines, consider:

1. **NPM**: Most reliable for CI/CD, supported everywhere
2. **PNPM**: Faster builds, but ensure CI/CD platform supports it
3. **Yarn**: Good for CI/CD, widely supported
4. **Bun**: Very fast, but check CI/CD platform compatibility

Example GitHub Actions:

```yaml
# For PNPM
- uses: pnpm/action-setup@v2
  with:
    version: 8

# For Bun  
- uses: oven-sh/setup-bun@v1
  with:
    bun-version: latest
```

## Recommendations

**For Beginners**: Start with **NPM** - it's the most stable and widely documented.

**For Performance**: Use **PNPM** - best balance of speed, disk efficiency, and stability.

**For Cutting Edge**: Try **Bun** - fastest performance but consider compatibility.

**For Teams**: **PNPM** or **Yarn** - both offer excellent deterministic installs and team workflows.

**For Monorepos**: **PNPM** or **Yarn** - both have excellent workspace support.

---

> **Note**: You can switch between package managers at any time. Just make sure to commit your lock files and coordinate with your team to avoid conflicts.