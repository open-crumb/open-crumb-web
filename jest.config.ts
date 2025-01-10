import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
	dir: "./",
});

const config: Config = {
	testEnvironment: "jest-environment-jsdom",
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	testMatch: ["**/__tests__/**/*.test.{ts,tsx}"],
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default createJestConfig(config);
