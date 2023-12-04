<template>
  <NA :href="item.link" target="_blank">
    <NCard class="nft" content-style="padding:12px;" footer-style="padding:0 12px 12px">
      <template #cover>
        <div class="nft-cover">
          <img class="nft-cover-img" :src="item.cover" />
        </div>
      </template>
      <template #default>
        <NSpace align="center" :wrap-item="false">
          <img class="publisher-avatar" :src="item.publisherAvatar" />
          <!-- style="max-width: 190px" -->
          <div class="publisher-name">{{ item.publisherName }}</div>
        </NSpace>
      </template>
      <template #footer>
        <NSpace :wrap-item="false" :size="[0, 0]" :wrap="false">
          <template v-for="numerical in item.numericals">
            <NSpace
              vertical
              justify="center"
              align="center"
              :wrap-item="false"
              style="height: 48px; flex: 1"
              :size="[0, 0]"
            >
              <div class="numerical-name">{{ numerical.name }}</div>
              <div class="numerical-value">{{ numerical.value }}</div>
            </NSpace>
          </template>
        </NSpace>
      </template>
    </NCard>
  </NA>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { NA, NSpace, NCard, NEllipsis } from 'naive-ui';

export default defineComponent({
  name: 'nft-item',
  props: {
    item: { type: Object, default: () => ({}) },
  },
  components: { NA, NSpace, NCard, NEllipsis },
  setup() {
    return {};
  },
});
</script>

<style scoped>
.nft {
  border-radius: 10px;
}
.nft-cover {
  /* 102% = Fine-tune according to the view */
  padding-top: 102%;
  position: relative;
}
.nft-cover-img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.2s all;
}
.nft-cover-img:hover {
  transform: scale(1.2);
}
.publisher-avatar {
  object-fit: cover;
  border-radius: 8px;
  margin-left: 4px;
  width: 32px;
  height: 32px;
}
.publisher-name {
  width: 100%;
  flex: 1;
  font-size: 14px;
  font-weight: 700;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.numerical-name {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
}
.numerical-value {
  font-weight: 700;
  white-space: nowrap;
}
</style>
