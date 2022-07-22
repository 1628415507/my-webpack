/*
 * @Author: Hongzf
 * @Date: 2022-07-22 10:32:08
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-07-22 10:40:47
 * @Description: 路由配置
 */
// 路由需在main.js中引入应用才会生效
// npm i vue-router
import { createRouter, createWebHistory } from 'vue-router';
// 3.页面组件
const Home = () => import('../views/Home');
const About = () => import('../views/About');
// 1.引用路由
export default createRouter({
    history: createWebHistory(), //2.创建history模式的路由
    // 4.配置路由
    routes: [
        {
            path: '/home',
            component: Home
        },
        {
            path: '/about',
            component: About
        }
    ]
});
