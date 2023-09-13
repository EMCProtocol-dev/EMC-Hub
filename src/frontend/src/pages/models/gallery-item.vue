<template>
  <div class="item" @click="onPressItem">
    <div class="item-carousel-wrap">
      <NCarousel class="item-carousel" :autoplay="true">
        <AppImage class="item-cover" :src="item.url" object-fit="cover" :preview-disabled="true" :imgProps="{ style: 'width:100%;height:100%;' }" />
      </NCarousel>
    </div>
    <div class="item-body">
      <div class="item-body-row">
        <NEllipsis style="max-width: 160px; margin-bottom: 0"> {{ item.imageTitle }}</NEllipsis>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { NSpace, NEllipsis, NCarousel, NTag } from 'naive-ui';
import AppImage from '@/components/app-image.vue';

export default defineComponent({
  name: 'gallery-item',
  components: { NSpace, NCarousel, NTag, NEllipsis, AppImage },
  props: { item: { type: Object, default: () => ({}) } },
  emits: ['press'],
  setup(props, ctx) {
    const onPressItem = () => {
      ctx.emit('press', props.item);
    };
    return {
      onPressItem,
    };
  },
});
</script>
<style scoped>
.item {
  border: solid 1px #f1f1f1;
  border-radius: 8px;
  box-shadow: 1px 1px 6px 0 #ccc;
  cursor: pointer;
}

.item-carousel-wrap {
  width: 100%;
  padding-top: calc(100% * 1.25);
  position: relative;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  overflow: hidden;
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
