/*
 * @Author: Hongzf
 * @Date: 2022-07-22 09:30:49
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-07-22 14:59:23
 * @Description:
 */
// vue3
import { createApp } from 'vue';
import App from './App';
import router from './router';
// 全部引入：使用cnpm安装cnpm install element-plus --save
// 按需引入：npm install -D unplugin-vue-components unplugin-auto-import
// import ElementPlus from 'element-plus'; //全部引入
import 'element-plus/dist/index.css';
createApp(App)
    .use(router)
    // .use(ElementPlus)
    .mount(document.getElementById('app')); //通过mount方法挂载到页面的某个元素上
