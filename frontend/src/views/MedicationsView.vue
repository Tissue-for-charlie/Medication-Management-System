<template>
  <div class="page">
    <h2>药品信息管理</h2>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <form class="form" @submit.prevent="save">
      <input v-model="form.name" placeholder="药品名称" required />
      <input v-model="form.specification" placeholder="规格" />
      <input v-model.number="form.unit_price" type="number" step="0.01" placeholder="单价" required />
      <input v-model.number="form.stock_quantity" type="number" placeholder="库存" required />
      <input v-model.number="form.min_stock_level" type="number" placeholder="最低库存" required />
      <button type="submit">{{ form.id ? '更新' : '新增' }}</button>
      <button v-if="form.id" type="button" @click="reset">取消</button>
    </form>

    <table>
      <thead>
        <tr><th>ID</th><th>名称</th><th>规格</th><th>单价</th><th>库存</th><th>操作</th></tr>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.specification }}</td>
          <td>{{ item.unit_price }}</td>
          <td>{{ item.stock_quantity }}</td>
          <td>
            <button @click="edit(item)">编辑</button>
            <button @click="remove(item.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import api from '../services/api'

interface Medication {
  id?: number
  name: string
  category_id?: number | null
  specification?: string
  unit_price: number
  stock_quantity: number
  min_stock_level: number
  description?: string
}

const list = ref<Medication[]>([])
const errorMessage = ref('')
const form = ref<Medication>({ name: '', specification: '', unit_price: 0, stock_quantity: 0, min_stock_level: 10 })

const load = async () => {
  try {
    errorMessage.value = ''
    const { data } = await api.get('/api/medications')
    list.value = data
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.detail || '加载药品数据失败'
  }
}

const save = async () => {
  try {
    errorMessage.value = ''
    if (form.value.id) {
      await api.put(`/api/medications/${form.value.id}`, form.value)
    } else {
      await api.post('/api/medications', form.value)
    }
    reset()
    await load()
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.detail || '保存药品信息失败'
  }
}

const edit = (item: Medication) => {
  form.value = { ...item }
}

const remove = async (id?: number) => {
  if (!id) return
  try {
    errorMessage.value = ''
    await api.delete(`/api/medications/${id}`)
    await load()
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.detail || '删除药品失败'
  }
}

const reset = () => {
  form.value = { name: '', specification: '', unit_price: 0, stock_quantity: 0, min_stock_level: 10 }
}

onMounted(load)
</script>

<style scoped>
.page { max-width: 1100px; margin: 90px auto 20px; }
.form { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin-bottom: 16px; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ddd; padding: 8px; }
.error { color: #d93025; margin-bottom: 12px; }
</style>
