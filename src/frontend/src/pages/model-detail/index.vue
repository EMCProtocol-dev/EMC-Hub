<<<<<<< HEAD
=======
<template>
  <div class="page">
    <NCard :bordered="false" content-style="padding:0">
<<<<<<< HEAD
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
=======
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
<<<<<<< HEAD
                <NCarousel class="carousel" v-model:current-index="carouselIndex" :autoplay="true">
=======
                <NCarousel
                  class="carousel"
                  v-model:current-index="carouselIndex"
                  :autoplay="true"
                  :show-arrow="covers.length > 1"
                >
                  v-model:current-index="carouselIndex" :autoplay="true" :show-arrow="covers.length > 1" >
>>>>>>> 77b72c4 (~)
                  <template v-for="cover in covers">
                    <img class="cover" :src="cover" />
                  </template>
                </NCarousel>
>>>>>>> 8b84a8c (~)
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
<<<<<<< HEAD
                  <div class="with-value">{{ modelHashCode || '-' }}</div>
=======
                  <div class="with-value">{{ hashCodeSha256Short || '-' }}</div>
>>>>>>> a9050e8 (~)
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
    <ModelGallery :modelSn="modelSn" :modelHashCode="hashCodeSha256" :modelName="name" />
>>>>>>> a9050e8 (~)
    <NModal v-model:show="nodeVisible" :mask-closable="false">
      <NCard :bordered="false" style="width: 88vw; max-width: 640px" content-style="padding-left:0;padding-right:0;">
        <template #header>
          <NH3 style="margin-bottom: 0">Nodes for run</NH3>
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
<<<<<<< HEAD
<<<<<<< HEAD
        <NodeList :hash="nodeHashCode" @pressitem="onNodeClose" />
=======
        <NodeList :hash="hashCode" @pressitem="onNodePressItem" />
>>>>>>> f3be274 (9.1)
=======
        <NodeList :hash="nodeHashCode" @pressitem="onNodePressItem" @init="onNodeInit" />
        <template #footer>
          <NSpace justify="space-between" align="center" :wrap-item="false">
            <NText style="font-size: 12px">Total {{ nodeList.length }} nodes</NText>
            <NButton type="warning" size="large" strong @click="onNodeRun">
              <template #icon>
                <NIcon><IconRun /></NIcon>
              </template>
              Run
            </NButton>
          </NSpace>
        </template>
>>>>>>> a9050e8 (~)
      </NCard>
    </NModal>
=======
    <ModelGallery :modelInfo="modelInfo" />
>>>>>>> 77b72c4 (~)
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
<<<<<<< HEAD
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
<<<<<<< HEAD
=======
  NGrid,
  NGridItem,
>>>>>>> 8b84a8c (~)
  useMessage,
} from 'naive-ui';
import { useUserStore } from '@/stores/user';
import { Http } from '@/tools/http';
import {
  DownloadSharp as IconDownload,
  CaretForwardCircleOutline as IconRun,
  CloseSharp as IconClose,
} from '@vicons/ionicons5';
=======

import {
  NCard,
<<<<<<< HEAD
  NH2,
=======
>>>>>>> 77b72c4 (~)
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
  NText,
  useMessage,
  NPopselect,
} from 'naive-ui';
<<<<<<< HEAD
import { useUserStore } from '@/stores/user';
import { Http } from '@/tools/http';
import { Utils } from '@/tools/utils';
<<<<<<< HEAD
import { DownloadSharp as IconDownload, CaretForwardCircleOutline as IconRun, CloseSharp as IconClose } from '@vicons/ionicons5';
>>>>>>> f3be274 (9.1)
=======
=======
import { Http } from '@/tools/http';
import { Utils } from '@/tools/utils';
>>>>>>> 77b72c4 (~)
import {
  DownloadSharp as IconDownload,
  CaretForwardCircleOutline as IconRun,
  CloseSharp as IconClose,
} from '@vicons/ionicons5';
<<<<<<< HEAD
>>>>>>> a9050e8 (~)
import NodeList from './node-list.vue';
=======

import { navigateToSD } from './utils';
import * as StableDiffusionMetadata from '@/tools/stable-diffusion-metadata';

import ModelGallery from './model-gallery.vue';
>>>>>>> 77b72c4 (~)

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
    NGrid,
    NGridItem,
<<<<<<< HEAD
    IconDownload,
=======
    NText,
    NPopselect,
>>>>>>> a9050e8 (~)
    IconRun,
    IconClose,
<<<<<<< HEAD
    NodeList,
=======
    IconDownload,
    ModelGallery,
>>>>>>> 77b72c4 (~)
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const message = useMessage();
    const modelId = ref(route.params.id);
    const error = ref(-1);
    const errorText = ref('');
    const carouselIndex = ref(0);

<<<<<<< HEAD
    //modal property
    const nodeVisible = ref(false);
<<<<<<< HEAD
<<<<<<< HEAD
    const nodeHashCode = ref('');
=======
=======
    const nodeHashCode = ref('');
    const nodeList = ref<NodeItem[]>([]);
>>>>>>> a9050e8 (~)
=======
>>>>>>> 77b72c4 (~)
    const router = useRouter();
>>>>>>> f3be274 (9.1)

    const name = ref('');
    const covers = ref<string[]>([]);
    const archive = ref('');
    const version = ref('');
    const tags = ref<string[]>([]);
    const baseModel = ref('');
