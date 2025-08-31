<template>
  <div class="container">
    <h1 class="title">學生列表</h1>

    <div class="toolbar">
      <router-link class="pure-button" to="/students/new">+ 新增學生</router-link>
      <router-link class="pure-button" to="/students/search">使用學生ID做查詢</router-link>
      <router-link class="pure-button" to="/students/lastname">依姓氏查詢學生</router-link>
      <router-link class="pure-button" to="/students/email">依電子郵件查詢學生</router-link>
    </div>
    <div>
      共有 {{ students.length }} 筆資料
    </div>

    <table class="pure-table">
      <thead>
        <tr>
          <th @click="setSort('studentId')" style="cursor:pointer">學生ID
            <span v-if="sortKey==='studentId'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
          </th>
          <th @click="setSort('firstName')" style="cursor:pointer">名
            <span v-if="sortKey==='firstName'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
          </th>
          <th @click="setSort('lastName')" style="cursor:pointer">姓
            <span v-if="sortKey==='lastName'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
          </th>
          <th @click="setSort('email')" style="cursor:pointer">電子郵件
            <span v-if="sortKey==='email'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
          </th>
          <th @click="setSort('birthday')" style="cursor:pointer">生日
            <span v-if="sortKey==='birthday'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
          </th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(student, idx) in students" :key="student.studentId" :class="{ 'pure-table-odd': idx % 2 === 1 }">
          <td>{{ student.studentId }}</td>
          <td>{{ student.firstName }}</td>
          <td>{{ student.lastName }}</td>
          <td>{{ student.email }}</td>
          <td>{{ student.birthday }}</td>
          <td>
            <button class="pure-button" @click="edit(student.studentId)">編輯</button>
            <button class="pure-button pure-button-error" @click="remove(student.studentId)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchStudents, deleteStudent } from '@/api/students'

const studentsRaw = ref([])
const error = ref('')
const router = useRouter()

const sortKey = ref('')
const sortOrder = ref('desc')

const students = computed(() => {
  if (!sortKey.value) return studentsRaw.value
  return [...studentsRaw.value].sort((a, b) => {
    let aVal = a[sortKey.value]
    let bVal = b[sortKey.value]
    // 日期欄位特殊處理
    if (sortKey.value === 'birthday') {
      aVal = aVal ? new Date(aVal) : new Date(0)
      bVal = bVal ? new Date(bVal) : new Date(0)
    }
    if (sortOrder.value === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
    }
  })
})

function setSort(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'desc'
  }
}

// 非同步函式
async function load() {
  error.value = ''
  try {
    const { data } = await fetchStudents()
    studentsRaw.value = data
    console.log(studentsRaw.value[0])
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

<!-- 移除重複 style，全部統一用 base.css -->
