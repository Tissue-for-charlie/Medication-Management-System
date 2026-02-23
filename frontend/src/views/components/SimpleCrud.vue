<template>
  <div class="page">
    <h2>{{ title }}</h2>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <form class="form" @submit.prevent="save">
      <input
        v-for="f in fields"
        :key="f"
        v-model="form[f]"
        :placeholder="f"
        :type="inputType(f)"
      />
      <button type="submit" :disabled="isSaving">{{ form.id ? '更新' : '新增' }}</button>
      <button v-if="form.id" @click="reset" type="button">取消</button>
    </form>

    <table>
      <thead><tr><th>ID</th><th v-for="f in fields" :key="f">{{ f }}</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="item in list" :key="item.id">
          <td>{{ item.id }}</td>
          <td v-for="f in fields" :key="f">{{ item[f] }}</td>
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
import api from '../../services/api'

const props = defineProps<{ title: string; endpoint: string; fields: string[] }>()
const list = ref<Record<string, any>[]>([])
const form = ref<Record<string, any>>({})
const errorMessage = ref('')
const isSaving = ref(false)

const fieldTypeMap: Record<string, string> = {
  quantity: 'number',
  unit_price: 'number',
  total_price: 'number',
  stock_quantity: 'number',
  min_stock_level: 'number',
  medication_id: 'number',
  supplier_id: 'number',
  sale_id: 'number',
  category_id: 'number',
  parent_id: 'number',
  purchase_date: 'date',
  sale_date: 'date',
  return_date: 'date',
  prescribed_date: 'date',
  email: 'email'
}

const inputType = (field: string) => fieldTypeMap[field] || 'text'

const initForm = () => {
  form.value = props.fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {} as Record<string, any>)
}

const load = async () => {
  try {
    errorMessage.value = ''
    const { data } = await api.get(props.endpoint)
    list.value = data
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.detail || '加载数据失败'
  }
}

const save = async () => {
  try {
    isSaving.value = true
    errorMessage.value = ''
    if (form.value.id) {
      await api.put(`${props.endpoint}/${form.value.id}`, form.value)
    } else {
      await api.post(props.endpoint, form.value)
    }
    reset()
    await load()
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.detail || '保存失败，请检查输入内容'
  } finally {
    isSaving.value = false
  }
}

const edit = (item: Record<string, any>) => {
  form.value = { ...item }
}

const remove = async (id: number) => {
  try {
    errorMessage.value = ''
    await api.delete(`${props.endpoint}/${id}`)
    await load()
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.detail || '删除失败'
  }
}

const reset = () => initForm()

onMounted(async () => {
  initForm()
  await load()
})
</script>

<style scoped>
.page { max-width: 1100px; margin: 90px auto 20px; }
.form { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ddd; padding: 8px; }
.error { color: #d93025; margin-bottom: 12px; }
</style>
