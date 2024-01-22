<template>
  <NSpace class="page" :size="[24, 0]" :wrap-item="false">
    <Tabs />
    <div class="tabs-pane">
      <router-view v-slot="{ Component, route }">
        <transition name="slide-fade">
          <keep-alive :include="cacheRoutes">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
    <!-- <NSpace class="tabs-pane" :wrap-item="false">
      <template v-if="pageName === 'profile'">
        <UserProfile />
      </template>
      <template v-if="pageName === 'models'">
        <UserModels />
      </template>
      <template v-if="pageName === 'posts'">
        <UserPosts />
      </template>
      <template v-if="pageName === 'balance'">
        <UserBalance />
      </template>
      <template v-if="pageName === 'upgrade'">
        <UserUpgrade />
      </template>
    </NSpace> -->
  </NSpace>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { NSpace, NIcon, NCollapse, NCollapseItem, useMessage } from 'naive-ui';

import type { CollapseProps } from 'naive-ui';

import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import Tabs from './tabs.vue';

const router = useRouter();
const userStore = useUserStore();

const cacheRoutes = ref<string[]>([]);
// const routes = router?.options?.routes || [];
// const layoutRoute = routes.find((i: any) => i.name === 'layout');

// layoutRoute?.children?.forEach((i: any) => {
//   if (i?.meta?.keepAlive && typeof i?.name === 'string') cacheRoutes.value.push(i.name);
// });

// console.info(`cache routes: ${cacheRoutes.value.join(', ')}`);

onMounted(() => {
  console.info('user mounted');
});
</script>
<style scoped>
.tabs-pane {
  flex: 1;
  min-height: 600px;
}
</style>
