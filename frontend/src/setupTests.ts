import '@testing-library/jest-dom';

// Mock axios globally before tests run
jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
}));