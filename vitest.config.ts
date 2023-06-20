/// <reference types="vitest" />
import { defineConfig } from "vite"

import typescript from "@rollup/plugin-typescript"
import { resolve } from "path"
import { typescriptPaths } from "rollup-plugin-typescript-paths"
import tsconfigPaths from "vite-tsconfig-paths"
import dts from "vite-plugin-dts"
import eslint from "vite-plugin-eslint"

export default defineConfig({
  base: "./",
  plugins: [
    tsconfigPaths(),
    eslint(),
    dts({ rollupTypes: true })
  ],
  resolve: {
    preserveSymlinks: true,
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "./src"),
      },
    ],
    extensions: [".ts"]
  },
  test: {},
  build: {
    manifest: true,
    minify: true,
    reportCompressedSize: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: (format) => `index.${format}.js`,
      name: "Jackal.js"
    },
    rollupOptions: {
      external: [],
      plugins: [
        typescriptPaths({
          absolute: false,
        }),
        typescript({ tsconfig: "./tsconfig.json" }),
      ],
    },
  },
})
