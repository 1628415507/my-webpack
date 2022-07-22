// vue3
import { createApp } from 'vue';
import App from './App';
import router from './router';

// import ElementPlus from "element-plus";
// import "element-plus/dist/index.css";

createApp(App)
    .use(router)
    // .use(ElementPlus)
    .mount(document.getElementById('app')); //通过mount方法挂载到页面的某个元素上
