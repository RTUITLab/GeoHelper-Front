import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import axios from 'axios';
import EmptyLayout from '@/components/layouts/EmptyLayout.vue';
import Login from '@/views/Login.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: EmptyLayout,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: Login,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

axios.defaults.baseURL = process.env.VUE_APP_API;
axios.interceptors.response.use((response) => response, (error) => {
  if (error.response.status.toString() === '401') {
    router.push('login');
  }
  return Promise.reject(error);
});

export default router;
