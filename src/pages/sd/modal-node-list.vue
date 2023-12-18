<template>
  <NModal v-model:show="nodeVisible" :mask-closable="false">
    <NCard :bordered="false" style="width: 88vw; max-width: 640px" content-style="padding-left:0;padding-right:0;">
      <template #header>
        <NH3 style="margin-bottom: 0">Nodes for running</NH3>
      </template>
      <template #header-extra>
        <NButton quaternary circle @click="onNodeClose">
          <template #icon>
            <NIcon>
              <IconClose />
            </NIcon>
          </template>
        </NButton>
      </template>
      <NodeList :hash="nodeHashCode" @init="onNodeInit" />
      <template #footer>
        <NSpace justify="space-between" align="center" :wrap-item="false">
          <NText style="font-size: 12px">Total {{ nodeList.length }} nodes</NText>
        </NSpace>
      </template>
    </NCard>
  </NModal>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { NCard, NH3, NSpace, NSpin, NButton, NIcon, NModal, NText, useMessage } from 'naive-ui';
import { Http } from '@/tools/http';
import { Utils } from '@/tools/utils';
import { CloseSharp as IconClose } from '@vicons/ionicons5';
import NodeList from './node-list.vue';
import type { NodeItem } from './node-item';

export default defineComponent({
  name: 'node-detail',
  components: {
    NCard,
    NH3,
    NSpace,
    NSpin,
    NButton,
    NIcon,
    NModal,
    NText,
    IconClose,
    NodeList,
  },
  setup() {
    const nodeVisible = ref(false);
    const nodeHashCode = ref('');
    const nodeList = ref<NodeItem[]>([]);
    return {
      nodeVisible,
      nodeHashCode,
      nodeList,
      onNodeInit() {},
      onNodeClose() {
        nodeVisible.value = false;
      },
    };
  },
});
</script>
