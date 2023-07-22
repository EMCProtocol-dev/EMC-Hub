<template>
  <div class="page"></div>
</template>

<script lang="ts">
import { ref, onMounted, computed, onUnmounted, defineComponent, nextTick } from 'vue';
import { NPopover, NSpin } from 'naive-ui';
import { Utils } from '@/tools/utils';

export default defineComponent({
  components: {
    NPopover,
    NSpin,
  },

  setup() {
    return {};
  },
});
</script>

<style scoped></style>
