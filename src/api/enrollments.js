import http from './http';

// 查詢所有選課資料
export function fetchEnrollments() {
  return http.get('/enrollments');
}

// 查詢單筆選課資料
export function getEnrollment(studentId, courseId) {
  return http.get(`/enrollments/${studentId}/${courseId}`);
}

// 新增選課資料
export function createEnrollment(studentId, courseId) {
  return http.post(`/enrollments/${studentId}/${courseId}`);
}

// 更新選課資料
export function updateEnrollment(studentId, courseId, enrollment) {
  return http.put(`/enrollments/${studentId}/${courseId}`, enrollment);
}

// 刪除選課資料
export function deleteEnrollment(studentId, courseId) {
  return http.delete(`/enrollments/${studentId}/${courseId}`);
}
