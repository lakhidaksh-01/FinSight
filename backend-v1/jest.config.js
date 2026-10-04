export default {
  testEnvironment: "node",
  transform: {},
  testMatch: ["**/tests/**/*.test.js"],
  maxWorkers: 1,
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"]
};