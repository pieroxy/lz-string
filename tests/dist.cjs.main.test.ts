import { describe } from "vitest";
import { LZString } from "../dist/index.cjs";
import { runAllTests } from "./testFunctions";

describe("dist/index.cjs (commonjs)", () => {
    runAllTests(LZString);
});
