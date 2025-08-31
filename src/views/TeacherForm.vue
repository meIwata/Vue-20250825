<template>
  <div class="container">
    <h1 class="title">{{ isEdit ? '編輯教師資訊' : '新增教師' }}</h1>
    <form @submit.prevent="submit">
      <label>姓名</label>
      <input v-model.trim="form.name" required maxlength="100" />

      <label>電子郵件</label>
      <input v-model.trim="form.email" type="email" required maxlength="150" />

      <label>年齡</label>
      <input v-model.number="form.age" type="number" min="18" max="120" required />

      <div class="actions">
        <button class="btn" type="submit">{{ isEdit ? '更新' : '建立' }}</button>
        <button class="btn" type="button" @click="goBack">返回</button>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTeacher, createTeacher, updateTeacher } from '@/api/teachers.js'

const route = useRoute()
const router = useRouter()

const id = route.params.id
const isEdit = computed(() => !!id)
const form = ref({ name: '', email: '', age: '' })
const error = ref('')

onMounted(async () => {
  if (isEdit.value) {
    try {
      const { data } = await getTeacher(id)
      form.value = {
        name: data.name,
        email: data.email,
        age: data.age,
      }
    } catch (e) {
      error.value = e?.response?.data?.message || e.message
    }
  }
})

async function submit() {
  error.value = ''
  try {
    if (isEdit.value) {
      await updateTeacher(id, form.value)
    } else {
      await createTeacher(form.value)
    }
    router.push('/teachers')
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
  router.push('/teachers')
}
</script>
