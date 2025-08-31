<template>
  <div class="get-student-by-id">
    <h2>查詢學生資料</h2>
    <div class="input-row">
      <input v-model="studentId" type="text" placeholder="請輸入學生ID" class="pure-input" />
      <button class="pure-button" @click="fetchStudent">查詢</button>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="student">
      <h3>查詢結果：</h3>
      <p>學生ID: {{ student.studentId }}</p>
      <p>姓: {{ student.lastName }}</p>
      <p>名: {{ student.firstName }}</p>
      <p>email: {{ student.email }}</p>
      <p>生日: {{ student.birthday }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getStudent } from '../api/students'

const studentId = ref('')
const student = ref(null)
const error = ref('')
const loading = ref(false)

async function fetchStudent() {
  error.value = ''
  student.value = null
  if (!studentId.value) {
    error.value = '請輸入學生ID'
    return
  }
  loading.value = true
  try {
    const res = await getStudent(studentId.value)
    student.value = res.data
    if (!student.value) {
      error.value = '查無此學生'
    }
  } catch (e) {
    error.value = '查詢失敗或查無此學生'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.get-student-by-id {
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
