<template>
  <NSpace class="page" :size="[24, 0]" :wrap-item="false">
    <NSpace class="tabs-nav" vertical :wrap-item="false">
      <NUl class="tabs-nav-ul">
        <template v-for="item in tabs">
          <NLi :class="['tabs-nav-li', pageName === item.id ? 'tabs-nav-li-active' : '']" @click="onPressItem(item.id)">
            <img class="tabs-nav-li-icon" :src="item.icon" />
            <span>{{ item.name }} </span>
          </NLi>
        </template>
      </NUl>

      <NUl class="tabs-nav-ul">
        <NLi class="tabs-nav-li" @click="onPressSignOut">
          <img class="tabs-nav-li-icon" src="@/assets/icon_logout.png" />
          <span>Logout</span>
        </NLi>
      </NUl>
    </NSpace>
    <NSpace class="tabs-pane" :wrap-item="false">
      <template v-if="pageName === 'profile'">
        <UserProfile />
      </template>
      <template v-if="pageName === 'models'">
        <UserModels />
      </template>
      <template v-if="pageName === 'posts'">
        <UserPosts />
      </template>
    </NSpace>
  </NSpace>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, watch, nextTick, computed } from 'vue';
import { NButton, TabsProps, NTabs, NTabPane, NSpace, NCard, NModal, NGrid, NIcon, NGridItem, NUl, NLi, useMessage } from 'naive-ui';
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
import { useUserStore } from '@/stores/user';

import UserProfile from './user-profile.vue';
import UserModels from './user-models.vue';
import UserPosts from './user-posts.vue';

type tabsFlag = {
  id: string;
  name: string;
  icon: any;
};

export default defineComponent({
  name: 'user',
  components: {
    NButton,
    NTabs,
    NTabPane,
    NSpace,
    NCard,
    NModal,
    NGrid,
    NGridItem,
    NIcon,
    NUl,
    NLi,
    UserProfile,
    UserModels,
    UserPosts,
  },
  setup(props, context) {
    const router = useRouter();
    const userStore = useUserStore();

    const pageName = ref('profile');

    const tabIcon1 = require('@/assets/icon_profile.png');
    const tabIcon2 = require('@/assets/icon_model.png');
    const tabIcon3 = require('@/assets/icon_upload.png');
    const tabIcon4 = require('@/assets/icon_wallet.png');

    const tabs = ref<tabsFlag[]>([
      { id: 'profile', name: 'Your profile', icon: tabIcon1 },
      { id: 'models', name: 'My models', icon: tabIcon2 },
      { id: 'posts', name: 'My posts', icon: tabIcon3 },
      // { sign: 'wallet', name: 'My wallet', icon: tabIcon4 },
    ]);

    const onPressItem = (item: any) => {
      pageName.value = item;
    };

    return {
      tabs,
      pageName,
      onPressItem,
      onPressSignOut() {
        userStore.signOut();
        router.push({ name: 'home' });
      },
    };
  },
});
</script>
<style scoped>
.tabs-nav {
  width: 204px;
  height: 100%;
}
.tabs-nav-ul {
  width: 100%;
  padding: 12px 12px 0;
  border-radius: 20px;
  box-sizing: border-box;
  background-color: #fff;
}
.tabs-nav-li {
  display: flex;
  align-items: center;
  width: 100%;
  height: 44px;
  margin: 0 0 12px;
  padding: 0 12px;
  border-radius: 10px;
  cursor: pointer;
  list-style: none;
  box-sizing: border-box;
}

.tabs-nav-li-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
}
.tabs-nav-li-active {
  background-color: #faf8ff;
}

.tabs-pane {
  flex: 1;
  min-height: 600px;
  background-color: #fff;
  border-radius: 20px;
  padding: 24px;
}
</style>
