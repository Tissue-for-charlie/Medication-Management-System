<template><SimpleCrud title="用户管理" endpoint="/api/users" :fields="['username','password','role','contact']" /></template>
<script setup lang="ts">import SimpleCrud from './components/SimpleCrud.vue'</script>
