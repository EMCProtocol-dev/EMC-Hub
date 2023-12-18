import { nextTick } from 'vue';
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import { routes } from './routes';
import { Utils } from '../tools/utils';

export default function createAppRouter(routes: any) {
  const router = createRouter({
    history: createWebHashHistory(import.meta.url),
    routes,
  });

  router.beforeEach(function (to, from, next) {
    if (!from || to.path !== from.path) {
      if (window.$loadingBar) {
        window.$loadingBar.start();
      }
    }
    // const session = Utils.getLocalStorage('emchub.session');
    // if (!from || to.path !== from.path) {
    //   if (window.$loadingBar && to.meta.auth && !session) {
    //     // query: { redirect: to.fullPath }
    //     next({ path: '/home' });
    //   } else if (window.$loadingBar) {
    //     window.$loadingBar.start();
    //   }
    // }
    next();
  });

  router.afterEach(function (to, from) {
    if (!from || to.path !== from.path) {
      if (window.$loadingBar) {
        window.$loadingBar.finish();
      }
      if (to.hash && to.hash !== from.hash) {
        nextTick(() => {
          const el = document.querySelector(to.hash);
          if (el) el.scrollIntoView();
        });
      }
    }
  });

  return router;
}

export const router = createAppRouter(routes);
