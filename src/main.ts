import { createApp } from 'vue';
import AppSetup from './AppSetup.vue';
import { router } from './routes/index';
import { Utils } from './tools/utils';
// import { VueMasonryPlugin } from 'vue-masonry';

import moment from 'moment';

import { pinia } from './stores/index';
import './style.css';

moment.locale('en-us');

const app = createApp(AppSetup);

app.config.globalProperties.$filters = {
  address(value: any, limit: number) {
    if (!value) {
      return '';
    }
    return Utils.formatAddress(value, limit);
  },
};

app.use(router);
app.use(pinia);
// app.use(VueMasonryPlugin);

app.mount('#app');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    const registerList: ReadonlyArray<ServiceWorkerRegistration> = await navigator.serviceWorker.getRegistrations();
    console.info(`serviceWorker.getRegistrations`, registerList.length);
    registerList.forEach(async (registration) => {
      const r = await registration.unregister();
      console.info('registration.unregister', registration, r);
    });
  });
}
