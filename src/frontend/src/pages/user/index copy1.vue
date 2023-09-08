<template>
  <NLayout has-sider style="background: #f9f9f9">
    <NLayoutSider collapse-mode="width" :width="240" content-style="padding: 12px" :style="siderStyle.style">
      <NMenu :value="activeKey" :collapsed="false" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions" key-field="whateverKey" label-field="whateverLabel" children-field="whateverChildren" />
    </NLayoutSider>
    <NLayoutContent content-style=""> 123123 </NLayoutContent>
  </NLayout>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, watch, nextTick, computed, h, Component } from 'vue';
import { NLayout, NLayoutSider, NLayoutContent, NMenu, NIcon } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
import { BookOutline as BookIcon, PersonOutline as PersonIcon, WineOutline as WineIcon } from '@vicons/ionicons5';

import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
import UserProfile from './user-profile.vue';
import UserPosts from './user-posts.vue';

export default defineComponent({
  name: 'user',
  components: {
    NLayout,
    NLayoutSider,
    NLayoutContent,
    NMenu,
  },
  setup(props, context) {
    // const tabIcon1 = require('@/assets/icon_profile.png');
    // const tabIcon2 = require('@/assets/icon_model.png');
    // const tabIcon3 = require('@/assets/icon_upload.png');
    // const tabIcon4 = require('@/assets/icon_wallet.png');

    const collapsed = ref(true);
    const activeKey = ref<string | null>(null);
    const menuOptions: MenuOption[] = [
      {
        whateverLabel: 'Your profile',
        whateverKey: 'profile',
        icon: renderIcon(BookIcon),
      },
      {
        whateverLabel: 'My models',
        whateverKey: 'models',
        icon: renderIcon(BookIcon),
      },
      {
        whateverLabel: 'My posts',
        whateverKey: 'posts',
        icon: renderIcon(BookIcon),
      },
      {
        whateverLabel: 'My wallet',
        whateverKey: 'wallet',
        icon: renderIcon(BookIcon),

        whateverChildren: [
          {
            whateverLabel: '人物',
            whateverKey: 'people',
          },
          {
            whateverLabel: '人物',
            whateverKey: 'people1',
          },
        ],
      },
    ];

    function renderIcon(icon: Component) {
      return () => h(NIcon, null, { default: () => h(icon) });
    }

    const siderStyle = computed(() => {
      return {
        style: {
          'border-radius': '20px',
          'margin-right': '24px',
        },
      };
    });
    const contentStyle = computed(() => {
      return {
        style: {
          padding: '24px',
        },
      };
    });

    return {
      activeKey, 
      menuOptions,
      collapsed,
      siderStyle,
      contentStyle,
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
