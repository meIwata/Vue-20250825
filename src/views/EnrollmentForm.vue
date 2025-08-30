<template>
  <div class="container">
    <h1 class="title">{{ isEdit ? '編輯選課' : '新增選課' }}</h1>
    <form @submit.prevent="submit">
      <label>學生</label>
      <select v-model="form.studentId" required>
        <option value="" disabled>請選擇學生</option>
        <option v-for="student in students" :key="student.studentId" :value="student.studentId">
          {{ student.name }} (ID: {{ student.studentId }})
        </option>
      </select>

      <label>課程</label>
      <select v-model="form.courseId" required>
        <option value="" disabled>請選擇課程</option>
        <option v-for="course in courses" :key="course.courseId" :value="course.courseId">
          {{ course.courseName }} (ID: {{ course.courseId }})
        </option>
      </select>

      <div class="actions">
        <button class="btn" type="submit">{{ isEdit ? '更新' : '建立' }}</button>
        <button class="btn" type="button" @click="goBack">返回</button>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
    <p v-if="loading">載入中...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchEnrollments, getEnrollment, createEnrollment, updateEnrollment } from '@/api/enrollments.js'
import { fetchStudents } from '@/api/students.js'
import { fetchCourses } from '@/api/courses.js'

const route = useRoute()
const router = useRouter()
const studentId = route.params.studentId
const courseId = route.params.courseId
const isEdit = computed(() => !!studentId && !!courseId)
const form = ref({ studentId: '', courseId: '' })
const error = ref('')
const loading = ref(false)
const students = ref([])
const courses = ref([])

onMounted(async () => {
  loading.value = true
  try {
    // 取得所有學生
    const { data: studentList } = await fetchStudents()
    students.value = studentList
    // 取得所有課程
    const { data: courseList } = await fetchCourses()
    courses.value = courseList
    // 編輯模式時，取得選課資料
    if (isEdit.value) {
      const { data } = await getEnrollment(studentId, courseId)
      form.value = {
        studentId: data.student.studentId || '',
        courseId: data.course.courseId || ''
      }
    }
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  } finally {
    loading.value = false
  }
})

async function submit() {
  error.value = ''
  try {
    if (isEdit.value) {
      await updateEnrollment({ studentId: form.value.studentId, courseId: form.value.courseId })
    } else {
      await createEnrollment(form.value.studentId, form.value.courseId)
    }
    router.push('/enrollments')
  } catch (e) {
    if (e?.response?.data?.fields) {
      const msgs = Object.entries(e.response.data.fields).map(([k, v]) => `${k}: ${v}`)
      error.value = msgs.join(' | ')
    } else {
      error.value = e?.response?.data?.message || e.message
    }
  }
}

function goBack() {
  router.push('/enrollments')
}
</script>

<style scoped>
.container {
  max-width: 640px;
  margin: 24px auto;
  padding: 0 12px;
}
.title {
  margin-bottom: 12px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
label {
  font-weight: 600;
}
input, textarea, select {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.btn {
  padding: 6px 10px;
  border: 1px solid #999;
  background: #f7f7f7;
  cursor: pointer;
  text-decoration: none;
  color: #333;
}
.error {
  color: #c33;
}
</style>
