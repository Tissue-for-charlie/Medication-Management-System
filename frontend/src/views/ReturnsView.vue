<template><SimpleCrud title="退货管理" endpoint="/api/returns" :fields="['sale_id','medication_id','quantity','reason','return_date','status','notes']" /></template>
<script setup lang="ts">import SimpleCrud from './components/SimpleCrud.vue'</script>
