<template>
  <div class="container">
    <h1 class="title">選課列表</h1>
    <div class="toolbar">
      <router-link class="btn" to="/enrollments/new">+ 新增選課</router-link>
    </div>
    <div>
      共有 {{ enrollments.length }} 筆資料
    </div>
    <table class="pure-table">
      <thead>
        <tr>
          <th>學生ID</th>
          <th>學生姓名</th>
          <th>課程ID</th>
          <th>課程名稱</th>
          <th>選課日期</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(enrollment, idx) in enrollments" :key="enrollment.id.studentId + '-' + enrollment.id.courseId" :class="{ 'pure-table-odd': idx % 2 === 1 }">
          <td>{{ enrollment.id.studentId }}</td>
          <td>{{ enrollment.student.firstName }} {{ enrollment.student.lastName }}</td>
          <td>{{ enrollment.id.courseId }}</td>
          <td>{{ enrollment.course.courseName }}</td>
          <td>{{ enrollment.enrollDate ? enrollment.enrollDate.substring(0, 10) : '' }}</td>
          <td>
            <button class="btn" @click="edit(enrollment.id.studentId, enrollment.id.courseId)">編輯</button>
            <button class="btn danger" @click="remove(enrollment.id.studentId, enrollment.id.courseId)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchEnrollments, deleteEnrollment } from '@/api/enrollments.js'
import { useRouter } from 'vue-router'

const enrollments = ref([])
const error = ref('')
const router = useRouter()

async function load() {
  error.value = ''
  try {
    const { data } = await fetchEnrollments()
    enrollments.value = data
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  }
}

function edit(studentId, courseId) {
  router.push(`/enrollments/${studentId}/${courseId}/edit`)
}

async function remove(studentId, courseId) {
  if (!confirm(`要刪除學生ID=${studentId}、課程ID=${courseId}的選課資料嗎?`)) return
  try {
    await deleteEnrollment(studentId, courseId)
    await load()
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  }
}

onMounted(load)
</script>

<!-- 移除重複 style，全部統一用 base.css -->
