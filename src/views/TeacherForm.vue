<template>
  <div class="container">
    <h1 class="title">{{ isEdit ? '編輯教師資訊' : '新增教師' }}</h1>
    <form class="pure-form pure-form-stacked" @submit.prevent="submit">
      <div class="pure-control-group">
        <label>姓名</label>
        <input v-model.trim="form.name" required maxlength="100" />
      </div>
      <div class="pure-control-group">
        <label>電子郵件</label>
        <input v-model.trim="form.email" type="email" required maxlength="150" />
      </div>
      <div class="pure-control-group">
        <label>年齡</label>
        <input v-model.number="form.age" type="number" min="18" max="120" required />
      </div>
      <div class="actions">
        <button class="pure-button pure-button-primary" type="submit">{{ isEdit ? '更新' : '建立' }}</button>
        <button class="pure-button" type="button" @click="goBack">返回</button>
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

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.pure-form {
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pure-control-group {
  margin-bottom: 1.5rem;
}

.pure-control-group label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

.pure-control-group input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
