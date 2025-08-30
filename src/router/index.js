import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import StudentList from '@/views/StudentList.vue'
import StudentForm from '@/views/StudentForm.vue'
import GetStudentById from '@/views/GetStudentById.vue'
import TeacherList from '@/views/TeacherList.vue'
import GetTeacherById from '@/views/GetTeacherById.vue'
import GetTeachersByAge from '@/views/GetTeachersByAge.vue'
import TeacherForm from '@/views/TeacherForm.vue'
import GetStudentsByLastName from '@/views/GetStudentsByLastName.vue'
import GetStudentByEmail from '@/views/GetStudentByEmail.vue'
import CourseList from '@/views/CourseList.vue'
import CourseForm from '@/views/CourseForm.vue'
import GetCourseById from '@/views/GetCourseById.vue'
import EnrollmentList from '@/views/EnrollmentList.vue'
import EnrollmentForm from '@/views/EnrollmentForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: StudentList,
    },
    { path: '/', redirect: '/students' },
    { path: '/students', name: 'students', component: StudentList },
    { path: '/students/new', name: 'students-new', component: StudentForm },
    { path: '/students/:id/edit', name: 'students-edit', component: StudentForm, props: true },
    { path: '/students/search', name: 'students-search', component: GetStudentById },
    { path: '/students/lastname', name: 'students-lastname', component: GetStudentsByLastName },
    { path: '/students/email', name: 'students-email', component: GetStudentByEmail },

    { path: '/teachers', name: 'teachers', component: TeacherList},
    { path: '/teachers/search', name: 'teachers-search', component: GetTeacherById },
    { path: '/teachers/age', name: 'teachers-age', component: GetTeachersByAge },
    { path: '/teachers/new', name: 'teachers-new', component: TeacherForm},
    { path: '/teachers/:id/edit', name: 'teachers-edit', component: TeacherForm, props: true },

    { path: '/courses', name: 'courses', component: CourseList },
    { path: '/courses/new', name: 'courses-new', component: CourseForm },
    { path: '/courses/:id/edit', name: 'courses-edit', component: CourseForm, props: true },
    { path: '/courses/search', name: 'courses-search', component: GetCourseById },

    { path: '/enrollments', name: 'enrollments', component: EnrollmentList },
    { path: '/enrollments/:studentId/:courseId/edit', name: 'enrollments-edit', component: EnrollmentForm, props: true },


  ],
})

export default router
