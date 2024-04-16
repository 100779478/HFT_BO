const path = require('path');
const {defineConfig} = require('@vue/cli-service');
const TerserPlugin = require('terser-webpack-plugin');
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
module.exports = defineConfig({
    productionSourceMap: false,
    transpileDependencies: true,
    lintOnSave: false,
    configureWebpack: {
        optimization: {
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        ecma: 2016, // 使用ES6语法
                        compress: {
                            modules: true, // 开启模块压缩
                        },
                        output: {
                            comments: false, // 去除注释
                        },
                    },
                }),
            ],
            splitChunks: {
                chunks: 'async', // 默认只分割异步引入代码块,可配置为  all
                cacheGroups: { // splitChunks就是根据cacheGroups去拆分模块的
                    vendors: {
                        // 表示只筛选从node_modules文件夹下引入的模块，所以node_modules下的第三方模块才会被拆分出来。
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10 // 权重设置
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true
                    }
                }
            }
        },
        plugins: []
    },
    chainWebpack: config => {
        config.plugin('speed-measure-webpack-plugin')
            .use(SpeedMeasureWebpackPlugin);

        config.module.rule('vue')
            .use('thread-loader')
            .loader('thread-loader')
            .before('thread-loader');

        config.module.rule('js')
            .test(/\.jsx?$/)
            .exclude
            .add(file => (
                /node_modules/.test(file) &&
                !/\.vue\.js/.test(file)
            ))
            .end()
            .use('babel-loader')
            .loader('babel-loader')
            .options({
                cacheDirectory: true
            });

        config.optimization.splitChunks({
            chunks: 'all',
            cacheGroups: {
                libs: {
                    name: 'chunk-libs',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: 'initial'
                },
            }
        })

    },
// devServer: {
//     headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
//     },
// },
})
;
