import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

// Polyfill TextEncoder/TextDecoder for Node.js environment
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Web Crypto API for tests
// Note: This mock must be applied before any modules that use crypto are imported
let uuidCounter = 0;
const mockRandomUUID = jest.fn(() => {
  uuidCounter++;
  return `test-uuid-${uuidCounter}`;
});

const mockCrypto = {
  subtle: {
    digest: jest.fn(() => Promise.resolve(new ArrayBuffer(32))),
  },
  randomUUID: mockRandomUUID,
  getRandomValues: jest.fn(arr => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  }),
};

// Use Object.defineProperty on both global and globalThis to ensure coverage
Object.defineProperty(global, 'crypto', {
  value: mockCrypto,
  writable: true,
  configurable: true,
});

Object.defineProperty(globalThis, 'crypto', {
  value: mockCrypto,
  writable: true,
  configurable: true,
});
