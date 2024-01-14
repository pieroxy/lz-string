/// <reference types="vitest" />
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import eslint from "vite-plugin-eslint";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    base: "./",
    plugins: [tsconfigPaths(), dts({ rollupTypes: true }), eslint()],
    build: {
        minify: true,
        reportCompressedSize: true,
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, "src/main.ts"),
            fileName: "index",
            formats: ["es", "cjs", "umd"],
            name: "LZString",
        },
    },
    test: {},
});
