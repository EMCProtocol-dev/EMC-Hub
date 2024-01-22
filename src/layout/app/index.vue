<template>
  <NLayout content-style="padding-top: 84px;">
    <NLayoutHeader class="n-header">
      <Header />
    </NLayoutHeader>
    <NLayoutContent style="background-color: #f9f9f9" content-style="max-width:1440px;margin:auto;padding: 24px;min-height:calc(100vh - 84px)">
      <router-view v-slot="{ Component, route }">
        <keep-alive :include="cacheRoutes">
          <component :is="Component" :key="routeKey(route)" />
        </keep-alive>
      </router-view>
    </NLayoutContent>
  </NLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { NLayout, NLayoutHeader, NLayoutContent } from 'naive-ui';
import Header from '@/layout/app/header.vue';
import { routes } from '@/routes/routes';

const cacheRoutes = ref<string[]>([]);

onMounted(() => {
  const layoutRoute = routes.find((i: any) => i.name === 'layout');
  layoutRoute?.children?.forEach((i: any) => {
    if (typeof i.name === 'string' && i.name && i.meta?.keepAlive) {
      cacheRoutes.value.push(i.name);
    }
  });
  console.info(`cache routes: ${cacheRoutes.value.join(', ')}`);
});

function routeKey(route: any) {
  const userRoute = route.matched.find((item: any) => item.path === '/user');
  if (userRoute) {
    return userRoute.path;
  } else {
    return route.fullPath;
  }
}
</script>
<style scoped>

.n-header {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 84px;
  z-index: 99;
}
</style>
