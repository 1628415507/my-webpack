/*
 * @Author: Hongzhifeng
 * @Date: 2022-07-22 09:10:19
 * @LastEditors: Hongzhifeng
 * @LastEditTime: 2022-07-22 09:13:53
 * @Description:
 */
module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ['plugin:vue/vue3-essential', 'eslint:recommended'],
    parserOptions: {
        parser: '@babel/eslint-parser' //npm i @babel/eslint-parser -D
    }
};
