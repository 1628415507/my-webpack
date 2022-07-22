<!--
 * @Author: Hongzf
 * @Date: 2022-07-22 09:31:09
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-07-22 15:01:35
 * @Description: 
-->
<template>
    <!-- vue3不再需要根元素了 -->
    <h1 class="title">hello app</h1>
    <el-button type="primary">ElButton</el-button>
    <ul>
        <li>
            <router-link to="/home">Home</router-link>
        </li>
        <li>
            <router-link to="/about">About</router-link>
        </li>
    </ul>
    <!-- 路由组件回显 -->
    <router-view />
</template>

<script>
import { ElButton } from 'element-plus'; //局部引入
export default {
    name: 'App',
    components: {
        ElButton
    }
};
</script>

<style>
.title {
    color: pink;
}
</style>
