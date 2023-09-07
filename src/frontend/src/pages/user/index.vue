<template>
  <NLayout has-sider style="background: #f9f9f9">
    <NLayoutSider collapse-mode="width" :width="240" :content-style="siderStyle.style">
      <NMenu :collapsed="false" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions" key-field="whateverKey" label-field="whateverLabel" children-field="whateverChildren" />
    </NLayoutSider>
    <NLayoutContent :content-style="contentStyle.style"> 平山道 </NLayoutContent>
  </NLayout>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, watch, nextTick, computed } from 'vue';
import { NLayout, NLayoutSider, NLayoutContent, NMenu } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
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
    const collapsed = ref(true);
    const menuOptions: MenuOption[] = [
      {
        whateverLabel: '且听风吟',
        whateverKey: 'hear-the-wind-sing',
      },
      {
        whateverLabel: '1973年的弹珠玩具',
        whateverKey: 'pinball-1973',
      },
      {
        whateverLabel: '寻羊冒险记',
        whateverKey: 'a-wild-sheep-chase',
      },
      {
        whateverLabel: '舞，舞，舞',
        whateverKey: 'dance-dance-dance',
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

    const siderStyle = computed(() => {
      return {
        style: {
          'margin-right': '240px',
          'padding': '12px',
          'border-radius': '20px',
        },
      };
    });
    const contentStyle = computed(() => {
      return { style: { padding: '24px' } };
    });

    return {
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
