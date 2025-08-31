<template>
  <div class="container">
    <h1 class="title">選課列表</h1>
    <div class="toolbar">
      <router-link class="pure-button" to="/enrollments/new">+ 新增選課</router-link>
    </div>
    <div>
      共有 {{ enrollments.length }} 筆資料
    </div>
    <table class="pure-table">
      <thead>
        <tr>
          <th @click="setSort('studentId')" style="cursor:pointer">學生ID
            <span v-if="sortKey==='studentId'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
          </th>
          <th @click="setSort('studentName')" style="cursor:pointer">學生姓名
            <span v-if="sortKey==='studentName'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
          </th>
          <th @click="setSort('courseId')" style="cursor:pointer">課程ID
            <span v-if="sortKey==='courseId'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
          </th>
          <th @click="setSort('courseName')" style="cursor:pointer">課程名稱
            <span v-if="sortKey==='courseName'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
          </th>
          <th @click="setSort('enrollDate')" style="cursor:pointer">選課日期
            <span v-if="sortKey==='enrollDate'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
          </th>
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
            <button class="pure-button" @click="edit(enrollment.id.studentId, enrollment.id.courseId)">編輯</button>
            <button class="pure-button pure-button-error" @click="remove(enrollment.id.studentId, enrollment.id.courseId)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchEnrollments, deleteEnrollment } from '@/api/enrollments.js'
import { useRouter } from 'vue-router'

const enrollmentsRaw = ref([])
const error = ref('')
const router = useRouter()

const sortKey = ref('')
const sortOrder = ref('desc')

const enrollments = computed(() => {
  if (!sortKey.value) return enrollmentsRaw.value
  return [...enrollmentsRaw.value].sort((a, b) => {
    let aVal, bVal
    switch (sortKey.value) {
      case 'studentId':
        aVal = a.id.studentId
        bVal = b.id.studentId
        break
      case 'studentName':
        aVal = `${a.student.firstName} ${a.student.lastName}`
        bVal = `${b.student.firstName} ${b.student.lastName}`
        break
      case 'courseId':
        aVal = a.id.courseId
        bVal = b.id.courseId
        break
      case 'courseName':
        aVal = a.course.courseName
        bVal = b.course.courseName
        break
      case 'enrollDate':
        aVal = a.enrollDate ? new Date(a.enrollDate) : new Date(0)
        bVal = b.enrollDate ? new Date(b.enrollDate) : new Date(0)
        break
      default:
        aVal = ''
        bVal = ''
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

async function load() {
  error.value = ''
  try {
    const { data } = await fetchEnrollments()
    enrollmentsRaw.value = data
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
