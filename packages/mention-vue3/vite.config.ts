import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
    plugins: [
        vue(),
        dts({
            entryRoot: 'src',
            outDir: 'dist',
            insertTypesEntry: true, // ⭐ 自动生成 dist/index.d.ts
            copyDtsFiles: true,
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            formats: ['es'],
            fileName: () => 'index.esm.js',
        },

        rollupOptions: {
            external: [
                'vue',
                '@shenjipo/mention-editor',
                '@floating-ui/vue',
            ],

        },
        cssCodeSplit: true,            // 生成独立 css
        emptyOutDir: true,
    }
})
