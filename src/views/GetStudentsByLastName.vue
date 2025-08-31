<template>
  <div class="get-students-by-lastname">
    <h2>依姓氏查詢學生</h2>
    <div class="input-row">
      <input v-model="lastName" type="text" placeholder="請輸入學生姓氏" class="pure-input" />
      <button class="pure-button" @click="fetchStudents">查詢</button>
    </div>
    <div v-if="loading" style="margin-top: 16px;">查詢中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="students && students.length > 0">
      <h3>查詢結果：</h3>
      <div>共有 {{ students.length }} 筆符合資料</div>
      <ul>
        <li v-for="s in students" :key="s.studentId">
          學生ID: {{ s.studentId }}<br>
          名: {{ s.firstName }}<br>
          姓: {{ s.lastName }}<br>
          Email: {{ s.email }}<br>
          生日: {{ s.birthday }}
        </li>
      </ul>
    </div>
    <div v-else-if="students && students.length === 0">
      查無此姓氏的學生
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getStudentsByLastName } from '@/api/students'

const lastName = ref('')
const students = ref(null)
const error = ref('')
const loading = ref(false)

async function fetchStudents() {
  error.value = ''
  students.value = null
  if (!lastName.value) {
    error.value = '請輸入學生姓氏'
    return
  }
  loading.value = true
  try {
    const res = await getStudentsByLastName(lastName.value)
    students.value = res.data
    if (!students.value || students.value.length === 0) {
      students.value = []
    }
  } catch (e) {
    error.value = '查詢失敗或查無資料'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.get-students-by-lastname {
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
ul {
  padding-left: 1em;
}
li {
  margin-bottom: 12px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
}
</style>
