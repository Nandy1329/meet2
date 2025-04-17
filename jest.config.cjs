module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest', // Transform JavaScript, JSX, TypeScript, and TSX files using Babel
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'], // Include TypeScript extensions if applicable
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'], // Ensure this file exists and is correctly configured
  transformIgnorePatterns: ['/node_modules/(?!.*\\.mjs$)'], // Allow transformation of modern ES modules
};