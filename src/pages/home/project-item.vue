<template>
  <NCard class="card" :title="item.name">
    <template #cover>
      <div class="card-cover">
        <img class="card-cover-img" :src="item.cover" />
      </div>
    </template>
    <div class="card-description">{{ item.description }}</div>
    <template #footer>
      <NSpace justify="center" align="center">
        <NA :href="item.link" target="_blank" style="text-decoration: none; color: inherit">
          <NButton class="card-button" type="primary" ghost color="#6C2CFD">
            {{ item.button }}
          </NButton>
        </NA>
      </NSpace>
    </template>
  </NCard>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { NSpace, NA, NCard, NButton } from 'naive-ui';

export default defineComponent({
  name: 'project-item',
  components: { NSpace, NA, NCard, NButton },
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
.card {
  /* width: 456px; */
  /* height: 520px; */
  padding: 2px;
  border-radius: 12px;
  border: 1px solid #e5e4e9;
}

.card-cover {
  position: relative;
  padding-top: 62%;
  border-radius: 10px 10px 0 0;
  overflow: hidden;
}

.card-cover-img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.2s all;
}

.card-description {
  min-height: 120px;
}

.card-button {
  min-width: 120px;
  margin: 0px auto;
}
</style>
