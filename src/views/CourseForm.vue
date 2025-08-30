<template>
  <div class="container">
    <h1 class="title">{{ isEdit ? '編輯課程' : '新增課程' }}</h1>
    <form @submit.prevent="submit">
      <label>課程名稱</label>
      <input v-model.trim="form.courseName" required maxlength="100" />

      <label>學分</label>
      <input type="number" v-model.number="form.credits" required min="1" max="10" />

      <label>課程說明</label>
      <textarea v-model.trim="form.courseDescription" maxlength="500"></textarea>

      <label>授課教師</label>
      <select v-model="form.teacherId" required>
        <option value="" disabled>請選擇老師</option>
        <option v-for="teacher in teachers" :key="teacher.teacherId" :value="teacher.teacherId">
          {{ teacher.name }} (ID: {{ teacher.teacherId }})
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
import { getCourse, createCourse, updateCourse } from '@/api/courses.js'
import { fetchTeachers } from '@/api/teachers.js'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const isEdit = computed(() => !!id)
const form = ref({ courseName: '', credits: 1, courseDescription: '', teacherId: '' })
const error = ref('')
const loading = ref(false)
const teachers = ref([])

onMounted(async () => {
  loading.value = true
  try {
    // 取得所有老師
    const { data: teacherList } = await fetchTeachers()
    teachers.value = teacherList
    // 編輯模式時，取得課程資料
    if (isEdit.value) {
      const { data } = await getCourse(id)
      form.value = {
        courseName: data.courseName || '',
        credits: data.credits || 1,
        courseDescription: data.courseDescription || '',
        teacherId: data.teacher ? data.teacher.teacherId : ''
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
    const payload = {
      courseName: form.value.courseName,
      credits: form.value.credits,
      courseDescription: form.value.courseDescription,
      teacher: { teacherId: form.value.teacherId }
    }
    if (isEdit.value) {
      await updateCourse(id, payload)
    } else {
      await createCourse(payload)
    }
    router.push('/courses')
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
  router.push('/courses')
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
