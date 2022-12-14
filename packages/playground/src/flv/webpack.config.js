const path = require('path')
const webpack = require('webpack/types')
const TerserPlugin = require('terser-webpack-plugin/dist/cjs')
const pkg = require('./package.json')

const config = {
    entry: './src/index.js',
    output: {
        filename: 'flv.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'flvjs',
        libraryTarget: 'umd',
        environment: {
            arrowFunction: false,
            bigIntLiteral: false,
            const: false,
            destructuring: false,
            dynamicImport: false,
            forOf: false,
            module: false,
        }
    },

    devtool: 'source-map',

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        fallback: {
            fs: false,
            path: false,
        }
    },

    plugins: [
        new webpack.DefinePlugin({
            __VERSION__: JSON.stringify(pkg.version),
        }),
    ],

    optimization: {
        minimizer: [
            new TerserPlugin({
                extractComments: false,
            }),
        ]
    },

    module: {
        rules: [
            {
                test: /\.(ts|js)$/,
                use: 'ts-loader',
                exclude: /node-modules/,
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                use: 'source-map-loader',
            }
        ],
    }
}

module.exports = (env, argv) => {
    if (argv.mode === 'production')
        config.output.filename = 'flv.min.js'

    return config
}
