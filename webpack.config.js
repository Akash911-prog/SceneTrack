// webpack.config.js
const path = require('path');
const webpack = require('webpack'); // Import webpack to use its BannerPlugin

module.exports = {
    mode: 'production', // Use 'production' mode for optimized output
    target: 'node', // Essential for Node.js CLI tools
    entry: './src/index.ts', // Your main CLI entry file
    output: {
        filename: 'cli-tool.js', // The name of your bundled executable file
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.ts$/, // Rule to process TypeScript files
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'], // Resolve .ts and .js extensions
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: '#!/usr/bin/env node', // Add the shebang at the top of the file
            raw: true,
            entryOnly: true,
        }),
    ],
};
