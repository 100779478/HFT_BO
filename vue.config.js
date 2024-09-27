const path = require('path');
const {defineConfig} = require('@vue/cli-service');
const {DefinePlugin} = require('webpack');
const fs = require('fs');
const packageJson = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');
module.exports = defineConfig({
    outputDir: './build/hft-bo-web',
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
        plugins: [
            // new CompressionPlugin({
            //     algorithm: 'gzip', // 使用gzip压缩
            //     test: /\.js$|\.html$|\.css$/, // 匹配文件名
            //     //filename: '[path].gz[query]', // 压缩后的文件名(保持原文件名，后缀加.gz)
            //     minRatio: 1, // 压缩率小于1才会压缩
            //     threshold: 10240, // 对超过10k的数据压缩
            //     deleteOriginalAssets: false, // 是否删除未压缩的源文件，谨慎设置，如果希望提供非gzip的资源，可不设置或者设置为false（比如删除打包后的gz后还可以加载到原始资源文件）
            // }),
            new DefinePlugin({
                'process.env': {
                    VERSION: JSON.stringify(packageJson.version),
                },
            }),
            // {
            //     apply: (compiler) => {
            //         compiler.hooks.done.tap('CreateVersionFile', () => {
            //             const outputPath = compiler.options.output.path;
            //             const versionFilePath = path.join(outputPath, 'version.txt');
            //             // 确保输出路径存在
            //             if (!fs.existsSync(outputPath)) {
            //                 fs.mkdirSync(outputPath, {recursive: true});
            //             }
            //             fs.writeFileSync(versionFilePath, `Version: ${packageJson.version}\n`);
            //         });
            //     },
            // },
        ]
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

        config.module
            .rule("vue")
            .use("iview-loader") // 解决iview组件 忽略前缀i的问题
            .loader("iview-loader")
            .options({
                prefix: false,
            })
            .end();

        // if (process.env.NODE_ENV === 'production') { // 去除console.log输出
        //     config.optimization
        //         .minimizer('terser')
        //         .tap(args => {
        //             Object.assign(args[0].terserOptions.compress, {
        //                 warnings: false, //默认false
        //                 drop_console: true,
        //                 drop_debugger: true, //默认true
        //                 pure_funcs: ['console.log']
        //             })
        //             return args
        //         })
        // }
    },
// devServer: {
//     headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
//     },
// },
})
;
