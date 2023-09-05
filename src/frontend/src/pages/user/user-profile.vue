<template>
  <NSpace class="page"  :size="[24, 0]" :wrap-item="false">
    <NH2>Your profile</NH2>
  </NSpace>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, watch, nextTick, computed } from 'vue';
import { NButton, NH2, NSpace, NCard, NModal, NGrid, NIcon, NGridItem, NUl, NLi, useMessage } from 'naive-ui';

export default defineComponent({
  name: 'user-profile',
  components: {
    NButton,
    NH2,
    NSpace,
    NCard,
    NModal,
    NGrid,
    NGridItem,
    NIcon,
    NUl,
    NLi,
  },
  setup(props, context) {
    onMounted(() => {});

    return {};
  },
});
</script>
<style scoped></style>
