import http from './http'
// 對一下 Java Controller 的API進行呼叫
// 查詢所有教師資料
export function fetchTeachers() {
  return http.get('/teachers')
}

// 根據ID查詢單一教師資料
export function getTeacher(id) {
  return http.get(`/teachers/${id}`)
}

// 根據年齡查詢教師
export function getTeachersByAge(age) {
  return http.get(`/teachers/age/${age}`)
}

// 新增教師資料
export function createTeacher(data) {
  return http.post('/teachers', data)
}

// 修改教師資料
export function updateTeacher (id, data) {
  return http.put(`/teachers/${id}`, data)
}

// 刪除教師資料
export function deleteTeacher(id) {
  return http.delete(`/teachers/${id}`)
}