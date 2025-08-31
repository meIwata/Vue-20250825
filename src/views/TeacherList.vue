<template>
  <div class="container">
    <h1 class="title">教師列表</h1>

    <div class="toolbar">
      <router-link class="pure-button" to="/teachers/new">+ 新增教師</router-link>
      <router-link class="pure-button" to="/teachers/search">使用教師ID做查詢</router-link>
      <router-link class="pure-button" to="/teachers/age">使用教師年齡做查詢</router-link>
    </div>
    <div>
      共有 {{ teachers.length }} 筆資料
    </div>
    <table class="pure-table">
      <thead>
        <tr>
          <th @click="setSort('teacherId')" style="cursor:pointer">教師ID
            <span v-if="sortKey==='teacherId'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
          </th>
          <th @click="setSort('name')" style="cursor:pointer">姓名
            <span v-if="sortKey==='name'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
          </th>
          <th @click="setSort('email')" style="cursor:pointer">電子郵件
            <span v-if="sortKey==='email'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
          </th>
          <th @click="setSort('age')" style="cursor:pointer">年齡
            <span v-if="sortKey==='age'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
          </th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(teacher, idx) in teachers" :key="teacher.teacherId" :class="{ 'pure-table-odd': idx % 2 === 1 }">
          <td>{{ teacher.teacherId }}</td>
          <td>{{ teacher.name }}</td>
          <td>{{ teacher.email }}</td>
          <td>{{ teacher.age }}</td>
          <td>
            <button class="pure-button" @click="edit(teacher.teacherId)">編輯</button>
            <button class="pure-button pure-button-error" @click="remove(teacher.teacherId)">刪除</button>
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
import { fetchTeachers, deleteTeacher } from '@/api/teachers.js'

const teachersRaw = ref([])
const error = ref('')
const router = useRouter()

const sortKey = ref('')
const sortOrder = ref('desc')

const teachers = computed(() => {
  if (!sortKey.value) return teachersRaw.value
  return [...teachersRaw.value].sort((a, b) => {
    if (sortOrder.value === 'asc') {
      return a[sortKey.value] > b[sortKey.value] ? 1 : a[sortKey.value] < b[sortKey.value] ? -1 : 0
    } else {
      return a[sortKey.value] < b[sortKey.value] ? 1 : a[sortKey.value] > b[sortKey.value] ? -1 : 0
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
    const { data } = await fetchTeachers()
    teachersRaw.value = data
    console.log(teachersRaw.value[0])
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  }
}

function edit(id) {
  router.push(`/teachers/${id}/edit`)
}

async function remove(id) {
  if (!confirm(`要刪除id=${id}老師嗎?`)) return
  try {
    await deleteTeacher(id)
    await load()
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  }
}

onMounted(load)
</script>

<!-- 移除重複 style，全部統一用 base.css -->
