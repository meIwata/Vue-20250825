<template>
  <div class="get-teachers-by-age">
    <h2>依年齡查詢教師</h2>
    <div class="input-row">
      <input v-model="age" type="number" placeholder="請輸入教師年齡" />
      <button @click="fetchTeachers">查詢</button>
    </div>
    <div v-if="loading" style="margin-top: 16px;">查詢中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="teachers && teachers.length > 0">
      <h3>查詢結果：</h3>
      <div>共有 {{ teachers.length }} 筆符合資料</div>
      <ul>
        <li v-for="t in teachers" :key="t.teacherId">
          教師ID: {{ t.teacherId }}<br>
          姓名: {{ t.name }}<br>
          Email: {{ t.email }}<br>
          年齡: {{ t.age }}
        </li>
      </ul>
    </div>
    <div v-else-if="teachers && teachers.length === 0">
      查無此年齡的教師
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getTeachersByAge } from '@/api/teacher'

const age = ref('')
const teachers = ref(null)
const error = ref('')
const loading = ref(false)

async function fetchTeachers() {
  error.value = ''
  teachers.value = null
  if (!age.value) {
    error.value = '請輸入教師年齡'
    return
  }
  loading.value = true
  try {
    const res = await getTeachersByAge(age.value)
    teachers.value = res.data
    if (!teachers.value || teachers.value.length === 0) {
      teachers.value = []
    }
  } catch (e) {
    error.value = '查詢失敗或查無資料'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.get-teachers-by-age {
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