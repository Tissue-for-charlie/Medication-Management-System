<template><SimpleCrud title="销售管理" endpoint="/api/sales" :fields="['medication_id','customer_name','quantity','unit_price','total_price','sale_date','payment_method','notes']" /></template>
<script setup lang="ts">import SimpleCrud from './components/SimpleCrud.vue'</script>
