<template>
  <NScrollbar style="max-height: 80vh; padding: 0 20px; box-sizing: border-box">
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
      <template v-for="item in list">
        <div class="item" @click="onPressItem(item)">
          <div class="item-body">
            <div class="item-row">
              <div class="item-name">{{ item.nodeId }}</div>
            </div>
            <div class="item-row">
              <NTag>
                <NSpace align="center" :wrap-item="false" :size="[8, 0]">
                  <NIcon><IconCpu /></NIcon>
                  <!-- <NText style="font-size: 12px">{{ item.cpuName }}</NText> -->
                  <NText style="font-size: 12px">Computing Power : {{ item.avgPower }}E</NText>
                </NSpace>
              </NTag>
            </div>
          </div>
          <NIcon>
            <IconArrowRight />
          </NIcon>
        </div>
      </template>
    </template>
  </NScrollbar>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { NCard, NH3, NH5, NSpace, NText, NSpin, NTag, NButton, NIcon, NScrollbar, useMessage } from 'naive-ui';
import { useUserStore } from '@/stores/user';
import { Http } from '@/tools/http';
import {
  EarthSharp as IconEarth,
  HardwareChipSharp as IconCpu,
  ChevronForwardSharp as IconArrowRight,
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
  },
  props: {
    hash: { type: String, default: '' },
  },
  emits: ['pressitem'],
  setup(props, ctx) {
    const error = ref(-1);
    const errorText = ref('');
    const list = ref<NodeItem[]>([]);

    const http = Http.getInstance();

    const init = async () => {
      if (!props.hash) {
        error.value = 1;
        errorText.value = 'The hash can not be empty';
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
          cpuName: cpuName,
          countryName: countryName,
          avgPower: item.avgPower,
        });
      });
      list.value = newList;
      error.value = 0;
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
  display: flex;
  align-items: center;
}
.item:hover {
  cursor: pointer;
  background-color: #f1f1f1;
}

.item-body {
  flex: 1;
  width: 0;
}
.item-row {
  display: flex;
  align-items: center;
}

.item-row:not(:last-child) {
  margin-bottom: 8px;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
