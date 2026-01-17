<template>
  <div class="home">
    <h1>药物管理系统</h1>
    <p>欢迎使用现代化药物管理系统</p>
    <div class="features">
      <div class="feature-card">
        <h3>药品管理</h3>
        <p>添加、编辑、删除药品信息</p>
      </div>
      <div class="feature-card">
        <h3>处方管理</h3>
        <p>记录和管理患者处方</p>
      </div>
      <div class="feature-card">
        <h3>库存管理</h3>
        <p>实时跟踪药品库存状态</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 主页逻辑可以在这里添加
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.features {
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
  flex-wrap: wrap;
}

.feature-card {
  width: 30%;
  min-width: 250px;
  padding: 20px;
  margin: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.feature-card h3 {
  margin-top: 0;
  color: #2c3e50;
}
</style>