<template>
  <div class="page">Nodes</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch, onActivated, ComputedRef } from 'vue';
import { NPagination, NSpace, NButton, NSpin } from 'naive-ui';
import { Utils } from '@/tools/utils';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'nodes',
  components: { NPagination, NSpace, NButton, NSpin },
  beforeRouteEnter(to, from, next) {
    if (typeof to.meta !== 'object') {
      to.meta = {};
    }
    if (from.name === 'node-detail') {
      to.meta.isBack = true;
    } else {
      to.meta.isBack = false;
    }
    next();
  },
  setup() {
    const page = ref(1);
    const pageCount = ref(1);
    const route = useRoute();

    onActivated(() => {
      if (route.meta.isBack) {
      } else {
        page.value = 1;
        pageCount.value = 1;
      }
    });

    return {
      page,
      pageCount,
    };
  },
});
</script>

<style scoped></style>
