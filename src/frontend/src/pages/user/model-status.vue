<template>
  <div class="card-cover" vertical :size="[24, 0]" :wrap-item="false" @click="onPressItem(status)">
    <template v-if="covers">
      <img class="card-cover-img" :src="covers" />
    </template>
    <template v-else>
      <NSpace justify="center" align="center" style="height: 100%">
        <NEmpty />
      </NSpace>
    </template>
    <!-- Draft -->
    <template v-if="status === 0">
      <NSpace class="card-status" justify="center" align="center">
        <NEmpty description="Under review">
          <template #icon>
            <!-- <img class="card-status-icon" src="@/assets/icon_review.png" /> -->
          </template>
        </NEmpty>
      </NSpace>
    </template>
    <!-- Wait Audit -->
    <template v-if="status === 1">
      <NSpace class="card-status" justify="center" align="center">
        <NEmpty description="Under review">
          <template #icon>
            <img class="card-status-icon" src="@/assets/icon_review.png" />
          </template>
        </NEmpty>
      </NSpace>
    </template>
    <!-- Pass audit -->
    <template v-if="status === 3">
      <NSpace class="card-status" justify="center" align="center">
        <NEmpty description="Upload failure">
          <template #icon>
            <img class="card-status-icon" src="@/assets/icon_failure.png" />
          </template>
        </NEmpty>
      </NSpace>
    </template>
    <!-- No pass audit -->
    <template v-if="status === 4">
      <NSpace class="card-status" justify="center" align="center">
        <NEmpty description="Upload failure">
          <template #icon>
            <!-- <img class="card-status-icon" src="@/assets/icon_failure.png" /> -->
          </template>
        </NEmpty>
      </NSpace>
    </template>
  </div>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, watch, nextTick, computed } from 'vue';
import { NH2, NEmpty, NSpace, useMessage } from 'naive-ui';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: '',
  components: { NEmpty, NSpace },
  props: {
    status: { type: Number, default: 0 },
    covers: { type: Array, default: [] },
    sn: { type: String, default: '' },
  },

  setup(props, context) {
    const router = useRouter();
    const message = useMessage();

    const { status, covers, sn }: any = props;

    const onPressItem = (status: any) => {
      if (status === 0) {
        message.info('comming soon');
      } else if (status === 1) {
        message.info('comming soon');
      } else if (status === 2) {
        router.push({ name: 'model-detail', params: { modelSn: sn } });
      } else if (status === 3) {
        message.info('comming soon');
      } else if (status === 4) {
        message.info('comming soon');
      }
    };
    return { status, covers: covers[0], onPressItem };
  },
});
</script>
<style scoped>
.card-cover {
  position: relative;
}
.card-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  transition: all 0.2s;
  cursor: pointer;
}

.card-status {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #00000080;
  cursor: pointer;
}

.card-cover:hover .card-cover-img {
  transform: scale(1.2);
}
</style>
