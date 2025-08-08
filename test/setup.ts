// Global test setup
import 'reflect-metadata';
import path from 'path';

// Mock console.log and console.warn to reduce noise in test output
global.console.log = jest.fn();
global.console.warn = jest.fn();

// Mock import.meta for Jest environment
// @ts-ignore
globalThis.import = {
  meta: {
    dirname: path.join(__dirname, '../src'),
    url: `file://${__dirname}`,
  },
};

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_USERNAME = 'test_user';
process.env.DB_PASSWORD = 'test_pass';
process.env.DB_DATABASE = 'test_db';

// Mock utility functions that may have ESM import issues
jest.mock('../src/common/utils.ts', () => ({
  generateHash: jest.fn().mockReturnValue('mocked-hash'),
  validateHash: jest.fn().mockResolvedValue(true),
  getVariableName: jest.fn().mockReturnValue('MockedEnum'),
}), { virtual: true });

// Mock the property decorators that use utils
jest.mock('../src/decorators/property.decorators.ts', () => ({
  ApiEnumProperty: () => () => {},
  ApiBooleanProperty: () => () => {},
  ApiBooleanPropertyOptional: () => () => {},
  ApiUUIDProperty: () => () => {},
  ApiUUIDPropertyOptional: () => () => {},
}), { virtual: true });

// Increase test timeout for E2E tests
jest.setTimeout(30000);