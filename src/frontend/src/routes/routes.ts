export const routes = [
  {
    name: 'layout',
    path: '/',
    component: () => import('@/layout/app/index.vue'),
    redirect: {
      name: 'models',
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
        name: 'nodes',
        path: 'nodes',
        component: () => import('@/pages/nodes/index.vue'),
        meta: {
          keepAlive: true,
        },
      },
    ],
  },
];
