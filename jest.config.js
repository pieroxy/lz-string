module.exports = {
	moduleFileExtensions: [
		'js',
		'json',
	],
	transform: {
		'^.+\\.js$': 'babel-jest',
	},
	transformIgnorePatterns: [
		'/node_modules/',
	],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	testMatch: [
		'**/*.spec.(js)',
	],
};
