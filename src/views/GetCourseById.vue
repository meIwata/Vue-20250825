<template>
  <div class="get-course-by-id">
    <h2>查詢課程資料</h2>
    <div class="input-row">
      <input v-model="courseId" type="text" placeholder="請輸入課程ID" class="pure-input" />
      <button class="pure-button" @click="fetchCourse">查詢</button>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="course">
      <h3>查詢結果：</h3>
      <p>課程ID: {{ course.courseId }}</p>
      <p>課程名稱: {{ course.courseName }}</p>
      <p>授課教師: {{ course.teacher?.name }}</p>
      <p>學分: {{ course.credits }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getCourse } from '@/api/courses.js'

const courseId = ref('')
const course = ref(null)
const error = ref('')
const loading = ref(false)

async function fetchCourse() {
  error.value = ''
  course.value = null
  if (!courseId.value) {
    error.value = '請輸入課程ID'
    return
  }
  loading.value = true
  try {
    const res = await getCourse(courseId.value)
    course.value = res.data
    if (!course.value) {
      error.value = '查無此課程'
    }
  } catch (e) {
    error.value = '查詢失敗或查無此課程'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.get-course-by-id {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.input-row {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
.error {
  color: red;
  margin-bottom: 12px;
}
</style>
