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
      <template v-if="user.id">
        <NDropdown :options="userMenus" size="large" @select="onUserMenu">
          <NButton class="header-user" type="default" @click="onPressUser">
            <template #icon>
              <NIcon><IconPerson /></NIcon>
            </template>
            {{ user.nickname }}
          </NButton>
        </NDropdown>
      </template>
      <template v-else>
        <NButton type="default" size="large" strong @click="onPressSignIn">Sign In</NButton>
      </template>
    </NSpace>
  </NSpace>
</template>
<script lang="ts">
<<<<<<< HEAD
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
=======
import { ref, defineComponent, computed, watch, h } from 'vue';
import type { Component } from 'vue';
import { NButton, NSpin, NSpace, NCard, NA, NIcon, NDropdown, useMessage } from 'naive-ui';
>>>>>>> 4a3626c (~)
import { RouterLink } from 'vue-router';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import {
  PersonSharp as IconPerson,
  PersonCircleOutline as IconUser,
  LogOutOutline as IconSignOut,
} from '@vicons/ionicons5';

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

const renderIcon = (icon: Component) => {
  return () => {
    return h(
      NIcon,
      { size: 24 },
      {
        default: () => h(icon),
      }
    );
  };
};
const userMenus = [
  {
    label: 'User profile',
    key: 'profile',
    icon: renderIcon(IconUser),
  },
  {
    label: 'Sign out',
    key: 'signout',
    icon: renderIcon(IconSignOut),
  },
];

export default defineComponent({
  components: {
    RouterLink,
    NButton,
    NSpin,
    NSpace,
    NDropdown,
    NCard,
<<<<<<< HEAD
    NTag,
    NModal,
    NCollapse,
    NCollapseItem,
=======
    NA,
    NIcon,
    IconPerson,
>>>>>>> 4a3626c (~)
  },
  setup(props, context) {
    const message = useMessage();
    const tabs = ref<TabItem[]>(tabConfigs);
    const currentTabKey = ref<tabkey>(initTabKey);
    const router = useRouter();
    const route = useRoute();
    const userStore = useUserStore();

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
      user: computed(() => userStore.user),
      userMenus,
      onPressUser() {
        console.info('user');
      },
      onUserMenu(key: string) {
        console.info(key);
        if(key === 'profile'){

        }else if(key==='signout'){
          userStore.signOut()
        }
      },
      onPressSignIn() {
        router.push({ name: 'auth' });
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
