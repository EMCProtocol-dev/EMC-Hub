<template>
  <NSpace class="header" align="center" justify="space-between" :size="[24, 0]" :wrap-item="false" :wrap="false">
    <NSpace class="header-cell" align="center" :wrap-item="false" :wrap="false">
      <HeaderLogo />
    </NSpace>
    <NSpace class="header-cell" align="center" :wrap-item="false" :wrap="false">
      <!-- <div>
        {{ [isMobile, isTablet, isSmallDesktop, isDesktop] }}
      </div> -->
      <template v-if="isSmallDesktop || isDesktop">
        <HeaderTabs :config="tabs" :init-key="-1" />
        <HeaderUser />
      </template>
      <template v-else>
        <HeaderMenu :config="tabs" />
      </template>
    </NSpace>
  </NSpace>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { NSpace } from 'naive-ui';
import { RouterLink } from 'vue-router';
import HeaderLogo from './header-logo.vue';
import HeaderTabs from './header-tabs.vue';
import HeaderMenu from './header-menu.vue';
import type { tabItem } from './header-tabs.vue';
import HeaderUser from './header-user.vue';
import { useIsMobile, useIsTablet, useIsSmallDesktop, useIsDesktop } from '@/composables/use-screen';

export default defineComponent({
  components: { RouterLink, NSpace, HeaderLogo, HeaderTabs, HeaderMenu, HeaderUser },
  setup(props, context) {
    const tabs: tabItem[] = [
      { id: 1, name: 'Home', path: '/home' },
      { id: 2, name: 'Models', path: '/models' },
      { id: 3, name: 'EMC Nodes', path: 'https://dashboard.edgematrix.pro' },
      { id: 4, name: 'De-GPU Network', path: '/cloud' },
    ];
    const isMobile = useIsMobile();
    const isTablet = useIsTablet();
    const isSmallDesktop = useIsSmallDesktop();
    const isDesktop = useIsDesktop();

    return {
      tabs,
      isMobile,
      isTablet,
      isSmallDesktop,
      isDesktop,
    };
  },
});
</script>
<style scoped>
.header {
  --header-height: 84px;
  height: var(--header-height);
  padding: 0 24px;
  border-bottom: solid 1px #e7e7e7;
}

.header-cell {
  position: relative;
}
</style>
