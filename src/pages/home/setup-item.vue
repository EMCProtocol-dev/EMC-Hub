<template>
  <NGrid class="setup" cols="1 1000:2" :x-gap="76" :y-gap="24" item-responsive :style="{ 'margin-bottom': '80px', direction: index % 2 != 1 ? 'rtl' : 'ltr' }">
    <!-- <NSpace class="setup" :wrap="false" justify="space-between" :wrap-item="false" :size="[78, 0]" :style="{ 'flex-flow': index % 2 != 1 ? 'row' : 'row-reverse' }"> -->
    <NGridItem span="1000:1">
      <NCard
        class="setup-content"
        :title="index + 1 + '. ' + item.title"
        :bordered="false"
        header-style="font-size:28px;font-weight:700; unicode-bidi: bidi-override;
  direction: ltr;"
      >
        <span class="setup-pre" v-html="item.content"></span>
      </NCard>
    </NGridItem>
    <NGridItem span="1000:1">
      <NSpace class="setup-side" :wrap-item="false" justify="center">
        <img class="setup-side-image" :src="item.image" />
      </NSpace>
    </NGridItem>
    <!-- </NSpace> -->
  </NGrid>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { NSpace, NA, NCard, NButton, NGrid, NGridItem } from 'naive-ui';

export default defineComponent({
  name: 'setup-item',
  components: { NSpace, NA, NCard, NButton, NGrid, NGridItem },
  props: { item: { type: Object, default: () => ({}) }, index: { type: Number, default: 0 } },
  emits: ['press'],
  setup(props, ctx) {
    return {};
  },
});
</script>

<style scoped>
.setup-content {
  width: 100%;
  background-color: transparent;
  text-align: left;
}

.setup-pre {
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
  unicode-bidi: bidi-override;
  direction: ltr;
}

.setup-side {
  width: 100%;
  padding: 20px;
  border-radius: 20px;
  border: 1px solid #e5e4e9;
  box-sizing: border-box;
}

.setup-side-image {
  border-radius: 10px;
  width: 100%;
  object-fit: cover;
}
</style>
