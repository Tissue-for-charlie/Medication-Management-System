<template><SimpleCrud title="分类管理" endpoint="/api/categories" :fields="['name','parent_id','description']" /></template>
<script setup lang="ts">import SimpleCrud from './components/SimpleCrud.vue'</script>
