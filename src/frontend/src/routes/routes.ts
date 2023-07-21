export const routes = [
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
