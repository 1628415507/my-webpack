/*
 * @Author: Hongzhifeng
 * @Date: 2022-06-28 15:36:36
 * @LastEditors: Hongzhifeng
 * @LastEditTime: 2022-07-20 18:07:44
 * @Description:
 */
// 想要webpack打包资源，必须引入该资源
// (一) 引入css
import './css/iconfont.css';
import './css/index.css'; // 安装：npm i css-loader style-loader -D
import './less/index.less';
import './sass/index.sass'; //npm i sass-loader sass -D
import './sass/index.scss'; //npm i less-loader -D
// import './stylus/index.styl';
// (二) 引入js
import count from './js/count';
import sum from './js/sum';
console.log(count(2, 1));
console.log(sum(1, 2, 3, 4));

// 检查eslint、babel语法
let result1 = count(2, 1);
console.log(result1);
let result2 = sum(1, 2, 3, 4, 5);
console.log(result2);

// (三) 判断是否支持HMR功能,以下代码生产模式下会删除
if (module.hot) {
    module.hot.accept('./js/count.js', function (count) {
        const result1 = count(2, 1);
        console.log(result1);
    });
    module.hot.accept('./js/sum.js', function (sum) {
        const result2 = sum(1, 2, 3, 4);
        console.log(result2);
    });
}

// (四)测试splitChunks配置的按需加载，动态导入
document.getElementById('splitChunksText_btn').onClick = function () {
    console.log('【测试splitChunks配置的按需加载，动态导入】-42');
    /* eslint不能识别动态导入语法，会对动态导入语法（import）报错，需要修改eslint配置文件
    // webpackChunkName: "math"：这是webpack动态导入模块命名的方式
     "math"将来就会作为[name]的值显示。
    */
    // 测试动态引入
    // import(/* webpackChunkName: "math" */ './js/math.js').then(({ mul }) => {
    //     console.log('【 按需加载，动态导入 】-42', mul(2, 1));
    // });
};
