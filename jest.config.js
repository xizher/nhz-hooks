/* eslint-disable no-undef */
module.exports = {
  preset: 'rollup-jest',
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '/dist',
    '/build',
  ],
  testEnvironment: 'jsdom'
}
