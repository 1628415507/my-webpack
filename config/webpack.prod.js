/*
 * @Author: Hongzhifeng
 * @Date: 2022-06-28 15:47:36
 * @LastEditors: Hongzhifeng
 * @LastEditTime: 2022-07-06 10:45:39
 * @Description:Webpack的基本配置：生产模式
 */
// 生产运行指令：npx webpack --config ./config/webpack.prod.js
const path = require('path'); // Node.js的核心模块，专门用来处理文件路径
// 插件
const ESLintWebpackPlugin = require('eslint-webpack-plugin'); //1.ESLint插件
const HtmlWebpackPlugin = require('html-webpack-plugin'); //2.html插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 3.webpack5中的新插件，提取css成单独的文件:npm i mini-css-extract-plugin -D
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // 4.压缩css代码：npm i css-minimizer-webpack-plugin -D// html默认会压缩
// 开启多进程(我们目前打包的内容都很少，所以因为启动进程开销原因，使用多进程打包实际上会显著的让我们打包时间变得很长。所以当项目大的时候才会感觉明显提升时间)
const os = require('os'); // nodejs核心模块，直接使用
const threads = os.cpus().length; // cpu核数
const TerserPlugin = require('terser-webpack-plugin');
// 提取公共的样式loader
const getStyleLoaders = preProcessor => {
    return [
        // 'style-loader',//style-loader会动态创建style标签
        MiniCssExtractPlugin.loader,
        'css-loader',
        // postcss-loader要写在css-loader之后，less-loader之前
        // 我们可以在 `package.json` 文件中添加 `browserslist` 来控制样式的兼容性做到什么程度。
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
    ].filter(Boolean); //filter(Boolean)过滤undefined的样式
};

module.exports = {
    // 【一】入口
    // 相对路径和绝对路径都行
    entry: './src/main.js',
    // 【二】输出
    output: {
        // path: 文件输出目录，必须是绝对路径
        // path.resolve()方法返回一个绝对路径
        // __dirname 当前文件的文件夹绝对路径
        path: path.resolve(__dirname, '../dist'),
        // filename: 入口文件打包输出的文件名
        filename: 'static/js/main.js', //js文件放置于js文件下
        // clean原理,在打包前,将path整个目录内容清空,再进行打包（wep4需要用插件）
        clean: true // 自动将上次打包目录资源清空
    },
    // 【三】 加载器
    module: {
        rules: [
            // loader官方文档：https://webpack.docschina.org/loaders/
            // loader作用：帮助webpack识别不能识别的语言，如css等
            // 1.处理样式
            // ① css-loader
            {
                test: /\.css$/, // 用来匹配 .css 结尾的文件
                // use 数组里面 Loader 执行顺序是从右到左，从下到上
                use: getStyleLoaders()
            },
            // ② less-loader
            {
                test: /\.less$/,
                // loader:'xxx',//只能写一个，use可以多个
                use: getStyleLoaders('less-loader') // less-loader：将less编译成css文件
            },
            // ③ sass-loader
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoaders('sass-loader') // 将sass编译成css文件
            },
            // ④ stylus-loader
            {
                test: /\.styl$/,
                use: getStyleLoaders('stylus-loader') // 将stylus编译成css文件
            },
            // 2.处理图片
            // 过去在 Webpack4 时，我们处理图片资源通过 `file-loader` 和 `url-loader` 进行处理
            // 现在 Webpack5 已经将两个 Loader 功能内置到 Webpack 里了，我们只需要简单配置即可处理图片资源
            {
                test: /\.(png|jpe?g|gif|webp)$/, //匹配图片格式
                type: 'asset', //设置type: 'asset'
                parser: {
                    dataUrlCondition: {
                        // 小于10kb的图片会被base64处理打包到dist,大于10k的话不会打包到dist,而是发请求获取
                        // 优点，减少请求次数，缺点：体积会变大
                        maxSize: 10 * 1024 //最大10kb
                    }
                },
                generator: {
                    // 输出图片名称,存放到dist/static/images文件下下
                    // [hash:10] hash值取前10位,为图片生成唯一id
                    filename: 'static/images/[hash:10][ext][query]'
                }
            },
            // 3.处理字体图标等其他资源
            {
                test: /\.(ttf|woff2?|map4|map3|avi)$/,
                type: 'asset/resource', //只写asset会转成base54，加上resource会对文件原封不动地输出
                generator: {
                    filename: 'static/media/[hash:8][ext][query]' //输出名称
                }
            },
            // 4.处理js：babel-loader
            {
                test: /\.js$/,
                // exclude: /node_modules/, // 排除node_modules的js文件（这些文件的代码不编译），提升打包性能
                include: path.resolve(__dirname, '../src'), // 也可以用包含,只处理src下的文件，其他文件不处理，提升打包性能
                // loader: 'babel-loader',
                // // 写到babel.config.js中，方便修改
                // options: {
                //     // presets: ['@babel/preset-env'], //: 一个智能预设，允许您使用最新的 JavaScript。
                //     cacheDirectory: true, // 开启babel编译缓存
                //     cacheCompression: false // 缓存文件不要压缩
                // },
                use: [
                    // 开启多进程
                    {
                        loader: 'thread-loader', // 开启多进程
                        options: {
                            workers: threads // 进程数量
                        }
                    },
                    // babel-loader
                    {
                        loader: 'babel-loader',
                        // options也可以写到babel.config.js中，方便修改
                        options: {
                            // presets: ['@babel/preset-env'], //: 一个智能预设，允许您使用最新的 JavaScript。
                            cacheDirectory: true, // 开启babel编译缓存
                            cacheCompression: false // 关闭缓存文件压缩，不压缩缓存文件
                        }
                    }
                ]
            }
        ]
    },
    // 【四】 插件
    plugins: [
        // 1.配置eslint插件
        new ESLintWebpackPlugin({
            // 指定检查文件的根目录
            context: path.resolve(__dirname, '../src'),
            // 配置写在项目根目录下的.eslintrc.js和.eslintignore中，系统会自动识别这两个文件
            exclude: 'node_modules', // 排除node_modules的js文件（这些文件的代码不编译），提升打包性能
            cache: true, // 开启缓存
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache'), // 缓存目录
            threads // 开启多进程和设置进程数量
        }),
        // 2.配置html插件
        // 该插件将为你生成一个 HTML5 文件， 在 body 中使用 `script` 标签引入你所有 webpack 生成的 bundle。 只需添加该插件到你的 webpack 配置中
        // npm i html-webpack-plugin -D ：https://webpack.docschina.org/plugins/html-webpack-plugin/
        new HtmlWebpackPlugin({
            // 以 public/index.html 为模板创建文件
            // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
            template: path.resolve(__dirname, '../public/index.html') //设置源文件
        }),
        // 3.提取css成单独文件
        new MiniCssExtractPlugin({
            filename: 'static/css/main.css' // 定义输出文件名和目录
        })
        // new CssMinimizerPlugin() // 4.css压缩也可以写到optimization.minimizer里面，效果一样的
    ],
    // 优化
    optimization: {
        minimize: true,
        // 压缩的操作(一般生产模式才需要)：minimizer允许通过提供一个或多个定制过的 TerserPlugin 实例，覆盖默认压缩工具
        minimizer: [
            // 4.压缩css
            new CssMinimizerPlugin(),
            // 5.压缩js，当生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
            new TerserPlugin({
                parallel: threads // 开启多进程和设置进程数量
            })
        ]
    },
    // devServer: {},// 生产模式不需要devServer
    // 【五】模式
    mode: 'production', // 生产模式
    devtool: 'source-map'
};
