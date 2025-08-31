<template>
  <div class="container">
    <h1 class="title">教師列表</h1>

    <div class="toolbar">
      <router-link class="btn" to="/teachers/new">+ 新增教師</router-link>
      <router-link class="btn" to="/teachers/search">使用教師ID做查詢</router-link>
      <router-link class="btn" to="/teachers/age">使用教師年齡做查詢</router-link>
    </div>
    <div>
      共有 {{ teachers.length }} 筆資料
    </div>
    <table class="pure-table">
      <thead>
        <tr>
          <th>教師ID</th>
          <th>姓名</th>
          <th>電子郵件</th>
          <th>年齡</th>
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
            <button class="btn" @click="edit(teacher.teacherId)">編輯</button>
            <button class="btn danger" @click="remove(teacher.teacherId)">刪除</button>
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
import { fetchTeachers, deleteTeacher } from '@/api/teachers.js'

const teachers = ref([])
const error = ref('')
const router = useRouter()

// 非同步函式
async function load() {
  error.value = ''
  try {
    const { data } = await fetchTeachers()
    teachers.value = data
    console.log(teachers.value[0])
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
