<template>
  <NSpace class="page" vertical :size="[24, 0]" :wrap-item="false">
    <NH2>Your posts</NH2>
    <NSpace align="center" :size="[12, 0]" :wrap-item="false">
      <NAvatar round :size="64" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
      <NSpace vertical :size="[0, 6]" :wrap-item="false">
        <NText depth="1" style="font-size: 16px">{{ userNickname }}</NText>
        <NText depth="3">{{ userNickname }}</NText>
      </NSpace>
    </NSpace>
    <NTabs type="card" animated tab-style="marginTop:24px">
      <NTabPane name="profile">
        <template #tab>Your profile</template>
        <NSpace class="tabs-pane">Open Modal</NSpace>
      </NTabPane>
      <NTabPane name="posts">
        <template #tab>My posts</template>
      </NTabPane>
      <NTabPane name="posts">
        <template #tab>My posts</template>
      </NTabPane>
    </NTabs>
  </NSpace>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, watch, nextTick, computed } from 'vue';
import { NButton, NH2, NText, NAvatar, NSpace, NTabs, NTabPane, NCard, NModal, NGrid, NIcon, NGridItem, NUl, NLi, useMessage } from 'naive-ui';
import { useUserStore } from '@/stores/user';

export default defineComponent({
  name: 'user-posts',
  components: {
    NButton,
    NH2,
    NText,
    NAvatar,
    NSpace,
    NTabs,
    NTabPane,
    NCard,
    NModal,
    NGrid,
    NGridItem,
    NIcon,
    NUl,
    NLi,
  },
  setup(props, context) {
    const userStore = useUserStore();
    // const { nickname } = userStore.user;
    const userNickname = ref(userStore.user.nickname);

    onMounted(() => {});

    return { userNickname };
  },
});
</script>
<style scoped></style>
