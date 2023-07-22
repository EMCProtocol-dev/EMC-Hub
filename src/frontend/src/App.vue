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

export default defineComponent({
  name: 'app',
  components: { NSpin },
  setup() {
    const ready = ref(false);
    const loadingBar = useLoadingBar();
    const message = useMessage();
    const userStore = useUserStore();
    const cacheRoutes = ref<string[]>([]);
    const routes = router?.options?.routes || [];

    routes.forEach((i: any) => {
      if (i?.meta?.keepAlive && typeof i?.name === 'string') cacheRoutes.value.push(i.name);
    });

    console.info(`cache routes: ${cacheRoutes.value.join(', ')}`);

    onMounted(() => {
      window.$message = message;
      window.$loadingBar = loadingBar;
      userStore.initLocalData();
      if (userStore.user.id) {
        //init user info
      }
      ready.value = true;
    });

    return {
      ready,
      cacheRoutes,
    };
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
