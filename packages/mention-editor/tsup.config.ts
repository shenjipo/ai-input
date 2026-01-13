import { defineConfig } from 'tsup'

export default defineConfig([
    {
        entry: ['src/index.ts'],
        format: ['esm', 'cjs'],
        ignoreWatch: ['**/*.md'],
        sourcemap: true,
        bundle: true,
        // dts: false,
        dts: true,
        clean: true,
        minify: true,
        outDir: 'dist',
        splitting: false,        // 👈 库模式建议关
        target: 'es2018',        // 👈 CLI 4 安全
    },
])
