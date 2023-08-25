<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue';
import { useLoadingBar, useMessage, NSpin } from 'naive-ui';
import { router } from '@/routes/index';
import { useUserStore } from '@/stores/user';
import Worker from './file-hash.worker';

export default defineComponent({
  name: 'app',
  components: { NSpin },
  setup() {
    const loadingBar = useLoadingBar();
    const message = useMessage();
    const userStore = useUserStore();
    onMounted(() => {
      window.$message = message;
      window.$loadingBar = loadingBar;
      const worker = new Worker();
      worker.postMessage({ a: 1 });
      userStore.initLocalData();
      if (userStore.user.id) {
        //init user info
      }
    });

    return {};
  },
});
</script>
<style scoped>
.loading {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.n-header {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 84px;
  z-index: 99;
}
</style>
