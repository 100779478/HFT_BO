const {defineConfig} = require('@vue/cli-service')
const TerserPlugin = require('terser-webpack-plugin');
module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,
    configureWebpack: {
        optimization: {
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        ecma: 6,
                        compress: {
                            drop_console: true,
                            drop_debugger: true,
                        },
                        output: {
                            comments: false,
                        },
                    },
                }),
            ],
        },
    },
    // devServer: {
    //     headers: {
    //         'Access-Control-Allow-Origin': '*',
    //         'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    //     },
    // },
})
