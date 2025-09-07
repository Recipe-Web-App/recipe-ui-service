import '@testing-library/jest-dom';

// Polyfill TextEncoder/TextDecoder for Node.js environment
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Web Crypto API for tests
const mockCrypto = {
  subtle: {
    digest: jest.fn(() => Promise.resolve(new ArrayBuffer(32))),
  },
};

Object.defineProperty(global, 'crypto', {
  value: mockCrypto,
  writable: true,
});
