<template>
  <div class="item" @click="onPressItem">
    <div class="item-carousel-wrap">
      <NCarousel class="item-carousel" :autoplay="true">
        <template v-if="item.covers.length > 0">
          <template v-for="cover in item.covers">
            <AppImage
              class="item-cover"
              :src="cover.url"
              object-fit="cover"
              :preview-disabled="true"
              :imgProps="{ style: 'width:100%;height:100%;' }"
            />
          </template>
        </template>
        <template v-else>
          <NEmpty style="padding: 40px 0" description="No covers" />
        </template>
      </NCarousel>
    </div>
    <NSpace class="item-body" align="center" :size="[0, 8]" :wrap-item="false" :wrap="false">
      <NSpace vertical :size="[0, 0]" :wrap-item="false">
        <NText class="name">{{ item.modelName }}</NText>
      </NSpace>
    </NSpace>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import type { PropType } from 'vue';
import { NSpace, NCarousel, NText, NIcon, NEmpty } from 'naive-ui';
import AppImage from '@/components/app-image.vue';

export type LoraItemCover = {
  url: string;
};

export type LoraItem = {
  label: string;
  modelName: string;
  modelVersion: string;
  covers: LoraItemCover[];
  alias: string;
  hashCodeSha256: string;
  shortHashCodeSha256: string;
};

export default defineComponent({
  name: 'lora-item',
  components: { NSpace, NCarousel, NText, NIcon, NEmpty, AppImage },
  props: {
    item: { type: Object as PropType<LoraItem>, default: () => ({}) },
  },
  emits: ['press'],
  setup(props, ctx) {
    return {
      onPressItem() {
        ctx.emit('press', props.item);
      },
    };
  },
});
</script>
<style scoped>
.item {
  width: 100%;
  border: solid 1px #f1f1f1;
  border-radius: 8px;
  box-shadow: 1px 1px 6px 0 #ccc;
  cursor: pointer;
}

.item-carousel {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.item-cover {
  width: 100%;
  height: 100%;
  transform: scale(1);
  transition: all 0.2s;
}

.item-cover:hover {
  transform: scale(1.2);
}

.item-carousel-wrap {
  width: 100%;
  padding-top: calc(100% * 1.25);
  position: relative;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  overflow: hidden;
}
.item-body {
  padding: 8px;
}
.item-body-row {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
