const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
    compress: true,
    port: 3001,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
            test: /\.(scss|sass)$/, 
            use: [
                "style-loader",
                "css-loader",
                "sass-loader"
                ],
            },
        ],
    },
};