<<<<<<< HEAD
    const modelHashCode = ref('');
=======
    const hashCodeSha256 = ref('');
    const hashCodeSha256Short = ref('');
>>>>>>> a9050e8 (~)
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
<<<<<<< HEAD

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
=======
      const _hashCodeSha256 = 'aa9c45d00a'; // (lastestVersion.hashCodeSha256 || '-').trim().toLocaleLowerCase();
      const _shortHashCodeSha256 = _hashCodeSha256.substring(0, 10);
>>>>>>> a9050e8 (~)
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
<<<<<<< HEAD
=======
      version.value = lastestVersion.modelVersion || '-';
      hashCodeSha256.value = _hashCodeSha256;
      hashCodeSha256Short.value = _shortHashCodeSha256;
      baseModel.value = lastestVersion.baseModel;
      floatingPoint.value = lastestVersion.floatingPoint;
      modelSize.value = lastestVersion.modelSize;
      archive.value = _modelFile.url || '';
>>>>>>> a9050e8 (~)
      error.value = 0;
    };

    onMounted(() => {
      init();
    });

    return {
      error,
      errorText,
<<<<<<< HEAD

      nodeVisible,
<<<<<<< HEAD
      nodeHashCode,

=======
>>>>>>> f3be274 (9.1)
=======
      modelSn,
      carouselIndex,
<<<<<<< HEAD
      nodeVisible,
      nodeHashCode,
      nodeList,
>>>>>>> a9050e8 (~)
=======
>>>>>>> 77b72c4 (~)
      name,
      covers,
      version,
      tags,
      archive,
      baseModel,
<<<<<<< HEAD
      modelHashCode,
=======
      hashCodeSha256,
      hashCodeSha256Short,
>>>>>>> a9050e8 (~)
      floatingPoint,
      modelSize,
      description,
<<<<<<< HEAD
      onPressRun() {
<<<<<<< HEAD
        if (!modelHashCode.value) {
          message.error('Sorry, This model without \'Hash Code\'');
          return;
        }
        nodeVisible.value = true;
<<<<<<< HEAD
        nodeHashCode.value = modelHashCode.value;
=======
>>>>>>> f3be274 (9.1)
=======
=======
      type,
      modelInfo,
      async onPressRun() {
>>>>>>> 77b72c4 (~)
        if (!hashCodeSha256Short.value || hashCodeSha256Short.value === '-') {
          message.error("Sorry, This model without 'Hash Code'");
          return;
        }
<<<<<<< HEAD
        nodeVisible.value = true;
        nodeHashCode.value = hashCodeSha256Short.value;
>>>>>>> a9050e8 (~)
      },
      onNodeClose() {
        nodeVisible.value = false;
      },
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
      onNodeInit(list: NodeItem[]) {
        nodeList.value = list;
      },
      async onNodeRun() {
        let sdWindow: WindowProxy | null;
=======
>>>>>>> 77b72c4 (~)
        let parameters = '';
        let coverIndex = carouselIndex.value;
        let cover = covers.value[coverIndex];
        if (cover.parameters) {
          parameters = cover.parameters;
        } else {
<<<<<<< HEAD
          try {
            parameters = await parametersWith(covers.value[coverIndex].url);
          } catch (e) {
            console.error(e);
          }
        }

        console.info('image parameters :\n', parameters);
        
        if (parameters) {
          const handleMessage = (event: MessageEvent) => {
            const request: any = event.data as any;
            if (request.type === 'emchub-txt2img-ready') {
              sdWindow?.postMessage({ type: 'emchub-txt2img-parameters', data: parameters }, '*');
            }
            window.removeEventListener('message', handleMessage);
          };
          window.addEventListener('message', handleMessage);
        } else {
          console.warn(`${covers.value[0].url} can not parse parameters`);
        }

        nodeVisible.value = false;
        const host = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://models.emchub.ai';
        sdWindow = window.open(`${host}/#/sd/${nodeHashCode.value}`);

        // router.push({ name: 'sd', params: { modelHashCode: nodeHashCode.value } });
=======
          const [_parameters, isParameters] = await StableDiffusionMetadata.extract(cover.url);
          parameters = _parameters;
        }
        console.info('image parameters : ', parameters);
        if (!parameters) {
          console.warn(`${cover.url} can not parse parameters`);
        }

        navigateToSD(hashCodeSha256Short.value, parameters);
>>>>>>> 77b72c4 (~)
      },
>>>>>>> a9050e8 (~)
      async onNodePressItem(item: NodeItem) {
        let sdWindow: WindowProxy | null;
        let parameters = '';

        if (covers.value[0].parameters) {
          parameters = covers.value[0].parameters;
        } else {
          try {
            parameters = await parametersWith(covers.value[0].url);
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
        sdWindow = window.open(
          `https://sd.edgematrix.pro/#/txt2img?nodeid=${item.nodeId}`,
          `sd-window-${new Date().getTime()}`
        );
        // sdWindow = window.open(
        //   `http://localhost:8080/#/txt2img?nodeid=${item.nodeId}`,
        //   `sd-window-${new Date().getTime()}`
        // );
      },
>>>>>>> f3be274 (9.1)
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
<<<<<<< HEAD
>>>>>>> ac1038c (~)
=======
../sd/node-item
>>>>>>> 77b72c4 (~)
