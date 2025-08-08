import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Gets the directory path in a way that works in both Node.js and Jest environments
 */
export function getCurrentDirname(importMetaUrl?: string): string {
  // For Jest environment, return the mocked directory path
  if (process.env.NODE_ENV === 'test') {
    // Try to get the mocked path from global setup
    if ((globalThis as any).import?.meta?.dirname) {
      return (globalThis as any).import.meta.dirname;
    }
    // Fallback for Jest environment
    return path.resolve(process.cwd(), 'src');
  }

  // For Node.js runtime environments
  if (importMetaUrl) {
    return path.dirname(fileURLToPath(importMetaUrl));
  }

  // Try to use import.meta.dirname if available (Node.js 20+)
  try {
    // This will only work in actual Node.js runtime, not Jest
    return import.meta.dirname;
  } catch {
    // Final fallback
    return path.resolve(process.cwd(), 'src');
  }
}