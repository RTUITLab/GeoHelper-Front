import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import axios from 'axios';

// Layouts
import EmptyLayout from '@/components/layouts/EmptyLayout.vue';
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';

// Pages
import Login from '@/views/Login.vue';
import ObjectsView from '@/views/ObjectsView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: 'objects',
        name: 'Objects',
        component: ObjectsView,
      },
      {
        path: 'objects/new',
        name: 'NewObject',
        component: ObjectsView,
      },
      {
        path: 'map',
        name: 'Map',
        component: ObjectsView,
      },
      {
        path: 'settings',
        name: 'Settings',
        component: ObjectsView,
      },
      {
        path: '',
        redirect: '/objects',
      },
    ],
  },
  {
    path: '/login',
    component: EmptyLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: Login,
      },
    ],
  },
];

const history: string[] = [];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  console.log(to.params);
  console.log(history);
});

axios.defaults.baseURL = process.env.VUE_APP_API;
axios.interceptors.response.use((response) => response, (error) => {
  if (error.response.status.toString() === '401') {
    router.push('login');
  }
  return Promise.reject(error);
});

export default router;
