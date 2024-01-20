import { describe } from "vitest";
import { compress, decompress } from ".";
import { runTestSet } from "../__tests__/testFunctions";

describe("base64", () => {
    runTestSet(compress, decompress, "");
});
