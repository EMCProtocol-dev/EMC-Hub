<template>
  <div class="page">
    <NCard :bordered="false" content-style="padding:24px 0 24px 24px" style="border-radius: 20px">
      <!-- <NSpace class="layout" :wrap-item="false" :size="[0, 0]"></NSpace> -->
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
        <NGrid cols="2" item-responsive>
          <NGridItem span="2 880:1">
            <div class="layout-left">
              <div class="carousel-wrap">
                <NCarousel class="carousel" :autoplay="true" :show-arrow="covers.length > 1 ? true : false">
                  <template v-for="cover in covers">
                    <img class="cover" :src="cover.url" />
                  </template>
                </NCarousel>
              </div>
            </div>
          </NGridItem>
          <NGridItem span="2 880:1">
            <div class="layout-right" style="padding: 24px">
              <div class="header">
                <div class="header-row">
                  <div class="name">{{ name }}</div>
                </div>
                <NSpace class="tags" :wrap-item="false" :size="[8, 8]">
                  <template v-for="tag in tags">
                    <NTag round size="small" :bordered="false" :color="{ color: '#8f7df8', textColor: '#f1f1f1' }">
                      {{ tag }}
                    </NTag>
                  </template>
                </NSpace>
              </div>
              <div class="body">
                <div class="with">
                  <div class="with-label">Version</div>
                  <div class="with-value">v{{ version }}</div>
                </div>
                <div class="with">
                  <div class="with-label">Hash Code</div>
                  <div class="with-value">{{ hashCode || '-' }}</div>
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
              <NSpace align="center" :size="[24, 24]" style="margin-top: 12px">
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
          </NGridItem>
        </NGrid>
      </template>
    </NCard>
    <ModelGallery :modelSn="modelSn" :modelHashCode="hashCode" :modelName="name" />
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
        <NodeList :hash="hashCode" @pressitem="onNodePressItem" />
      </NCard>
    </NModal>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { NCard, NH2, NH3, NSpace, NSpin, NTag, NCarousel, NDescriptions, NDescriptionsItem, NButton, NIcon, NModal, NGrid, NGridItem, useMessage, NPopselect } from 'naive-ui';
import { useUserStore } from '@/stores/user';
import { Http } from '@/tools/http';
import { Utils } from '@/tools/utils';
import { DownloadSharp as IconDownload, CaretForwardCircleOutline as IconRun, CloseSharp as IconClose } from '@vicons/ionicons5';
import NodeList from './node-list.vue';
import type { NodeItem } from './node-item';
import { parametersWith } from '@/tools/exif';

import ModelGallery from './model-gallery.vue';

export default defineComponent({
  name: 'node-detail',
  components: {
    NCard,
    NH2,
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
    NGrid,
    NGridItem,
    NPopselect,
    IconRun,
    IconClose,
    IconDownload,
    NodeList,
    ModelGallery,
  },
  setup() {
    const route = useRoute();
    const message = useMessage();
    const modelSn = ref(route.params.modelSn as string);
    const error = ref(-1);
    const errorText = ref('');
    //modal property
    const nodeVisible = ref(false);
    const router = useRouter();

    const name = ref('');
    const covers = ref<Array<{ url: string; parameters: string }>>([]);
    const archive = ref('');
    const version = ref('');
    const tags = ref<string[]>([]);
    const baseModel = ref('');
    const hashCode = ref('');
    const floatingPoint = ref('');
    const modelSize = ref('');
    const description = ref('');
    const http = Http.getInstance();

    const init = async () => {
      error.value = -1;
      errorText.value = '';
      const resp = await http.get({
        url: '/emchub/api/client/modelInfo/queryOne',
        data: { modelSn: modelSn.value },
      });
      if (resp._result !== 0) {
        error.value = 1;
        errorText.value = 'Not found model';
        return;
      }
      const data: any = resp.data || {};

      let _tags: string[] = data.tags.split(',');

      let _covers: Array<{ url: string; parameters: string }> = [];
      let _parameters: Array<{ id: string; raw: string }> = [];
      let _modelFile: { id?: string; name?: string; url?: string } = {};
      const lastestVersion = data.modelVersions && data.modelVersions[0] ? data.modelVersions[0] : {};
      if (lastestVersion.versionId) {
        _parameters = Utils.parseJSON(lastestVersion.previewPicturesGenParams);
        _covers = Utils.parseJSON(lastestVersion.previewPicturesUrl) || [];
        _modelFile = Utils.parseJSON(lastestVersion.modelFileUrl);
        _covers.forEach((item, index) => {
          item.parameters = _parameters[index].raw;
        });
      }

      name.value = data.modelName;
      tags.value = _tags;
      covers.value = _covers;
      description.value = data.description;
      version.value = lastestVersion.modelVersion || '-';
      hashCode.value = lastestVersion.hashCodeSha256;
      baseModel.value = lastestVersion.baseModel;
      floatingPoint.value = lastestVersion.floatingPoint;
      modelSize.value = lastestVersion.modelSize;
      archive.value = _modelFile.url || '';
      error.value = 0;
    };

    onMounted(() => {
      init();
    });

    return {
      error,
      errorText,
      modelSn,
      nodeVisible,
      name,
      covers,
      version,
      tags,
      archive,
      baseModel,
      hashCode,
      floatingPoint,
      modelSize,
      description,
      onPressRun() {
        if (!hashCode.value) {
          message.error("Sorry, This model without 'Hash Code'");
          return;
        }
        nodeVisible.value = true;
      },
      onNodeClose() {
        nodeVisible.value = false;
      },
      async onNodePressItem(item: NodeItem) {
        let sdWindow: WindowProxy | null;
        let parameters = '';

        if (covers.value[0].parameters) {
          parameters = covers.value[0].parameters;
        } else {
          try {
            parameters = await parametersWith(covers.value[0].url);
            //parameters = 'Prompt\nNavite Promp\nStep:1;Seed:1;';
            //import {format as parameterFormat} from '@/tools/parameters';
            //const pf = parameterFormat(parameters);
            // {
            //   prompt: '',
            //   negativePrompt: '',
            //   steps: 0,
            //   sampler: '',
            //   width: 0,
            //   height: 0,
            //   cfgScale: 0,
            //   seed: '',
            //   clipSkip: 0,
            // }
          } catch (e) {
            console.error(e);
          }
        }

        console.info('image parameters :\n', parameters);
        if (parameters) {
          const handleMessage = (event: MessageEvent) => {
            const request: any = event.data as any;
            if (request.type === 'emcsd-txt2img-ready') {
              sdWindow?.postMessage({ type: 'emcsd-txt2img-parameters', data: parameters }, '*');
            }
            window.removeEventListener('message', handleMessage);
          };
          window.addEventListener('message', handleMessage);
        } else {
          console.warn(`${covers.value[0].url} can not parse parameters`);
        }

        nodeVisible.value = false;
        sdWindow = window.open(`https://sd.edgematrix.pro/#/txt2img?nodeid=${item.nodeId}`, `sd-window-${new Date().getTime()}`);
        // sdWindow = window.open(
        //   `http://localhost:8080/#/txt2img?nodeid=${item.nodeId}`,
        //   `sd-window-${new Date().getTime()}`
        // );
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
/* .layout {
} */
.layout-loading {
  width: 100%;
  height: 600px;
}

.layout-left,
.layout-right {
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
  border-radius: 10px;
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
