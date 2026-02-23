<template><SimpleCrud title="供应商管理" endpoint="/api/suppliers" :fields="['name','contact_person','phone','email','address']" /></template>
<script setup lang="ts">import SimpleCrud from './components/SimpleCrud.vue'</script>
