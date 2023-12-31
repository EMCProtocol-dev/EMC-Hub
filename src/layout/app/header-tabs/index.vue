<template>
  <NSpace class="header-tabs" align="center" :size="[24, 0]" :wrap-item="false" :wrap="false">
    <template v-for="item in tabs">
      <AppLink class="header-tabs-item" active-class="header-tabs-item__actived" :link="item.path" :target="item.path.startsWith('http') ? '_blank' : '_self'">
        <span class="header-tabs-item-text">{{ item.name }}</span>
      </AppLink>
    </template>
  </NSpace>
</template>

<script lang="ts">
import { ref, defineComponent, watch } from 'vue';
import { NSpace } from 'naive-ui';
import { useRoute } from 'vue-router';
import AppLink from '@/components/app-link.vue';

import { useIsMobile, useIsTablet, useIsSmallDesktop, useIsDesktop } from '@/composables/use-screen';
import type { TabItem, tabkey } from './index';

export default defineComponent({
  props: {
    initKey: { type: Number, default: -1 },
    config: { type: Array<TabItem>, default: (): TabItem[] => [] },
  },
  components: { NSpace, AppLink },
  setup(props, context) {
    const tabs = ref<TabItem[]>(props.config);
    const currentKey = ref<tabkey>(props.initKey);
    const route = useRoute();

    const isMobile = useIsMobile();
    const isTablet = useIsTablet();
    const isSmallDesktop = useIsSmallDesktop();
    const isDesktop = useIsDesktop();

    watch(
      () => route.path,
      (path, oldVal) => {
        const item = tabs.value.find((item) => item.path === path);
        currentKey.value = item?.id || props.initKey;
      },
      { immediate: true }
    );

    return {
      tabs,
      currentKey,
      isMobile,
      isTablet,
      isSmallDesktop,
      isDesktop,
    };
  },
});
</script>
<style scoped>
.header-tabs {
  --actived-color: #6c2cfd;
  margin-right: 24px;
}

.header-tabs-item {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: var(--layout-header-height);
  white-space: nowrap;
  color: inherit;
}

.header-tabs-item::after {
  content: '';
  display: none;
  position: absolute;
  transform: translate(-50%, 0);
  left: 50%;
  bottom: 0;
  height: 2px;
  width: 32px;
  border-radius: 2px;
  background-color: var(--actived-color);
}

.header-tabs-item.header-tabs-item__actived::after {
  display: block;
}

.header-tabs-item-text {
  font-size: 16px;
  font-weight: 500;
}

.header-tabs-item.header-tabs-item__actived .header-tabs-item-text {
  color: var(--actived-color);
}

@media (prefers-color-scheme: light) {
}
</style>
