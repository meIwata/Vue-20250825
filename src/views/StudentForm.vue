<template>
  <div class="container">
    <h1 class="title">{{ isEdit ? '編輯學生資訊' : '新增學生' }}</h1>
    <form @submit.prevent="submit">
      <label>名字</label>
      <input v-model.trim="form.firstName" required maxlength="100" />

      <label>姓氏</label>
      <input v-model.trim="form.lastName" required maxlength="100" />

      <label>電子郵件</label>
      <input v-model.trim="form.email" type="email" required maxlength="150" />

      <label>生日</label>
      <input v-model.trim="form.birthday" type="date" required />

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
import { getStudent, createStudent, updateStudent } from '@/api/students'

const route = useRoute()
const router = useRouter()

const id = route.params.id
const isEdit = computed(() => !!id)
const form = ref({ firstName: '', lastName: '', email: '', birthday: '' })
const error = ref('')

onMounted(async () => {
  if (isEdit.value) {
    try {
      const { data } = await getStudent(id)
      form.value = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        birthday: data.birthday,
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
      await updateStudent(id, form.value)
    } else {
      await createStudent(form.value)
    }
    router.push('/students')
  } catch (e) {
    // 顯示後端驗證訊息
    if (e?.response?.data?.fields) {
      const msgs = Object.entries(e.response.data.fields).map(([k, v]) => `${k}: ${v}`)
      error.value = msgs.join(' | ')
    } else {
      error.value = e?.response?.data?.message || e.message
    }
  }
}

function goBack() {
  router.push('/students')
}
</script>
