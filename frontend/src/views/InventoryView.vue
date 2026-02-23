<template>
  <div class="page">
    <h2>库存管理</h2>
    <button @click="load">刷新</button>
    <p>药品种类: {{ data.total_items }}</p>
    <p>库存总量: {{ data.total_stock }}</p>
    <h4>低库存预警</h4>
    <ul><li v-for="i in data.low_stock_items" :key="i.id">{{ i.name }}: {{ i.stock_quantity }}/{{ i.min_stock_level }}</li></ul>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import api from '../services/api'
const data = ref({ total_items: 0, total_stock: 0, low_stock_items: [] as Array<{id:number,name:string,stock_quantity:number,min_stock_level:number}> })
const load = async () => { const res = await api.get('/api/inventory'); data.value = res.data }
onMounted(load)
</script>
<style scoped>.page{max-width:800px;margin:90px auto 20px;}</style>
