<template>
  <div class="container">
    <h1 class="title">課程列表</h1>

    <div class="toolbar">
      <router-link class="pure-button" to="/courses/new">+ 新增課程</router-link>
      <router-link class="pure-button" to="/courses/search">使用課程ID做查詢</router-link>
    </div>
    <div>
      共有 {{ courses.length }} 筆資料
    </div>
    <table class="pure-table">
      <thead>
        <tr>
          <th @click="setSort('courseId')" style="cursor:pointer">課程ID
            <span v-if="sortKey==='courseId'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
          </th>
          <th @click="setSort('courseName')" style="cursor:pointer">課程名稱
            <span v-if="sortKey==='courseName'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
          </th>
          <th @click="setSort('teacherName')" style="cursor:pointer">授課教師
            <span v-if="sortKey==='teacherName'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
          </th>
          <th @click="setSort('credits')" style="cursor:pointer">學分
            <span v-if="sortKey==='credits'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
          </th>
          <th @click="setSort('enrollmentCount')" style="cursor:pointer">已選課人數
            <span v-if="sortKey==='enrollmentCount'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
          </th>
          <th @click="setSort('courseDescription')" style="cursor:pointer">課程說明
            <span v-if="sortKey==='courseDescription'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
          </th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(course, idx) in courses" :key="course.courseId" :class="{ 'pure-table-odd': idx % 2 === 1 }">
          <td>{{ course.courseId }}</td>
          <td>{{ course.courseName }}</td>
          <td>{{ course.teacher ? course.teacher.name : '未分配' }}</td>
          <td>{{ course.credits }}</td>
          <td>{{ courseEnrollmentCount[course.courseId] || 0 }}</td>
          <td>
            <span v-if="course.courseDescription === null">老師目前沒有公布其他訊息</span>
            <span v-else>{{ course.courseDescription }}</span>
          </td>
          <td>
            <button class="pure-button" @click="edit(course.courseId)">編輯</button>
            <button class="pure-button pure-button-error" @click="remove(course.courseId)">刪除</button>
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
import { fetchCourses, deleteCourse } from '@/api/courses.js'
import { fetchEnrollments } from '@/api/enrollments.js'

const coursesRaw = ref([])
const enrollmentsRaw = ref([])
const courseEnrollmentCount = ref({})
const error = ref('')
const router = useRouter()

const sortKey = ref('')
const sortOrder = ref('desc')

const courses = computed(() => {
  if (!sortKey.value) return coursesRaw.value
  return [...coursesRaw.value].sort((a, b) => {
    let aVal, bVal
    if (sortKey.value === 'teacherName') {
      aVal = a.teacher ? a.teacher.name : ''
      bVal = b.teacher ? b.teacher.name : ''
    } else if (sortKey.value === 'enrollmentCount') {
      aVal = courseEnrollmentCount.value[a.courseId] || 0
      bVal = courseEnrollmentCount.value[b.courseId] || 0
    } else {
      aVal = a[sortKey.value]
      bVal = b[sortKey.value]
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
    const [coursesRes, enrollmentsRes] = await Promise.all([
      fetchCourses(),
      fetchEnrollments()
    ])
    coursesRaw.value = coursesRes.data
    enrollmentsRaw.value = enrollmentsRes.data
    // 統計每門課程的選課人數
    const countMap = {}
    enrollmentsRaw.value.forEach(enroll => {
      const cid = enroll.id.courseId
      countMap[cid] = (countMap[cid] || 0) + 1
    })
    courseEnrollmentCount.value = countMap
    if (coursesRes.data && coursesRes.data.length > 0) {
      console.log('第一筆課程資料:', coursesRes.data[0])
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
