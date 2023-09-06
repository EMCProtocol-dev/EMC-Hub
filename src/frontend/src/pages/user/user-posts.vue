<template>
  <NSpace class="page" vertical :size="[24, 0]" :wrap-item="false">
    <NH2>Your posts</NH2>
    <NSpace align="center" :size="[12, 0]" :wrap-item="false">
      <NAvatar round :size="64" src="">123</NAvatar>
      <NSpace vertical :size="[0, 6]" :wrap-item="false">
        <NText depth="1" style="font-size: 16px">{{ userNickname }}</NText>
        <NText depth="3">{{ userNickname }}</NText>
      </NSpace>
    </NSpace>
    <NTabs class="custom-tabs" type="line" animated tab-style="marginTop:24px;">
      <template v-for="item in tabs">
        <NTabPane :name="item">
          <template #tab>{{ item }}</template>
        </NTabPane>
      </template>
    </NTabs>
  </NSpace>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, watch, nextTick, computed } from 'vue';
import { NH2, NText, NAvatar, NSpace, NTabs, NTabPane, NGrid, NIcon, NGridItem, NUl, NLi, useMessage } from 'naive-ui';
import { useUserStore } from '@/stores/user';

export default defineComponent({
  name: 'user-posts',
  components: {
    NH2,
    NText,
    NAvatar,
    NSpace,
    NTabs,
    NTabPane,
    NGrid,
    NGridItem,
    NIcon,
    NUl,
    NLi,
  },
  setup(props, context) {
    const userStore = useUserStore();
    const userNickname = ref(userStore.user.nickname);

    const tabs = ref(['posts', 'p111osts']);
    onMounted(() => {});

    return { userNickname, tabs };
  },
});
</script>
<style scoped>
.page {
  width: 100%;
}
</style>
