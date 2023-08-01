<template>
  <div class="item" @click="onPressItem">
    <div class="item-carousel-wrap">
      <NCarousel class="item-carousel" :autoplay="true">
        <template v-for="cover in item.covers">
          <img class="item-cover" :src="cover" />
        </template>
      </NCarousel>
    </div>
    <div class="item-body">
      <div class="item-body-row">
        <NH4 style="margin-bottom: 0">{{ item.name }}</NH4>
      </div>
      <!-- <div class="item-body-row">
                  <NTag type="success"> {{ item.status }} </NTag>
                </div> -->
      <div class="item-body-row">
        <template v-for="tag in item.tags">
          <NTag round size="small" :bordered="false" :color="{ color: '#8f7df8', textColor: '#f1f1f1' }">
            {{ tag }}
          </NTag>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { NSpace, NCarousel, NTag, NH4 } from 'naive-ui';

export default defineComponent({
  name: 'model-item',
  components: { NSpace, NCarousel, NTag, NH4 },
  props: { item: { type: Object, default: () => ({}) } },
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
  object-fit: cover;
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
</style>
