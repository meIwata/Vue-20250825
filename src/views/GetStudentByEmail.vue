<template>
  <div class="get-student-by-email">
    <h2>依電子郵件查詢學生</h2>
    <div class="input-row">
      <input v-model="email" type="email" placeholder="請輸入學生電子郵件" />
      <button @click="fetchStudent">查詢</button>
    </div>
    <div v-if="loading" style="margin-top: 16px;">查詢中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="student">
      <h3>查詢結果：</h3>
      <ul>
        <li>
          學生ID: {{ student.studentId }}<br>
          名: {{ student.firstName }}<br>
          姓: {{ student.lastName }}<br>
          Email: {{ student.email }}<br>
          生日: {{ student.birthday }}
        </li>
      </ul>
    </div>
    <div v-else-if="student === null && !loading && !error && email">
      查無此電子郵件的學生
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getStudentsByEmail } from '@/api/students'

const email = ref('')
const student = ref(undefined)
const error = ref('')
const loading = ref(false)

async function fetchStudent() {
  error.value = ''
  student.value = undefined
  if (!email.value) {
    error.value = '請輸入學生電子郵件'
    return
  }
  loading.value = true
  try {
    const res = await getStudentsByEmail(email.value)
    if (res.data && res.data.studentId) {
      student.value = res.data
    } else {
      student.value = null
    }
  } catch (e) {
    error.value = '查詢失敗或查無資料'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.get-student-by-email {
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

