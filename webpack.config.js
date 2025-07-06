const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
module.exports = {
    mode: 'development',    entry: {
        bundle: './src/js/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        port: 8080,
        hot: true,
        open: false
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            chunks: ['bundle'] // Only include bundle.js in the HTML
        }),
        new MiniCssExtractPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/manifest.json', to: 'manifest.json' },
                { from: 'src/icons', to: 'icons' }
            ]
        }),
    ],
    module: {
        rules: [
                {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: ['image-webpack-loader']
            },
        ],
    },
};
