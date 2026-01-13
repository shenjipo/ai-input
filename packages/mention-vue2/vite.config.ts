import * as path from 'path'
import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import dts from 'vite-plugin-dts'

export default defineConfig({
    plugins: [
        vue2(),
        dts({
            entryRoot: 'src',
            outDir: 'dist',
            tsconfigPath: './tsconfig.json',
            insertTypesEntry: true,
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        },
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            formats: ['es', 'cjs'],
            fileName: (format) => {
                if (format === 'es') return 'index.esm.js'
                if (format === 'cjs') return 'index.cjs.js'
                return 'index.js'
            },
        },

        rollupOptions: {
            external: [
                'vue',
                '@shenjipo/mention-editor',
                '@floating-ui/dom',
                'vue-demi',
            ],
        },
        cssCodeSplit: true,            // 生成独立 css
        emptyOutDir: true,
    }
})
