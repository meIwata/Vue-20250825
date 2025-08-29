<template>
  <div class="container">
    <h1 class="title">學生列表</h1>

    <div class="toolbar">
      <router-link class="btn" to="/students/new">+ 新增學生</router-link>
      <router-link class="btn" to="/students/search">使用學生ID做查詢</router-link>
      <router-link class="btn" to="/students/lastname">依姓氏查詢學生</router-link>
      <router-link class="btn" to="/students/email">依電子郵件查詢學生</router-link>
    </div>
    <div>
      共有 {{ students.length }} 筆資料
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>學生ID</th>
          <th>名</th>
          <th>姓</th>
          <th>電子郵件</th>
          <th>生日</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.studentId">
          <td>{{ student.studentId }}</td>
          <td>{{ student.firstName }}</td>
          <td>{{ student.lastName }}</td>
          <td>{{ student.email }}</td>
          <td>{{ student.birthday }}</td>
          <td>
            <button class="btn" @click="edit(student.studentId)">編輯</button>
            <button class="btn danger" @click="remove(student.studentId)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchStudents, deleteStudent } from '@/api/students'

const students = ref([])
const error = ref('')
const router = useRouter()

// 非同步函式
async function load() {
  error.value = ''
  try {
    const { data } = await fetchStudents()
    students.value = data
    console.log(students.value[0])
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  }
}

function edit(id) {
  router.push(`/students/${id}/edit`)
}

async function remove(id) {
  if (!confirm(`要刪除id=${id}學生嗎?`)) return
  try {
    await deleteStudent(id)
    await load()
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  }
}

onMounted(load)
</script>

<style scoped>
.container {
  max-width: 960px;
  margin: 24px auto;
  padding: 0 12px;
}

.title {
  margin-bottom: 12px;
}

.toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.spacer {
  flex: 1;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.btn {
  padding: 6px 10px;
  margin-right: 6px;
  border: 1px solid #999;
  background: #f7f7f7;
  cursor: pointer;
  text-decoration: none;
  color: #333;
}

.btn.danger {
  border-color: #c33;
}

.pager {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

.error {
  color: #c33;
}
</style>
