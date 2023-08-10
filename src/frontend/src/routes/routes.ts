export const routes = [
  {
    name: 'auth',
    path: '/auth',
    component: () => import('@/pages/auth/index.vue'),
  },
  {
    name: 'dev',
    path: '/dev',
    component: () => import('@/pages/dev/index.vue'),
  },
  {
    name: 'layout',
    path: '/',
    component: () => import('@/layout/app/index.vue'),
    redirect: {
      name: 'home',
    },
    children: [
      {
        name: 'home',
        path: 'home',
        component: () => import('@/pages/home/index.vue'),
      },
      {
<<<<<<< HEAD
=======
        name: 'models',
        path: 'models',
        component: () => import('@/pages/models/index.vue'),
        meta: {
          keepAlive: true,
        },
      },
      {
        name: 'model-upload',
        path: 'model-upload',
        component: () => import('@/pages/model-upload/index.vue'),
      },
      {
        name: 'model-detail',
        path: 'models/:id',
        component: () => import('@/pages/model-detail/index.vue'),
      },
      {
>>>>>>> ac1038c (~)
        name: 'nodes',
        path: 'nodes',
        component: () => import('@/pages/nodes/index.vue'),
        meta: {
          keepAlive: true,
        },
      },
      {
        name: 'models',
        path: 'models',
        component: () => import('@/pages/models/index.vue'),
      },
      {
        name: 'model-detail',
        path: 'models/:id',
        component: () => import('@/pages/model-detail/index.vue'),
      },
    ],
  },
];
