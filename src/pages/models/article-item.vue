<template>
  <div class="article">
    <div class="article-wrapper">
      <div class="article-header">
        <span>{{ item.title }}</span>
      </div>
      <div class="article-body">
        <span>{{ item.content }}</span>
      </div>
      <!-- <div class="article-footer">
        <span>Read more</span>
      </div> -->
    </div>
    <template v-if="item.cover">
      <div class="article-cover">
        <img class="article-cover-image" :src="item.cover" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { NSpace, NCarousel, NTag, NH4 } from 'naive-ui';

export default defineComponent({
  name: 'article-item',
  components: { NSpace, NCarousel, NTag, NH4 },
  props: {
    item: { type: Object, default: () => ({}) },
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
.article {
  padding: 24px;
  display: flex;
  flex-direction: row;
}
.article-bg {
  background-image: url('../../assets/article-bg.jpg');
  background-size: 100%;
  background-repeat: no-repeat;
}

.article-wrapper {
  flex: 1;
  width: 0;
}
.article-header {
  font-weight: 700;
  font-size: 18px;
  color: var(--article-text);
  margin-bottom: 16px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.article-body {
  font-size: 14px;
  line-height: 1.6;
  color: var(--article-text);
  height: 8em;
  text-indent: 2em;
  overflow: hidden;
  margin-bottom: 16px;
}
.article-footer {
  display: flex;
  flex-direction: row;
  color: var(--article-text);
}
.article-cover {
  width: 200px;
  padding-top: 200px;
  position: relative;
  overflow: hiddent;
}
.article-cover-image {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
