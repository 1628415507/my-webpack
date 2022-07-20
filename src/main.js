/*
 * @Author: Hongzhifeng
 * @Date: 2022-06-28 15:36:36
 * @LastEditors: Hongzhifeng
 * @LastEditTime: 2022-07-05 16:52:52
 * @Description:
 */
import count from './js/count';
import sum from './js/sum';

console.log(count(2, 1));
console.log(sum(1, 2, 3, 4));

// 想要webpack打包资源，必须引入该资源
import './css/iconfont.css';
import './css/index.css'; // 安装：npm i css-loader style-loader -D
import './less/index.less';
import './sass/index.sass'; //npm i sass-loader sass -D
import './sass/index.scss'; //npm i less-loader -D
// import './stylus/index.styl';

// 检查eslint、babel语法
let result1 = count(2, 1);
console.log(result1);
let result2 = sum(1, 2, 3, 4, 5);
console.log(result2);
// 判断是否支持HMR功能
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
