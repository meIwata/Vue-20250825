<template>
  <div class="container">
    <h1 class="title">課程列表</h1>

    <div class="toolbar">
      <router-link class="btn" to="/courses/new">+ 新增課程</router-link>
      <router-link class="btn" to="/courses/search">使用課程ID做查詢</router-link>
    </div>
    <div>
      共有 {{ courses.length }} 筆資料
    </div>
    <table class="pure-table">
      <thead>
        <tr>
          <th>課程ID</th>
          <th>課程名稱</th>
          <th>授課教師</th>
          <th>學分</th>
          <th>課程說明</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(course, idx) in courses" :key="course.courseId" :class="{ 'pure-table-odd': idx % 2 === 1 }">
          <td>{{ course.courseId }}</td>
          <td>{{ course.courseName }}</td>
          <td>{{ course.teacher ? course.teacher.name : '未分配' }}</td>
          <td>{{ course.credits }}</td>
          <td>
            <span v-if="course.courseDescription === null">老師目前沒有公布其他訊息</span>
            <span v-else>{{ course.courseDescription }}</span>
          </td>
          <td>
            <button class="btn" @click="edit(course.courseId)">編輯</button>
            <button class="btn danger" @click="remove(course.courseId)">刪除</button>
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
import { fetchCourses, deleteCourse } from '@/api/courses.js'

const courses = ref([])
const error = ref('')
const router = useRouter()

async function load() {
  error.value = ''
  try {
    const { data } = await fetchCourses()
    courses.value = data
    if (data && data.length > 0) {
      console.log('第一筆課程資料:', data[0])
    }
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  }
}

function edit(id) {
  router.push(`/courses/${id}/edit`)
}

async function remove(id) {
  if (!confirm(`要刪除id=${id}課程嗎?`)) return
  try {
    await deleteCourse(id)
    await load()
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  }
}

onMounted(load)
</script>

<!-- 移除重複 style，全部統一用 base.css -->
