/// <reference types="vitest" />
import { parse, relative, resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import eslint from "vite-plugin-eslint";
import tsconfigPaths from "vite-tsconfig-paths";

const root = resolve(__dirname, "src");

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
            output: [
                {
                    format: "cjs",
                    name: "LZString",
                    entryFileNames: "[name].cjs",
                },
                {
                    format: "es",
                    chunkFileNames: "[name].js",
                    manualChunks: (id: string) => {
                        const { dir, name } = parse(relative(root, id));

                        // If it's in node_modules then don't export
                        return dir.startsWith(".") ? null : name || "common";
                    },
                },
                {
                    format: "umd",
                    name: "LZString",
                    entryFileNames: "[name].[format].js",
                },
            ],
        },
    },
});
