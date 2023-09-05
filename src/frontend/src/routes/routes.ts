export const routes = [
  {
    name: 'auth',
    path: '/auth',
    component: () => import('@/pages/auth/index.vue'),
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
        name: 'models',
        path: 'models',
        component: () => import('@/pages/models/index.vue'),
        meta: {
          keepAlive: true,
        },
      },
      {
        name: 'model-upload',
        path: 'model-upload/:modelSn?/:versionSn?',
        component: () => import('@/pages/model-upload/index.vue'),
      },
      {
        name: 'model-detail',
        path: 'models/:modelSn',
        component: () => import('@/pages/model-detail/index.vue'),
      },
      {
        name: 'sd',
        path: 'sd/:modelHashCode',
        component: () => import('@/pages/sd/index.vue'),
      },
      {
        name: 'nodes',
        path: 'nodes',
        component: () => import('@/pages/nodes/index.vue'),
        meta: {
          keepAlive: true,
        },
      },
      {
        name: 'cloud',
        path: 'cloud',
        component: () => import('@/pages/cloud/index.vue'),
      },
      {
        name: 'user',
        path: 'user/:sign',
        component: () => import('@/pages/user/index.vue'),
      },
    ],
  },
  {
    name: 'model-images',
    path: '/images/:id',
    component: () => import('@/pages/model-image/index.vue'),
  },
];
