/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { defineConfig } from "vite";
import bin from "vite-plugin-bin";
import dts from "vite-plugin-dts";
import eslint from "vite-plugin-eslint";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths(), dts({ rollupTypes: true }), eslint(), bin()],
    build: {
        minify: true,
        reportCompressedSize: true,
        sourcemap: true,
        lib: {
            entry: "src/cli.ts",
            fileName: "cli",
        },
        outDir: "bin",
        rollupOptions: {
            external: ["child_process", "events", "fs", "path", "process"],
            output: [
                {
                    format: "cjs",
                    name: "LZString",
                    entryFileNames: "[name].cjs",
                },
            ],
        },
    },
});
