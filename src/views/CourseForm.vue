<template>
  <div class="container">
    <h1 class="title">{{ isEdit.value ? '編輯課程' : '新增課程' }}</h1>
    <form @submit.prevent="submit">
      <label>課程名稱</label>
      <input v-model.trim="form.courseName" required maxlength="100" />

      <label>學分</label>
      <input type="number" v-model.number="form.credits" required min="1" max="10" />

      <label>課程說明</label>
      <textarea v-model.trim="form.courseDescription" maxlength="500"></textarea>

      <div class="actions">
        <button class="btn" type="submit">{{ isEdit.value ? '更新' : '建立' }}</button>
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
import { getCourse, createCourse, updateCourse } from '@/api/course'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const isEdit = computed(() => !!id)
const form = ref({ courseName: '', credits: 1, courseDescription: '' })
const error = ref('')
const loading = ref(false)

onMounted(async () => {
  if (isEdit.value) {
    loading.value = true
    try {
      const { data } = await getCourse(id)
      form.value = {
        courseName: data.courseName || '',
        credits: data.credits || 1,
        courseDescription: data.courseDescription || ''
      }
    } catch (e) {
      error.value = e?.response?.data?.message || e.message
    } finally {
      loading.value = false
    }
  }
})

async function submit() {
  error.value = ''
  try {
    if (isEdit.value) {
      await updateCourse(id, form.value)
    } else {
      await createCourse(form.value)
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

input, textarea {
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
