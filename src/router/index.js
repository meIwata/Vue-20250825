import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import StudentList from '@/views/StudentList.vue'
import StudentForm from '@/views/StudentForm.vue'

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
  ],
})

export default router
