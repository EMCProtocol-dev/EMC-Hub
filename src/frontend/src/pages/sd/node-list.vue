<template>
  <NScrollbar style="max-height: 40vh; padding: 0 20px; box-sizing: border-box">
    <template v-if="error === -1">
      <div class="placeholder-view">
        <NSpin />
      </div>
    </template>
    <template v-else-if="error > 0">
      <div class="placeholder-view">
        <span>{{ errorText }}</span>
      </div>
    </template>
    <template v-else>
      <NSpace :wrap-item="false" :size="[8, 8]">
        <template v-for="item in list">
          <NSpace class="item" vertical :wrap-item="false" :size="[0, 8]" @click="onPressItem">
            <NSpace align="center" :wrap-item="false" :size="[8, 0]">
              <NIcon><IconNode /></NIcon>
              <NText style="font-size: 14px">{{ item.nodeId }}</NText>
            </NSpace>
            <NSpace align="center" :wrap-item="false" :size="[8, 0]">
              <NIcon><IconCpu /></NIcon>
              <NText style="font-size: 12px">Computing Power : {{ item.avgPower }}E</NText>
            </NSpace>
          </NSpace>
        </template>
      </NSpace>
    </template>
  </NScrollbar>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, computed, watch } from 'vue';
import { NCard, NH3, NH5, NSpace, NText, NSpin, NTag, NButton, NIcon, NScrollbar, useMessage } from 'naive-ui';
import { Http } from '@/tools/http';
import {
  EarthSharp as IconEarth,
  HardwareChipSharp as IconCpu,
  ChevronForwardSharp as IconArrowRight,
  ShareSocialSharp as IconNode,
} from '@vicons/ionicons5';
import { Utils } from '@/tools/utils';
import { NodeItem } from './node-item';

export default defineComponent({
  components: {
    NCard,
    NH3,
    NH5,
    NSpace,
    NText,
    NSpin,
    NTag,
    NButton,
    NIcon,
    NScrollbar,
    IconEarth,
    IconCpu,
    IconArrowRight,
    IconNode,
  },
  props: {
    hash: { type: String, default: '' },
  },
  emits: ['pressitem', 'init'],
  setup(props, ctx) {
    const error = ref(-1);
    const errorText = ref('');
    const list = ref<NodeItem[]>([]);

    const http = Http.getInstance();

    const init = async () => {
      if (!props.hash) {
        error.value = 1;
        errorText.value = 'The hash can not be empty';
        ctx.emit('init', []);
        return;
      }
      error.value = -1;
      errorText.value = '';
      const resp = await http.get({
        url: 'https://api.edgematrix.pro/api/v1/nodelistsnapshot',
        data: { appspecs: props.hash, page: 1, size: 100 },
      });
      const newList: NodeItem[] = [];
      (resp.data || []).forEach((item: any) => {
        const cpuInfo = Utils.parseJSON(item.cpuInfo);
        const cpuName = cpuInfo.ModelName;
        const countryName = item.ipInfo?.countryName;
        newList.push({
          nodeId: item._id,
          nodeIdShort: Utils.textOverflow(item._id, 10),
          cpuName: cpuName,
          countryName: countryName,
          avgPower: item.avgPower,
        });
      });
      list.value = newList;
      error.value = 0;
      ctx.emit('init', newList);
    };

    onMounted(() => {
      init();
    });

    return {
      error,
      errorText,
      list,
      onPressItem(item: NodeItem) {
        ctx.emit('pressitem', item);
<<<<<<< HEAD:src/frontend/src/pages/sd/node-list.vue
=======
        window.open(`https://sd.edgematrix.pro/#/txt2img?nodeid=${item.nodeId}`);
>>>>>>> 985d1b5 (~):src/frontend/src/pages/model-detail/node-list.vue
      },
    };
  },
});
</script>

<style scoped>
.placeholder-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 200px;
}
.item {
  padding: 12px;
  border-bottom: solid 1px #e7e7e7;
  width: 100%;
}
/* .item:hover {
  cursor: pointer;
  background-color: #f1f1f1;
} */
</style>
