const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: '../js/scripts/main.js',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'app.js'
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader'
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],  
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader'
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|glb)$/i,
                type: 'asset/resource',
            }
        ]
    },

    resolve: {
        alias: {
            three: path.resolve('./node_modules/three')
        },
        extensions: ['.js', '.ejs', '.json', '.jsx', '.ts', '.tsx', '.css', '.jpg', '.jpeg', '.png', '.obj', '.gif', '.vert', '.frag', '.glb']
    },

    devtool: 'source-map',
    context: __dirname,
    target: 'web',
    devServer: {
        proxy: {
            '/api': 'http://localhost:3000'
        },
        compress: false,
        historyApiFallback: false,
        hot: true
    },

    plugins: [new HtmlWebpackPlugin({
        template: '../index.html',
    })]
};