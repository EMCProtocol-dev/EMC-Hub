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
      <div class="tabs-nav-wallet">
        <template v-for="item in tabsWallet">
          <NCollapse @item-header-click="handleItemHeaderClick">
            <template v-for="(item, index) in tabsWallet">
              <NCollapseItem :name="item.name" style="margin: 0">
                <template #header-extra>
                  <div class="tabs-nav-li">
                    <img class="tabs-nav-li-icon" :src="item.icon" />
                    <span>{{ item.name }} </span>
                  </div>
                </template>
                <template v-for="items in item.children">
                  <div :class="['tabs-nav-children', pageName === items.id ? 'tabs-nav-li-active' : '']" @click="onPressItem(items.id)">
                    <span>{{ items.name }} </span>
                  </div>
                </template>
              </NCollapseItem>
            </template>
          </NCollapse>
        </template>
      </div>

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
      <template v-if="pageName === 'balance'">
        <UserBalance />
      </template>
      <template v-if="pageName === 'upgrade'">
        <UserUpgrade />
      </template>
    </NSpace>
  </NSpace>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, watch, nextTick, computed } from 'vue';
import { NButton, TabsProps, NTabs, NTabPane, NSpace, NCard, NModal, NGrid, NIcon, NGridItem, NUl, NLi, NCollapse, NCollapseItem, useMessage } from 'naive-ui';
import type { CollapseProps } from 'naive-ui';
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
import { useUserStore } from '@/stores/user';
import UserProfile from './user-profile.vue';
import UserModels from './user-models.vue';
import UserPosts from './user-posts.vue';
import UserBalance from './user-balance.vue';
import UserUpgrade from './user-upgrade.vue';
import tabIcon1 from '@/assets/icon_profile.png';
import tabIcon2 from '@/assets/icon_model.png';
import tabIcon3 from '@/assets/icon_upload.png';
import tabIcon4 from '@/assets/icon_wallet.png';

type tabsFlag = {
  id: string;
  name: string;
  icon: any;
  children: Array<tabsItemFlag>;
};
type tabsItemFlag = {
  id: string;
  name: string;
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
    NCollapse,
    NCollapseItem,
    UserProfile,
    UserModels,
    UserPosts,
    UserBalance,
    UserUpgrade,
  },
  setup(props, context) {
    const router = useRouter();
    const userStore = useUserStore();

    const pageName = ref('profile');

    const tabs = ref<tabsFlag[]>([
      { id: 'profile', name: 'Your profile', icon: tabIcon1, children: [] },
      { id: 'models', name: 'My models', icon: tabIcon2, children: [] },
      { id: 'posts', name: 'My posts', icon: tabIcon3, children: [] },
    ]);

    const tabsWallet = ref<tabsFlag[]>([
      {
        id: 'wallet',
        name: 'My wallet',
        icon: tabIcon4,
        children: [
          { id: 'balance', name: 'Balance' },
          { id: 'upgrade', name: 'Upgrade' },
        ],
      },
    ]);

    const message = useMessage();
    const handleItemHeaderClick: CollapseProps['onItemHeaderClick'] = ({ name, expanded }) => {
      pageName.value = 'balance';
    };

    const onPressItem = (item: any) => {
      pageName.value = item;
    };

    return {
      tabs,
      tabsWallet,
      pageName,
      onPressItem,
      handleItemHeaderClick,
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
  padding: 12px;
  border-radius: 20px;
  box-sizing: border-box;
  background-color: #fff;
}
.tabs-nav-wallet {
  width: 100%;
  padding: 0px 12px 12px;
  border-radius: 0 0 20px 20px;
  box-sizing: border-box;
  background-color: #fff;
  margin-top: -34px;
}
.tabs-nav-li {
  display: flex;
  align-items: center;
  width: 100%;
  height: 44px;
  line-height: 44px;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  list-style: none;
  box-sizing: border-box;
}
.tabs-nav-children {
  width: 100%;
  height: 44px;
  line-height: 44px;
  border-radius: 10px;
  cursor: pointer;
  box-sizing: border-box;
  padding-left: 46px;
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
}
.page:deep(.n-collapse-item__header) {
  flex-direction: row-reverse;
  padding: 0;
  margin: 6px 0;
}

.page:deep(.n-collapse-item) {
  border: none;
}

.page:deep(.n-collapse-item__header-extra) {
  width: 100%;
}

.page:deep(.n-collapse-item__content-inner) {
  padding-top: 0 !important;
}
</style>
