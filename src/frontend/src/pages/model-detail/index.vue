<template>
  <div class="page">
    <NCard :bordered="false" content-style="padding:0">
      <NSpace class="layout" :wrap-item="false" :size="[0, 0]">
        <template v-if="error === -1">
          <NSpace class="layout-loading" align="center" justify="center">
            <NSpin />
          </NSpace>
        </template>
        <template v-else-if="error > 0">
          <NSpace class="layout-loading" align="center" justify="center">
            <span>{{ errorText }}</span>
          </NSpace>
        </template>
        <template v-else>
          <div class="layout-left">
            <div class="carousel-wrap">
              <NCarousel class="carousel" :autoplay="true">
                <template v-for="cover in covers">
                  <img class="cover" :src="cover" />
                </template>
              </NCarousel>
            </div>
          </div>
          <div class="layout-right" style="padding: 32px">
            <div class="header">
              <div class="header-row">
                <div class="name">{{ name }}</div>
              </div>
              <div class="tags">
                <template v-for="tag in tags">
                  <NTag
                    class="tags-item"
                    round
                    size="small"
                    :bordered="false"
                    :color="{ color: '#8f7df8', textColor: '#f1f1f1' }"
                  >
                    {{ tag }}
                  </NTag>
                </template>
              </div>
            </div>
            <div class="body">
              <div class="with">
                <div class="with-label">Version</div>
                <div class="with-value">v{{ version }}</div>
              </div>
              <div class="with">
                <div class="with-label">Hash Code</div>
                <div class="with-value">{{ modelHashCode || '-' }}</div>
              </div>
              <div class="with">
                <div class="with-label">Base Model</div>
                <div class="with-value">{{ baseModel || '-' }}</div>
              </div>
              <div class="with">
                <div class="with-label">Model Size</div>
                <div class="with-value">{{ modelSize || '-' }}</div>
              </div>
              <div class="with">
                <div class="with-label">Floating Point</div>
                <div class="with-value">{{ floatingPoint || '-' }}</div>
              </div>
              <div class="with with__column">
                <div class="with-label">Description</div>
                <div class="with-value with-value__area">{{ description }}</div>
              </div>
            </div>
            <NSpace align="center" :size="[24, 0]" style="margin-top: 12px">
              <NButton type="warning" size="large" strong @click="onPressRun">
                <template #icon>
                  <NIcon><IconRun /></NIcon>
                </template>
                Run model
              </NButton>
              <NButton type="primary" size="large" strong @click="onPressArchive">
                <template #icon>
                  <NIcon><IconDownload /></NIcon>
                </template>
                Download model package
              </NButton>
            </NSpace>
          </div>
        </template>
      </NSpace>
    </NCard>
    <NModal v-model:show="nodeVisible" :mask-closable="false">
      <NCard :bordered="false" style="width: 640px" content-style="">
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
        <NodeList :hash="nodeHashCode" @pressitem="onNodeClose" />
      </NCard>
    </NModal>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  NCard,
  NH3,
  NSpace,
  NSpin,
  NTag,
  NCarousel,
  NDescriptions,
  NDescriptionsItem,
  NButton,
  NIcon,
  NModal,
  useMessage,
} from 'naive-ui';
import { useUserStore } from '@/stores/user';
import { Http } from '@/tools/http';
import {
  DownloadSharp as IconDownload,
  CaretForwardCircleOutline as IconRun,
  CloseSharp as IconClose,
} from '@vicons/ionicons5';
import NodeList from './node-list.vue';

export default defineComponent({
  name: 'node-detail',
  components: {
    NCard,
    NH3,
    NSpace,
    NSpin,
    NTag,
    NCarousel,
    NDescriptions,
    NDescriptionsItem,
    NButton,
    NIcon,
    NModal,
    IconDownload,
    IconRun,
    IconClose,
    NodeList,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const message = useMessage();
    const modelId = ref(route.params.id);
    const error = ref(-1);
    const errorText = ref('');
    //modal property
    const nodeVisible = ref(false);
    const nodeHashCode = ref('');

    const name = ref('');
    const covers = ref<string[]>([]);
    const archive = ref('');
    const version = ref('');
    const tags = ref<string[]>([]);
    const baseModel = ref('');
    const modelHashCode = ref('');
    const floatingPoint = ref('');
    const modelSize = ref('');
    const description = ref('');

    const http = Http.getInstance();
    const useStore = useUserStore();
    const init = async () => {
      error.value = -1;
      errorText.value = '';
      const resp = await http.postJSON({
        url: '/mrchaiemc/queryModelDetailInfo.do',
        data: { custId: useStore.user.id, bussData: { modelId: modelId.value } },
      });
      const data = resp.bussData || {};
      if (!data.modelId) {
        error.value = 1;
        errorText.value = 'Not found model';
        return;
      }

      if (typeof data.sampleImgFileLinks !== 'string') {
        data.sampleImgFileLinks = '';
      }

      if (typeof data.modelFileLinks !== 'string') {
        data.modelFileLinks = '';
      }

      let tagsProps = ['modelSubName', 'cateGory1', 'cateGory2', 'cateGory3'];
      let _tags: string[] = [];
      tagsProps.forEach((p) => {
        const v = data[p] as string;
        const vals = v ? v.split(',') : [];
        if (vals.length > 0) {
          _tags = _tags.concat(vals);
        }
      });
      let _covers: string[] = data.sampleImgFileLinks.split(',');
      name.value = data.modelName;
      covers.value = _covers;
      version.value = data.version || '1';
      tags.value = _tags;
      archive.value = data.modelFileLinks;
      baseModel.value = data.baseModel;
      modelHashCode.value = data.modelHashCode;
      floatingPoint.value = data.floatingPoint;
      modelSize.value = data.modelSize;
      description.value = data.description;
      error.value = 0;
    };

    onMounted(() => {
      init();
    });

    return {
      error,
      errorText,

      nodeVisible,
      nodeHashCode,

      name,
      covers,
      version,
      tags,
      archive,
      baseModel,
      modelHashCode,
      floatingPoint,
      modelSize,
      description,
      onPressRun() {
        if (!modelHashCode.value) {
          message.error('Sorry, This model without \'Hash Code\'');
          return;
        }
        nodeVisible.value = true;
        nodeHashCode.value = modelHashCode.value;
      },
      onNodeClose() {
        nodeVisible.value = false;
      },
      onPressArchive() {
        if (!archive.value) {
          message.error('Sorry, The package disappears');
          return;
        }
        window.open(archive.value);
      },
    };
  },
});
</script>

<style scoped>
.layout {
}
.layout-loading {
  width: 100%;
  height: 600px;
}

.layout-left,
.layout-right {
  width: 50%;
  box-sizing: border-box;
}
.carousel-wrap {
  width: 100%;
  padding-top: 100%;
  position: relative;
}
.carousel {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header {
  margin-bottom: 16px;
}
.header-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.header-row:not(:last-child) {
  margin-bottom: 8px;
}
.tags-item:not(:last-child) {
  margin-right: 4px;
}
.name {
  font-size: 26px;
  font-weight: 700;
}

.with {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 0;
  border-bottom: dashed 1px #f1f1f1;
}

.with-label {
  width: 120px;
  font-weight: 500;
}

.with__column {
  flex-direction: column;
  align-items: unset;
}
.with__column .with-label {
  width: auto;
  margin-bottom: 4px;
}
.with-value__area {
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #f1f1f1;
  min-height: 80px;
}
</style>
