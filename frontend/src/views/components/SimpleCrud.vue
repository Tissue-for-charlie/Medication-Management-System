<template>
  <div class="page">
    <h2>{{ title }}</h2>
    <form class="form" @submit.prevent="save">
      <input v-for="f in fields" :key="f" v-model="form[f]" :placeholder="f" required />
      <button type="submit">{{ form.id ? '更新' : '新增' }}</button>
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

const initForm = () => {
  form.value = props.fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {} as Record<string, any>)
}

const load = async () => {
  const { data } = await api.get(props.endpoint)
  list.value = data
}

const save = async () => {
  if (form.value.id) {
    await api.put(`${props.endpoint}/${form.value.id}`, form.value)
  } else {
    await api.post(props.endpoint, form.value)
  }
  reset()
  await load()
}

const edit = (item: Record<string, any>) => {
  form.value = { ...item }
}

const remove = async (id: number) => {
  await api.delete(`${props.endpoint}/${id}`)
  await load()
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
</style>
