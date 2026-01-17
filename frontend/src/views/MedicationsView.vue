<template>
  <div class="medications">
    <h1>药品管理</h1>
    <div class="actions">
      <button @click="showAddForm = !showAddForm">
        {{ showAddForm ? '取消' : '添加药品' }}
      </button>
    </div>

    <!-- 添加药品表单 -->
    <div v-if="showAddForm" class="form-container">
      <h3>{{ editingMedication ? '编辑药品' : '添加新药品' }}</h3>
      <form @submit.prevent="saveMedication">
        <div class="form-group">
          <label>药品名称:</label>
          <input v-model="form.name" type="text" required />
        </div>
        <div class="form-group">
          <label>药品类型:</label>
          <select v-model="form.type" required>
            <option value="">请选择类型</option>
            <option value="处方药">处方药</option>
            <option value="非处方药">非处方药</option>
            <option value="保健品">保健品</option>
          </select>
        </div>
        <div class="form-group">
          <label>生产厂商:</label>
          <input v-model="form.manufacturer" type="text" required />
        </div>
        <div class="form-group">
          <label>批号:</label>
          <input v-model="form.batchNumber" type="text" required />
        </div>
        <div class="form-group">
          <label>有效期:</label>
          <input v-model="form.expiryDate" type="date" required />
        </div>
        <div class="form-group">
          <label>单价:</label>
          <input v-model.number="form.unitPrice" type="number" step="0.01" required />
        </div>
        <button type="submit">{{ editingMedication ? '更新' : '添加' }}</button>
        <button v-if="editingMedication" @click="cancelEdit" type="button">取消</button>
      </form>
    </div>

    <!-- 药品列表 -->
    <div class="medication-list">
      <table>
        <thead>
          <tr>
            <th>药品名称</th>
            <th>类型</th>
            <th>生产厂商</th>
            <th>批号</th>
            <th>有效期</th>
            <th>单价</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="med in medications" :key="med.id">
            <td>{{ med.name }}</td>
            <td>{{ med.type }}</td>
            <td>{{ med.manufacturer }}</td>
            <td>{{ med.batchNumber }}</td>
            <td>{{ med.expiryDate }}</td>
            <td>¥{{ med.unitPrice }}</td>
            <td>
              <button @click="editMedication(med)">编辑</button>
              <button @click="deleteMedication(med.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface Medication {
  id?: number;
  name: string;
  type: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  unitPrice: number;
}

const medications = ref<Medication[]>([]);
const showAddForm = ref(false);
const editingMedication = ref<number | null>(null);

const form = ref<Medication>({
  name: '',
  type: '',
  manufacturer: '',
  batchNumber: '',
  expiryDate: '',
  unitPrice: 0
});

onMounted(async () => {
  await loadMedications();
});

const loadMedications = async () => {
  try {
    // 模拟API调用
    const response = await axios.get('/api/medications');
    medications.value = response.data;
  } catch (error) {
    console.error('加载药品列表失败:', error);
    // 使用模拟数据
    medications.value = [
      {
        id: 1,
        name: '阿司匹林',
        type: '非处方药',
        manufacturer: '制药公司A',
        batchNumber: 'A20231201',
        expiryDate: '2025-12-01',
        unitPrice: 15.50
      },
      {
        id: 2,
        name: '布洛芬',
        type: '非处方药',
        manufacturer: '制药公司B',
        batchNumber: 'B20231215',
        expiryDate: '2025-11-15',
        unitPrice: 12.30
      }
    ];
  }
};

const saveMedication = async () => {
  try {
    if (editingMedication.value) {
      // 更新现有药品
      const index = medications.value.findIndex(m => m.id === editingMedication.value);
      if (index !== -1) {
        medications.value[index] = { ...form.value, id: editingMedication.value };
      }
    } else {
      // 添加新药品
      const newMed: Medication = {
        ...form.value,
        id: Math.max(...medications.value.map(m => m.id || 0)) + 1
      };
      medications.value.push(newMed);
    }

    // 重置表单
    resetForm();
  } catch (error) {
    console.error('保存药品失败:', error);
  }
};

const editMedication = (med: Medication) => {
  form.value = { ...med };
  editingMedication.value = med.id || null;
  showAddForm.value = true;
};

const cancelEdit = () => {
  resetForm();
};

const deleteMedication = (id: number) => {
  if (confirm('确定要删除这个药品吗？')) {
    medications.value = medications.value.filter(m => m.id !== id);
  }
};

const resetForm = () => {
  form.value = {
    name: '',
    type: '',
    manufacturer: '',
    batchNumber: '',
    expiryDate: '',
    unitPrice: 0
  };
  showAddForm.value = false;
  editingMedication.value = null;
};
</script>

<style scoped>
.medications {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.actions {
  margin-bottom: 20px;
  text-align: right;
}

.form-container {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  padding: 8px 16px;
  margin-right: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #359c6d;
}

.medication-list table {
  width: 100%;
  border-collapse: collapse;
}

.medication-list th,
.medication-list td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.medication-list th {
  background-color: #f2f2f2;
}

.medication-list tr:hover {
  background-color: #f5f5f5;
}
</style>