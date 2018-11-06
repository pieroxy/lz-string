module.exports = {
  roots: [
    "<rootDir>/src/"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__test__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  "testPathIgnorePatterns": [
    "node_modules/*"
  ],
};
