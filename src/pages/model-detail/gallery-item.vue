<template>
  <div class="item" @click="onPressItem">
    <div class="item-carousel-wrap">
      <NCarousel class="item-carousel" :autoplay="true">
        <!-- <template v-for="cover in item.covers"> -->
        <template v-if="item.url">
          <AppImage class="item-cover" :src="item.url" object-fit="cover" :preview-disabled="true" :imgProps="{ style: 'width:100%;height:100%;' }" />
        </template>
        <template v-else>
          <NEmpty style="padding: 96px 0" />
        </template>
        <!-- </template> -->
      </NCarousel>
    </div>
    <NSpace class="item-body" align="center" :wrap-item="false" :wrap="false">
      <NSpace align="center" justify="center" :wrap-item="false" style="width: 40px; height: 40px; background-color: #f5f5f5; border-radius: 100%; flex-shrink: 0">
        <NIcon size="24"><IconPerson color="#666" /></NIcon>
      </NSpace>
      <!-- <NAvatar round size="large" src="" /> -->
      <NSpace vertical :size="[0, 0]">
        <NH4 class="item-body-row">{{ item.userName || 'user' + item.userId }}</NH4>
        <NH6 class="item-body-row" style="font-size: 12px; color: #666"> {{ createTime }}</NH6>
      </NSpace>
    </NSpace>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { NSpace, NCarousel, NTag, NH6, NH4, NAvatar, NIcon, NEmpty } from 'naive-ui';
import { PersonSharp as IconPerson } from '@vicons/ionicons5';
import moment from 'moment';

import AppImage from '@/components/app-image.vue';

export default defineComponent({
  name: 'model-item',
  components: { NSpace, NCarousel, NTag, NH6, NH4, NAvatar, NIcon, NEmpty, IconPerson, AppImage },
  props: { item: { type: Object, default: () => ({}) } },
  emits: ['press'],

  setup(props, ctx) {
    const { item } = props;
    const createTime = computed(() => {
      const time = moment(item.createTime).fromNow();
      return time;
    });

    return {
      moment,
      createTime,
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
  box-shadow: 1px 1px 6px 0 #cccccc50;
  cursor: pointer;
}

.item-carousel {
  /* position: absolute;
  left: 0;
  top: 0; */
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
  /* padding-top: calc(100% * 1.25); */
  position: relative;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  overflow: hidden;
}
.item-body {
  padding: 10px 16px 16px 16px;
}
.item-body-row {
  margin-bottom: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
