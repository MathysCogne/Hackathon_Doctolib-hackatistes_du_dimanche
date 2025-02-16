import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts', 'src/server.ts', 'src/start.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake: true,
    minify: false,
    target: 'node16',
    external: [
        '@elizaos/core',
        '@anush008/tokenizers',
        'twilio',
        'openai',
        'ws',
        'express',
        'cors',
        'dotenv',
        'fs'
    ]
}); 