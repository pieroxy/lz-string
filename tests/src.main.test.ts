import { describe } from "vitest";
import LZString from "../src";
import { runAllTests } from "./testFunctions";

describe("src/ (uncompiled)", () => {
    runAllTests(LZString);
});
