<template>
  <div class="item" @click="onPressItem">
    <NSpace class="item-carousel-wrap" :wrap-item="false">
      <!-- <NCarousel class="item-carousel" :autoplay="true">
        <template v-for="cover in item.covers">
          <AppImage class="item-cover" :src="cover" object-fit="cover" :preview-disabled="true" :imgProps="{ style: 'width:100%;height:100%;' }" />
        </template>
      </NCarousel> -->
      <!-- <AppImage class="item-cover" :src="item.covers[0]" object-fit="cover" :preview-disabled="true" :imgProps="{ style: 'width:100%;height:100%;' }" /> -->
      <LazyImg class="item-cover" :url="item.covers[0]" />

      <NSpace class="item-carousel-overlay" :wrap-item="false">
        <NSpace class="item-carousel-overlay-type" :wrap-item="false" align="center">{{ item.type }}</NSpace>
        <NSpace class="item-carousel-overlay-footer" vertical :wrap-item="false" :size="[0, 12]">
          <NText style="color: #fff">{{ item.name }}</NText>
          <!-- <NSpace :size="[8, 0]" :wrap-item="false">
            <NAvatar round :size="24" src="https://s3.emchub.ai/hub-media/emc-hub-a63123cf/82/20230902/1-1.png" />
            <NText style="font-size: 12px; color: #fff">{{ 'user' + item.userId }}</NText>
          </NSpace> -->
        </NSpace>
      </NSpace>
    </NSpace>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { NSpace, NCarousel, NTag, NAvatar, NText } from 'naive-ui';
import AppImage from '@/components/app-image.vue';
import { useUserStore } from '@/stores/user';
import { LazyImg } from 'vue-waterfall-plugin-next';
import 'vue-waterfall-plugin-next/dist/style.css';

export default defineComponent({
  name: 'model-item',
  components: { NSpace, NCarousel, NTag, NAvatar, NText, AppImage },
  props: { item: { type: Object, default: () => ({}) } },
  emits: ['press'],
  setup(props, ctx) {
    // const userStore = useUserStore();
    // const userNickname = ref(userStore.user.nickname);
    return {
      LazyImg,
      onPressItem() {
        ctx.emit('press', props.item);
      },
    };
  },
});
</script>
<style scoped>
.item {
  border-radius: 6px;
  box-shadow: 1px 1px 6px 0 #ccc;
  cursor: pointer;
  box-sizing: border-box;
  overflow: hidden;
}

.item-carousel-wrap {
  position: relative;
  width: 100%;
  /* padding-top: calc(100% * 1.25); */
}

.item-carousel-overlay {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.item-cover {
  width: 100%;
  height: 100%;
  transform: scale(1);
  transition: all 0.2s;
  object-fit: cover;
}

.item-cover:hover {
  transform: scale(1.2);
}

.item-carousel-overlay-type {
  position: absolute;
  top: 16px;
  left: 16px;
  height: 20px;
  padding: 0px 12px;
  font-size: 12px;
  color: #ffffff;
  border-radius: 40px;
  background-color: #00000052;
}

.item-carousel-overlay-footer {
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  padding: 12px;
  background-color: #00000052;
}

.item-carousel {
  /* position: absolute;
  left: 0;
  top: 0; */
  width: 100%;
  height: 100%;
}

.item-body {
  padding: 16px 16px;
}

.item-body-row {
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
}

.item-body-row:not(:last-child) {
  margin-bottom: 8px;
}

.item-body-row-tag {
  margin-right: 12px;
}

.item-body-row:not(:last-child) .item-body-row-tag {
  margin-right: 0px;
}
</style>
