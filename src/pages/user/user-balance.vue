<template>
  <NSpace class="page" vertical :size="[0, 24]">
    <div class="section" style="height: 280px">
      <NH2>My Balance</NH2>
      <div class="points">
        <img class="section-background" src="@/assets/balance-background.png" />
        <NSpace class="points-content" vertical align="end" :wrap-item="false">
          <NSpin :rotate="loading" :size="20">
            <template #icon>
              <img src="@/assets/icon_refresh.png" style="width: 20px; height: 20px" @click="onPressRefresh" />
            </template>
          </NSpin>
          <div style="color: #fff; width: 100%; text-align: center">
            <span style="font-size: 40px">1000 </span>
            <span style="font-size: 26px">points left</span>
          </div>
          <div class="points-button">
            <span>Top-up</span>
          </div>
        </NSpace>
      </div>
    </div>
    <NSpace class="section" vertical :wrap-item="false">
      <NH2>Transactions</NH2>
      <NTable :bordered="false" :single-line="false">
        <thead>
          <tr>
            <th>How</th>
            <th>Points</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in list">
            <tr>
              <td>Generate</td>
              <td>{{ ` ${item.points} points` }}</td>
              <td>{{ moment(item.createTime).format('YYYY-MM-DD HH:mm:ss') }}</td>
            </tr>
          </template>
        </tbody>
      </NTable>
    </NSpace>
  </NSpace>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, watch, nextTick, computed } from 'vue';
import { NButton, NH2, NSpace, NCard, NUpload, NModal, NAvatar, NForm, NFormItem, NInput, NGrid, NGridItem, NIcon, NUl, NLi, NTable, NSpin, useMessage } from 'naive-ui';
import { Http } from '@/tools/http';
import moment from 'moment';

import { useUserStore } from '@/stores/user';
import { Utils } from '@/tools/utils';

export default defineComponent({
  name: 'user-profile',
  components: {
    NButton,
    NH2,
    NSpace,
    NCard,
    NModal,
    NGrid,
    NGridItem,
    NAvatar,
    NForm,
    NFormItem,
    NInput,
    NUpload,
    NIcon,
    NSpin,
    NUl,
    NLi,
    NTable,
  },
  setup(props, context) {
    const list = ref([
      {
        how: 'Generate',
        points: '-20',
        createTime: '1693967228000',
      },
      {
        how: 'Generate',
        points: '-20',
        createTime: '1693967228000',
      },
    ]);

    const loading = ref(false);
    const onPressRefresh = () => {
      loading.value = true;
      //  const Http = new Http();
      setTimeout(() => {
        loading.value = false;
      }, 1000);
    };

    return { moment, list, onPressRefresh, loading };
  },
});
</script>
<style scoped>
.page {
  width: 100%;
}
.points {
  position: relative;
  width: 540px;
  height: 184px;
  border-radius: 16px;
  background: linear-gradient(270deg, #9664ff -2.02%, #c67dff 100%);
}

.section {
  width: 100%;
  height: 100%;
  padding: 24px;
  background-color: #fff;
  border-radius: 20px;
  box-sizing: border-box;
}
.section-background {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
.points-content {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24px;
  box-sizing: border-box;
  z-index: 2;
}
.points-button {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #fff;
  color: #fff;
  background: linear-gradient(180deg, #bc6cff 0%, #552fc0 100%), linear-gradient(0deg, #ffffff, #ffffff);
}
</style>
