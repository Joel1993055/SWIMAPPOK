/**
 * Test configuration and constants
 */
export const TEST_CONFIG = {
  // Base URL for testing
  BASE_URL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',

  // Test user credentials
  TEST_USER: {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  },

  // Test data
  TEST_DATA: {
    sampleText: 'This is a test message',
    sampleEmail: 'test@example.com',
    sampleName: 'Test User',
  },

  // Timeouts
  TIMEOUTS: {
    short: 5000,
    medium: 10000,
    long: 30000,
  },

  // API endpoints
  API_ENDPOINTS: {
    auth: '/api/auth',
    data: '/api/data',
    users: '/api/users',
  },
} as const;
