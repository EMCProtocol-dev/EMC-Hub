<template>
  <NSpace class="header" align="center" justify="space-between" :size="[0, 0]" :wrap-item="false">
    <NSpace class="header-cell">
      <RouterLink :to="{ path: '/' }">
        <img class="header-icon" />
      </RouterLink>
    </NSpace>
    <NSpace class="header-cell" align="center" justify="space-between" :wrap-item="false">
      <NSpace class="header-tabs" align="center" :size="[24, 0]" :wrap-item="false">
        <template v-for="item in tabs">
          <RouterLink :to="{ path: item.path }" style="text-decoration: none; color: inherit">
            <div class="header-tabs-item" :class="{ 'header-tabs-item__actived': item.id === currentTabKey }">
              <span class="header-tabs-item-text">{{ item.name }}</span>
            </div>
          </RouterLink>
        </template>
      </NSpace>
      <template v-if="isLogin">
        <div class="header-user" @click="onPressUser">Logined</div>
      </template>
      <template v-else>
        <NButton type="default" size="large" strong @click="onPressLogin">Sign Up</NButton>
      </template>
    </NSpace>
  </NSpace>
</template>
<script lang="ts">
import { ref, defineComponent, watch, nextTick } from 'vue';
import {
  NButton,
  NSpin,
  NSpace,
  NMenu,
  NCard,
  NTag,
  NModal,
  NCarousel,
  NCollapse,
  NCollapseItem,
  useMessage,
} from 'naive-ui';
import { RouterLink } from 'vue-router';
import { useRouter, useRoute } from 'vue-router';
import { useLogin } from '@/composables/use-login';
import { instance as emcAuthClient, AuthClient } from '@emcecosystem/auth-client';

type tabkey = number;

type TabItem = {
  id: tabkey;
  name: string;
  path: string;
};

const tabConfigs: TabItem[] = [
  { id: 1, name: 'Home', path: '/home' },
  { id: 2, name: 'Models', path: '/models' },
  { id: 3, name: 'EMC Nodes', path: '/nodes' },
];

const initTabKey = -1;

export default defineComponent({
  components: {
    RouterLink,
    NButton,
    NSpin,
    NSpace,
    NMenu,
    NCarousel,
    NCard,
    NTag,
    NModal,
    NCollapse,
    NCollapseItem,
  },
  emits: ['isLoading'],
  setup(props, context) {
    const message = useMessage();
    const tabs = ref<TabItem[]>(tabConfigs);

    const currentTabKey = ref<tabkey>(initTabKey);
    const isLogin = ref(false);
    const router = useRouter();
    const route = useRoute();
    watch(
      () => route.path,
      (path, oldVal) => {
        const item = tabs.value.find((item) => item.path === path);
        currentTabKey.value = item?.id || initTabKey;
      },
      { immediate: true }
    );

    return {
      tabs,
      currentTabKey,
      isLogin,
      onPressUser() {
        console.info('user');
      },
      onPressLogin() {
        context.emit('isLoading', true);
        emcAuthClient.login({
          onSuccess: (message) => {
            console.info('success', message);
            if (message.type === 'authorize-success') {
              isLogin.value = true;
              context.emit('isLoading', false);
            }
          },
          onError(message) {
            console.info(message);
            context.emit('isLoading', false);
          },
        });
      },
    };
  },
});
</script>
<style scoped>
.header {
  --header-height: 84px;
  height: var(--header-height);
  border-bottom: solid 1px #e7e7e7;
}
.header-cell {
  position: relative;
  padding: 0 32px;
}

.header-icon {
  width: 204px;
  height: 76px;
  object-fit: cover;
  content: url('@/assets/logo.png');
}

.header-tabs {
  --actived-color: #8f7df8;
  margin-right: 24px;
}

.header-tabs-item {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: var(--header-height);
}

.carousel-item {
  width: 100%;
  height: 52px;
  line-height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.carousel-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  filter: drop-shadow(0px 2px 4px rgba(37, 0, 54, 0.1));
  margin-left: 4px;
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
  .header-icon {
    content: url('@/assets/logo.light.png');
  }
}
</style>
@/composables/use-login
