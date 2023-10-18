<template>
  <NSpace class="page" vertical :size="[0, 24]">
    <div class="header">
      <img class="header-background" src="@/assets/upgrade-background.png" />
      <img class="header-rocket" src="@/assets/img-upgrade-rocket.png" />
      <div class="header-content">
        <span class="header-title">Upgrade your creations</span>
        <img class="header-star" src="@/assets/img-upgrade-star.png" alt="" />
      </div>
    </div>
    <NSpace class="section" vertical :wrap-item="false">
      <NH2>Your posts</NH2>
      <NSpace style="width: 100%" :wrap-item="false" justify="end">
        <div class="record-button">
          <div class="record-button-mask">Upgrade record</div>
        </div>
      </NSpace>
      <NSpace>
        <template v-for="item in list"> </template>
      </NSpace>

      <NSpace class="footer" vertical>
        <NText>PCI compliant payments powered by Paddle and PayPal</NText>
      </NSpace>
    </NSpace>
  </NSpace>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, watch, nextTick, computed } from 'vue';
import { NButton, NH2, NSpace, NCard, NUpload, NModal, NAvatar, NText, NForm, NFormItem, NInput, NGrid, NGridItem, NIcon, NUl, NLi, UploadCustomRequestOptions, useMessage } from 'naive-ui';
import { Http } from '@/tools/http';

import { useUserStore } from '@/stores/user';
import { Utils } from '@/tools/utils';

export default defineComponent({
  name: 'user-profile',
  components: {
    NButton,
    NH2,
    NSpace,
    NCard,
    NModal,
    NGrid,
    NText,
    NGridItem,
    NAvatar,
    NForm,
    NFormItem,
    NInput,
    NUpload,
    NIcon,
    NUl,
    NLi,
  },
  setup(props, context) {
    const list = ref([
      { name: 'AI BEGINNER', price: 0.99, points: 100 },
      { name: 'AI HOBBYIST', price: 7.99, points: 1000 },
      { name: 'AI ARTIST', price: 19.99, points: 2500 },
    ]);
    return { list };
  },
});
</script>
<style scoped>
.page {
  width: 100%;
}
.header {
  width: 100%;
  height: 120px;
  position: relative;
}
.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.header-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  padding-left: 196px;
  line-height: 120px;
  box-sizing: border-box;
  z-index: 2;
}
.header-title {
  font-size: 28px;
  color: #fff;
}
.header-star {
  width: 24px;
  height: 20px;
  margin: 0 0 4px 12px;
}
.header-rocket {
  position: absolute;
  top: -58px;
  left: 0px;
  width: 196px;
  height: 196px;
  z-index: 2;
}
.section {
  width: 100%;
  height: 100%;
  padding: 24px;
  background-color: #fff;
  border-radius: 20px;
  box-sizing: border-box;
}
.record-button {
  background: linear-gradient(91.87deg, #8921c4 -0.05%, #5653f1 98.54%);
  width: 120px;
  height: 38px;
  border-radius: 6px;
  overflow: hidden;
  box-sizing: border-box;
  padding: 1px;
}
.record-button-mask {
  width: 100%;
  height: 100%;
  line-height: 36px;
  background-color: #fff;
  text-align: center;
  border-radius: 5px;
}
</style>
