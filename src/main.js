/*
 * @Author: Hongzhifeng
 * @Date: 2022-06-28 15:36:36
 * @LastEditors: Hongzhifeng
 * @LastEditTime: 2022-07-21 10:16:11
 * @Description:
 */
// 想要webpack打包资源，必须引入该资源
// (五)【core-js】
// import "core-js";// 全部加载
import 'core-js/es/promise'; //按需加载
// 获取配置babel

// ========================================================

// (一) 引入css
import './css/iconfont.css';
import './css/index.css'; // 安装：npm i css-loader style-loader -D
import './less/index.less';
import './sass/index.sass'; //npm i sass-loader sass -D
import './sass/index.scss'; //npm i less-loader -D
// import './stylus/index.styl';

// ========================================================

// (二) 引入js
import count from './js/count';
import sum from './js/sum';

// 检查eslint、babel语法
let result1 = count(2, 1);
console.log('【 (二)检查eslint、babel语法 】', result1);
let result2 = sum(1, 2, 3, 4, 5);
console.log('【 (二)检查eslint、babel语法 】', result2);

// ========================================================

// (三) 判断是否支持HMR功能,以下代码生产模式下会删除
if (module.hot) {
    module.hot.accept('./js/count.js', function (count) {
        const result3 = count(2, 1);
        console.log('【 (三)判断是否支持HMR功能-result1 】-44', result3);
    });
    module.hot.accept('./js/sum.js', function (sum) {
        const result4 = sum(1, 2, 3, 4);
        console.log('【 (三)判断是否支持HMR功能-result2 】-44', result4);
    });
}

// ========================================================

// (四) 测试splitChunks配置的按需加载，动态导入
document.getElementById('splitChunksText_btn').onClick = function () {
    console.log('【测试splitChunks配置的按需加载，动态导入】-42');
    /* eslint不能识别动态导入语法，会对动态导入语法（import）报错，需要修改eslint配置文件
    // webpackChunkName: "math"：这是webpack动态导入模块命名的方式
     "math"将来就会作为[name]的值显示。
    */
    // 测试动态引入
    import(/* webpackChunkName: "math" */ './js/math.js').then(({ mul }) => {
        console.log('【 (四)按需加载，动态导入 】-42', mul(2, 1));
    });
};

// ========================================================

// (五) core-js添加promise代码
/* babel 能将 ES6 的一些语法进行编译转换，比如箭头函数、...运算符等。
   但是如果是 async 函数、promise 对象、数组的一些方法（includes）等，它没办法处理
   所以此时我们 js 代码仍然存在兼容性问题，一旦遇到低版本浏览器会直接报错。
   所以我们想要将 js 兼容性问题彻底解决，
   【解决方式】：
   ① 可以使用core-js（手动按需引入）
   ② babel（自动动按需引入），推荐
*/
// (1)测试core-js手动按需引入
const promise = Promise.resolve();
promise.then(() => {
    console.log('【 (五)-1测试core-js手动按需引入 】-74', 'hello promise');
});
// (2)测试babel自动动按需引入
const arr = [1, 2, 3, 5];
console.log('【 (五)-2测试babel自动动按需引入 】-74', arr.includes(3));
