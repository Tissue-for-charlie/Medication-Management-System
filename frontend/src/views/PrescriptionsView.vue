<template><SimpleCrud title="处方管理" endpoint="/api/prescriptions" :fields="['patient_name','medication_id','dosage','quantity','prescribed_date','notes']" /></template>
<script setup lang="ts">import SimpleCrud from './components/SimpleCrud.vue'</script>
