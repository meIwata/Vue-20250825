<template>
  <div class="container">
    <h1 class="title">{{ isEdit ? '編輯選課' : '新增選課' }}</h1>
    <form @submit.prevent="submit">
      <label>學生</label>
      <template v-if="isEdit">
        <input type="text" :value="getStudentName(form.studentId)" readonly class="readonly-field" />
      </template>
      <template v-else>
        <select v-model="form.studentId" required>
          <option value="" disabled>請選擇學生</option>
          <option v-for="student in students" :key="student.studentId" :value="student.studentId">
            {{ student.firstName }} {{ student.lastName }} (ID: {{ student.studentId }})
          </option>
        </select>
      </template>

      <label>課程</label>
      <select v-model="form.courseId" required>
        <option value="" disabled>請選擇課程</option>
        <option v-for="course in courses" :key="course.courseId" :value="course.courseId" :disabled="isCourseDisabled(course.courseId)">
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
import { fetchEnrollments, getEnrollment, createEnrollment, updateEnrollment, deleteEnrollment } from '@/api/enrollments.js'
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
const selectedCourseIds = ref([])

onMounted(async () => {
  loading.value = true
  try {
    // 取得所有學生
    const { data: studentList } = await fetchStudents()
    students.value = studentList
    // 取得所有課程
    const { data: courseList } = await fetchCourses()
    courses.value = courseList
    // 取得該學生已選課程（排除正在編輯的這筆）
    const { data: enrollments } = await fetchEnrollments()
    selectedCourseIds.value = enrollments
      .filter(e => e.student.studentId === Number(studentId) && e.course.courseId !== Number(courseId))
      .map(e => e.course.courseId)
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
      // 取得原主鍵
      const originalStudentId = studentId
      const originalCourseId = courseId
      // 取得表單主鍵
      const newStudentId = form.value.studentId
      const newCourseId = form.value.courseId
      // 取得當下日期 yyyy-MM-ddTHH:mm:ss
      const now = new Date()
      const yyyy = now.getFullYear()
      const mm = String(now.getMonth() + 1).padStart(2, '0')
      const dd = String(now.getDate()).padStart(2, '0')
      const hh = String(now.getHours()).padStart(2, '0')
      const min = String(now.getMinutes()).padStart(2, '0')
      const ss = String(now.getSeconds()).padStart(2, '0')
      const enrollDate = `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`
      if (originalStudentId !== newStudentId || originalCourseId !== newCourseId) {
        // 主鍵有變動，執行刪除+新增
        await deleteEnrollment(originalStudentId, originalCourseId)
        await createEnrollment(newStudentId, newCourseId)
      } else {
        // 主鍵未變動，只更新日期
        const enrollment = {
          id: {
            studentId: newStudentId,
            courseId: newCourseId
          },
          enrollDate,
          student: null,
          course: null
        }
        await updateEnrollment(newStudentId, newCourseId, enrollment)
      }
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

function isCourseDisabled(courseId) {
  // 已選過且不是目前編輯的課程則反灰
  return selectedCourseIds.value.includes(courseId)
}

function getStudentName(studentId) {
  const student = students.value.find(s => s.studentId === Number(studentId))
  return student ? `${student.firstName} ${student.lastName} (ID: ${student.studentId})` : ''
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
.readonly-field {
  background-color: #f0f0f0;
  cursor: not-allowed;
}
</style>
