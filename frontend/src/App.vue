<template>
  <div id="nav">
    <router-link to="/">首页</router-link> |
    <router-link to="/medications">药品管理</router-link> |
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
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>