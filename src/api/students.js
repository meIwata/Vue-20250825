import http from './http'

// 查詢所有學生資料
export function fetchStudents() {
  return http.get('/students')
}

// 根據ID查詢單一學生資料
export function getStudent(id) {
  // return http.get('/students/' + id)
  return http.get(`/students/${id}`)
}

// 根據姓氏查詢學生
export function getStudentsByLastName(lastName) {
  return http.get(`/students/lastname/${lastName}`)
}

// 根據email查詢學生
export function getStudentsByEmail(email) {
  return http.get(`/students/email/${email}`)
}

// 新增學生資料
export function createStudent(data) {
  return http.post('/students', data)
}

// 修改學生資料
export function updateStudent(id, data) {
  return http.put(`/students/${id}`, data)
}

// 刪除學生資料
export function deleteStudent(id) {
  return http.delete(`/students/${id}`)
}
