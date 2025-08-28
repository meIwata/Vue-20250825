<template>
  <div class="get-student-by-id">
    <h2>查詢學生資料</h2>
    <div class="input-row">
      <input v-model="studentId" type="text" placeholder="請輸入學生ID" />
      <button @click="fetchStudent">查詢</button>
    </div>
    <div v-if="loading">查詢中...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="student">
      <h3>學生資料</h3>
      <p>ID: {{ student.studentId }}</p>
      <p>姓: {{ student.lastName }}</p>
      <p>名: {{ student.firstName }}</p>
      <p>email: {{ student.email }}</p>
      <p>生日: {{ student.birthday }}</p>
    </div>
  </div>
</template>

<script>
import { getStudent } from '../api/students'

export default {
  name: 'GetStudentById',
  data() {
    return {
      studentId: '',
      student: null,
      error: '',
      loading: false
    }
  },
  methods: {
    async fetchStudent() {
      this.error = ''
      this.student = null
      if (!this.studentId) {
        this.error = '請輸入學生ID'
        return
      }
      this.loading = true
      try {
        const res = await getStudent(this.studentId)
        this.student = res.data
        if (!this.student) {
          this.error = '查無此學生'
        }
      } catch (e) {
        this.error = '查詢失敗或查無此學生'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.get-student-by-id {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}
.input-row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
