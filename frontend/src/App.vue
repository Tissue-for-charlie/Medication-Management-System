<template>
  <div id="nav">
    <router-link to="/">首页</router-link> |
    <router-link to="/users">用户管理</router-link> |
    <router-link to="/categories">分类管理</router-link> |
    <router-link to="/medications">药品管理</router-link> |
    <router-link to="/suppliers">供应商管理</router-link> |
    <router-link to="/purchases">采购管理</router-link> |
    <router-link to="/sales">销售管理</router-link> |
    <router-link to="/returns">退货管理</router-link> |
    <router-link to="/prescriptions">处方管理</router-link> |
    <router-link to="/inventory">库存管理</router-link>
  </div>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  console.log('Medication Management System loaded');
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  background-color: #f0f0f0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  padding: 0 5px;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#nav a:hover {
  text-decoration: underline;
}

/* 为内容留出顶部空间 */
#app > div:not(#nav) {
  margin-top: 80px;
}
</style>