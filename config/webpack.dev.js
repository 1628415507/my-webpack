/*
 * @Author: Hongzhifeng
 * @Date: 2022-06-28 15:47:36
 * @LastEditors: Hongzhifeng
 * @LastEditTime: 2022-07-20 13:42:56
 * @Description:Webpack的基本配置：开发模式
 */
// 开发环境运行指令：npx webpack serve --config ./config/webpack.dev.js
const path = require('path'); // Node.js的核心模块，专门用来处理文件路径
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 开启多进程(我们目前打包的内容都很少，所以因为启动进程开销原因，使用多进程打包实际上会显著的让我们打包时间变得很长。所以当项目大的时候才会感觉明显提升时间)
const os = require('os'); // nodejs核心模块，直接使用
const threads = os.cpus().length; // cpu核数

module.exports = {
    // 【一】入口
    // 相对路径和绝对路径都行
    entry: './src/main.js',
    // 【二】输出
    output: {
        // path: 文件输出目录，必须是绝对路径
        // path.resolve()方法返回一个绝对路径
        // __dirname 当前文件的文件夹绝对路径
        path: undefined, //因为开发模式没有输出，所以不需要指定输出路径，path.resolve(__dirname, '../dist'),
        // filename: 入口文件打包输出的文件名
        filename: 'static/js/main.js' //js文件放置于js文件下
        // 开启devServer模式下clean可以不需要，因为devServer不会打包到dist
        // clean原理,在打包前,将path整个目录内容清空,再进行打包（wep4需要用插件）
        // clean: true // 自动将上次打包目录资源清空
    },
    // 【三】 加载器
    module: {
        rules: [
            // loader的配置
            {
                // 打包时每个文件都会经过所有 loader 处理，虽然因为 `test` 正则原因实际没有处理上，但是都要过一遍。比较慢。
                // oneOf：只要能匹配上一个 loader, 剩下的就不匹配了。
                oneOf: [
                    // loader官方文档：https://webpack.docschina.org/loaders/
                    // loader作用：帮助webpack识别不能识别的语言，如css等
                    // 1.处理样式
                    // ① css-loader
                    {
                        test: /\.css$/, // 用来匹配 .css 结尾的文件
                        // use 数组里面 Loader 执行顺序是从右到左，从下到上
                        use: ['style-loader', 'css-loader']
                    },
                    // ② less-loader
                    {
                        test: /\.less$/,
                        // loader:'xxx',//只能写一个，use可以多个
                        use: [
                            //use可以多个
                            'style-loader',
                            'css-loader',
                            'less-loader' // 将less编译成css文件
                        ]
                    },
                    // ③ sass-loader
                    {
                        test: /\.s[ac]ss$/,
                        use: [
                            'style-loader',
                            'css-loader',
                            'sass-loader' // 将sass编译成css文件
                        ]
                    },
                    // ④ stylus-loader
                    // {
                    //     test: /\.styl$/,
                    //     use: [
                    //         'style-loader',
                    //         'css-loader',
                    //         'stylus-loader' // 将stylus编译成css文件
                    //     ]
                    // }
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
                        // exclude: /node_modules/, // 排除node_modules代码不编译，提升打包性能
                        include: path.resolve(__dirname, '../src'), // 也可以用包含,只处理src下的文件，其他文件不处理，提升编译性能
                        // loader: 'babel-loader',
                        // // 也可以写到babel.config.js中，方便修改
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
                                    cacheCompression: false, // 关闭缓存文件压缩，不压缩缓存文件
                                    plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积,模块越多作用越明显
                                }
                            }
                        ]
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
            exclude: 'node_modules', // 默认值
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
        })
    ],
    // 【六】开发服务器：使用devServer的话开发指令需要用：npx webpack serve
    // 自动监测代码变化，自动进行编译（不会打包到dist，是在内存中临时打包的）
    devServer: {
        host: 'localhost', // 启动服务器域名
        port: '3000', // 启动服务器端口号
        open: true, // 是否自动打开浏览器
        hot: true // 开启HMR功能（只能用于开发环境，生产环境不需要了
    },
    // 【五】模式
    mode: 'development', // 开发模式
    devtool: 'cheap-module-source-map'
};
