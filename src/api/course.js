import http from './http'

// 查詢所有課程
export function getCourses() {
  return http.get('/courses')
}

// 查詢特定課程
export function getCourse(id) {
  return http.get(`/courses/${id}`)
}

// 刪除特定課程
export function deleteCourse(id) {
  return http.delete(`/courses/${id}`)
}

// 新增課程
export function createCourse(course) {
  return http.post('/courses', course)
}

// 更新課程
export function updateCourse(id, course) {
  return http.put(`/courses/${id}`, course)
}
