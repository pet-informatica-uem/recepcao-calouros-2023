const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    mode: "production",
    entry: '../js/main.js',
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
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "./"
                        }
                    },
                    "css-loader",
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

    context: __dirname,

    plugins: [new HtmlWebpackPlugin({
        template: '../index.html',
    }),
    new MiniCssExtractPlugin({
        filename: "[contenthash].css",
        chunkFilename: "[contenthash].css"
    })]
};