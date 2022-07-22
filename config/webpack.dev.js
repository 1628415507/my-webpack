const path = require('path');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader'); // vue专用配置Loader插件
const { DefinePlugin } = require('webpack'); //定义环境变量，没有用的话控制台会报错

const getStyleLoaders = preProcessor => {
    return [
        'vue-style-loader', //vue专用
        'css-loader',
        {
            // 处理css兼容性问题
            // 配合package.json中的browserslist来指定兼容性
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: ['postcss-preset-env'] // 能解决大多数样式的兼容性问题
                }
            }
        },
        preProcessor
    ].filter(Boolean);
};

module.exports = {
    // 【一】入口
    entry: './src/main.js',
    // 【二】输出
    output: {
        path: undefined,
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].chunk.js',
        assetModuleFilename: 'static/media/[hash:10][ext][query]'
    },
    // 【三】 加载器
    module: {
        rules: [
            // {
            // 打包时每个文件都会经过所有 loader 处理，虽然因为 `test` 正则原因实际没有处理上，但是都要过一遍。比较慢。
            // oneOf：只要能匹配上一个 loader, 剩下的就不匹配了。
            // oneOf: [
            // 处理样式
            {
                // 用来匹配 .css 结尾的文件
                test: /\.css$/,
                use: getStyleLoaders() // use 数组里面 Loader 执行顺序是从右到左
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
            // 处理图片
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
                test: /\.js$/,
                include: path.resolve(__dirname, '../src'),
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    cacheCompression: false
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
            // ]
            // }
        ]
    },
    // 【四】 插件
    plugins: [
        new ESLintWebpackPlugin({
            context: path.resolve(__dirname, '../src'), // 指定检查文件的根目录
            // 配置写在项目根目录下的.eslintrc.js和.eslintignore中，系统会自动识别这两个文件
            exclude: 'node_modules', // 默认值
            cache: true, // 开启缓存
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache') // 缓存目录
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html')
        }),
        // 将public下面的资源复制到dist目录去（除了index.html）
        // new CopyPlugin({
        //     patterns: [
        //         {
        //             from: path.resolve(__dirname, '../public'), // 将public下面的资源
        //             to: path.resolve(__dirname, '../dist'), //复制到dist目录去（除了index.html）
        //             toType: 'dir',
        //             noErrorOnMissing: true, // 不生成错误
        //             globOptions: {
        //                 // 忽略文件
        //                 ignore: ['**/index.html'] //复制到dist目录去（除了index.html）
        //             },
        //             info: {
        //                 // 跳过terser压缩js
        //                 minimized: true
        //             }
        //         }
        //     ]
        // }),
        // VueLoader
        new VueLoaderPlugin(),
        // cross-env定义的环境变量给打包工具使用
        // DefinePlugin定义环境变量给源代码使用，从而解决vue3页面警告的问题
        new DefinePlugin({
            // 没有定义的话控制台会报警告：Feature flags __VUE_OPTIONS_API__, __VUE_PROD_DEVTOOLS__ are not explicitly defined.
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false
        })
    ],
    // 【五】模式
    mode: 'development',
    devtool: 'cheap-module-source-map', //source-map
    // 【七】开发服务器
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: {
            name: entrypoint => `runtime~${entrypoint.name}.js`
        }
    },
    resolve: {
        extensions: ['.vue', '.js', '.json'] // 自动补全文件扩展名，让vue可以使用
    },
    // 【六】开发服务器：使用devServer的话开发指令需要用：npx webpack serve
    devServer: {
        host: 'localhost', // 启动服务器域名
        port: 3000, // 启动服务器端口号
        open: true, // 是否自动打开浏览器
        hot: true, // 开启HMR功能（只能用于开发环境，生产环境不需要了
        // compress: true,
        historyApiFallback: true // 解决路由刷新404问题
    }
};
