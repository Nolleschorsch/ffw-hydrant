const webpack = require('webpack');
require('dotenv').config({ path: './.env' });
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    resolve: {
        modules: [path.join(__dirname, 'src'), 'node_modules'],
        alias: {
            react: path.join(__dirname, 'node_modules', 'react'),
        },
        fallback: { "url": require.resolve("url/") },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: [
                    /node_modules/,
                    path.resolve(__dirname, 'public/mockServiceWorker.js'),
                    path.resolve(__dirname, 'public/hydrants_bw.geojson'),
                    path.resolve(__dirname, 'public/hydrants_de.geojson')
                ],
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/index.html',
        }),
        new webpack.DefinePlugin({
            "process.env": JSON.stringify(process.env),
        }),
        new CopyPlugin({
            patterns: [
                {from: "public"}
            ]
        })
    ],
    watchOptions: {
        poll: 1000, // Check for changes every second
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'public')
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        },
        historyApiFallback: true
    }
};