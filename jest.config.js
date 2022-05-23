/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  projects: [{
      displayName: "non-ui-test",
      preset: 'ts-jest',
      testEnvironment: 'node',
      testPathIgnorePatterns: ["<rootDir>/src/uicomponents/"]
  }, 
  {
      displayName: "ui-test",
      testMatch: ["<rootDir>/src/uicomponents/**/?(*.)+(spec|test).[jt]s?(x)"],
      preset: 'ts-jest',
      testEnvironment:'jsdom',
      moduleNameMapper: { 
	  "\\.(css|less)$": "<rootDir>/src/uicomponents/__modules__/styleMock.ts"
      },
  }]
};
