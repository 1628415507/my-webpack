/*
 * @Author: Hongzf
 * @Date: 2022-07-21 16:58:50
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-07-22 13:51:27
 * @Description:合并生产环境与开发环境配置
 */
// webpack.prod.js
const path = require('path');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 【生产环境配置】
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //提取css成单独文件
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); //css压缩
const TerserWebpackPlugin = require('terser-webpack-plugin');
// 图片压缩
// npm i image-minimizer-webpack-plugin imagemin -D
// 无损压缩（需要用镜像cnpm下载）：cnpm install imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo -D
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin'); // 将public下面的资源复制到dist目录去（除了index.html）
// 【vue所需配置】
const { VueLoaderPlugin } = require('vue-loader');
const { DefinePlugin } = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';
// 返回处理样式loader函数
const getStyleLoaders = preProcessor => {
    return [
        isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: [
                        'postcss-preset-env' // 能解决大多数样式兼容性问题
                    ]
                }
            }
        },
        preProcessor
    ].filter(Boolean);
};

module.exports = {
    entry: './src/main.js',
    output: {
        path: isProduction ? path.resolve(__dirname, '../dist') : undefined,
        filename: isProduction ? 'static/js/[name].[contenthash:10].js' : 'static/js/[name].js',
        chunkFilename: isProduction ? 'static/js/[name].[contenthash:10].chunk.js' : 'static/js/[name].chunk.js',
        assetModuleFilename: 'static/js/[hash:10][ext][query]',
        clean: true
    },
    module: {
        rules: [
            {
                // 用来匹配 .css 结尾的文件
                test: /\.css$/,
                // use 数组里面 Loader 执行顺序是从右到左
                use: getStyleLoaders()
            },
            {
                test: /\.less$/,
                use: getStyleLoaders('less-loader')
            },
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoaders('sass-loader')
            },
            {
                test: /\.styl$/,
                use: getStyleLoaders('stylus-loader')
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024 // 小于10kb的图片会被base64处理
                    }
                }
            },
            {
                test: /\.(ttf|woff2?)$/,
                type: 'asset/resource'
            },
            {
                test: /\.(jsx|js)$/,
                include: path.resolve(__dirname, '../src'),
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    cacheCompression: false,
                    plugins: [
                        // "@babel/plugin-transform-runtime" // presets中包含了
                    ]
                }
            },
            // vue-loader不支持oneOf
            {
                test: /\.vue$/,
                loader: 'vue-loader', // 内部会给vue文件注入HMR功能代码
                options: {
                    // 开启缓存
                    cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/vue-loader')
                }
            }
        ]
    },
    plugins: [
        new ESLintWebpackPlugin({
            context: path.resolve(__dirname, '../src'),
            exclude: 'node_modules',
            cache: true,
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache')
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html')
        }),
        isProduction &&
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, '../public'),
                        to: path.resolve(__dirname, '../dist'),
                        toType: 'dir',
                        noErrorOnMissing: true,
                        globOptions: {
                            ignore: ['**/index.html']
                        },
                        info: {
                            minimized: true
                        }
                    }
                ]
            }),
        isProduction &&
            new MiniCssExtractPlugin({
                filename: 'static/css/[name].[contenthash:10].css',
                chunkFilename: 'static/css/[name].[contenthash:10].chunk.css'
            }),
        new VueLoaderPlugin(),
        new DefinePlugin({
            __VUE_OPTIONS_API__: 'true',
            __VUE_PROD_DEVTOOLS__: 'false'
        })
    ].filter(Boolean),
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
    optimization: {
        minimize: isProduction, //判断是否需要压缩
        // 压缩的操作
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserWebpackPlugin(),
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminGenerate,
                    options: {
                        plugins: [
                            ['gifsicle', { interlaced: true }],
                            ['jpegtran', { progressive: true }],
                            ['optipng', { optimizationLevel: 5 }],
                            [
                                'svgo',
                                {
                                    plugins: [
                                        'preset-default',
                                        'prefixIds',
                                        {
                                            name: 'sortAttrs',
                                            params: {
                                                xmlnsOrder: 'alphabetical'
                                            }
                                        }
                                    ]
                                }
                            ]
                        ]
                    }
                }
            })
        ],
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: {
            name: entrypoint => `runtime~${entrypoint.name}`
        }
    },
    resolve: {
        extensions: ['.vue', '.js', '.json']
    },
    devServer: {
        host: 'localhost',
        port: 3000,
        open: true,
        hot: true, // 开启HMR
        historyApiFallback: true // 解决前端路由刷新404问题
    }
};
