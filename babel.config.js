/*
 * @Author: Hongzhifeng
 * @Date: 2022-07-02 16:57:43
 * @LastEditors: Hongzhifeng
 * @LastEditTime: 2022-07-21 09:46:36
 * @Description: babel配置
 */
module.exports = {
    // 智能预设：能够编译ES6语法
    presets: [
        [
            '@babel/preset-env', //: 一个智能预设，允许您使用最新的 JavaScript。
            // 按需加载core-js的polyfill
            {
                useBuiltIns: 'usage', //按需加载
                // babel 能将 ES6 的一些语法进行编译转换，比如箭头函数、...运算符等。
                // 但是如果是 async 函数、promise 对象、数组的一些方法（includes）等，它没办法处理。
                // 所以此时我们 js 代码仍然存在兼容性问题，一旦遇到低版本浏览器会直接报错。所以我们想要将 js 兼容性问题彻底解决，可以使用corejs
                corejs: { version: '3', proposals: true }
            }
        ]
    ]
};
