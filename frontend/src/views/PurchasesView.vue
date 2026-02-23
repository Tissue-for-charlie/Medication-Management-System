<template><SimpleCrud title="采购管理" endpoint="/api/purchases" :fields="['medication_id','supplier_id','quantity','unit_price','total_price','purchase_date','status','notes']" /></template>
<script setup lang="ts">import SimpleCrud from './components/SimpleCrud.vue'</script>
