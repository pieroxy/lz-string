/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

/// <reference types="vitest" />

import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import eslint from "vite-plugin-eslint";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths(), dts({ rollupTypes: true }), eslint()],
    build: {
        minify: true,
        reportCompressedSize: true,
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            fileName: "index",
        },
        rollupOptions: {
            external: ["fs"],
            output: [
                {
                    format: "cjs",
                    name: "LZString",
                    entryFileNames: "[name].cjs",
                },
                {
                    format: "es",
                    preserveModules: true,
                    entryFileNames: "[name].js",
                },
                {
                    format: "umd",
                    name: "LZString",
                    entryFileNames: "[name].[format].js",
                },
            ],
        },
    },
    test: {
        coverage: {
            include: ["src/**"],
            reporter: ["cobertura", "html", "text"],
        },
        reporters: ["junit", "default"],
        outputFile: "junit-reports/TEST-vitest.xml",
    },
});
