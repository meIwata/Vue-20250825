<template>
  <div class="get-teacher-by-id">
    <h2>查詢教師資料</h2>
    <div class="input-row">
      <input v-model="teacherId" type="text" placeholder="請輸入教師ID" />
      <button @click="fetchTeacher">查詢</button>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="teacher">
      <h3>查詢結果：</h3>
      <p>教師ID: {{ teacher.teacherId }}</p>
      <p>姓名: {{ teacher.name }}</p>
      <p>Email: {{ teacher.email }}</p>
      <p>年齡: {{ teacher.age }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getTeacher } from '@/api/teacher'

const teacherId = ref('')
const teacher = ref(null)
const error = ref('')
const loading = ref(false)

async function fetchTeacher() {
  error.value = ''
  teacher.value = null
  if (!teacherId.value) {
    error.value = '請輸入教師ID'
    return
  }
  loading.value = true
  try {
    const res = await getTeacher(teacherId.value)
    teacher.value = res.data
    if (!teacher.value) {
      error.value = '查無此教師'
    }
  } catch (e) {
    error.value = '查詢失敗或查無此教師'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.get-teacher-by-id {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}
.input-row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>