/*
 * @Author: Hongzf
 * @Date: 2022-07-22 09:10:19
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-07-22 10:56:11
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
