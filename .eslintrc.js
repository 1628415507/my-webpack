/*
 * @Author: Hongzhifeng
 * @Date: 2022-07-01 21:29:51
 * @LastEditors: Hongzhifeng
 * @LastEditTime: 2022-07-20 16:13:26
 * @Description: eslint 配置
 */
module.exports = {
  // 继承 Eslint 规则
  extends: ["eslint:recommended"],
  env: {
    node: true, // 启用node中全局变量
    browser: true, // 启用浏览器中全局变量
  },
  // import默认必须写在最前面，使用import插件可以解决这个限制
  plugins: ["import"], //解决动态导入import语法报错问题 --> 实际使用eslint-plugin-import（npm i eslint-plugin-import -D）的规则解决的
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",// 指定来源的类型，"script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)
    // "allowImportExportEverywhere": true // 不限制eslint对import使用位置
  },
  rules: {
    "no-var": 2, // 不能使用 var 定义变量
    //就是这一句，禁用import和require必须出现在顶层作用域的验证规则
    // "global-require": 0//这里应该0代表off之前写错了写成了false
  },
};