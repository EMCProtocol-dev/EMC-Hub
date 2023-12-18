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
                <NCarousel class="carousel" v-model:current-index="carouselIndex" :autoplay="true" :show-arrow="covers.length > 1">
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
                  <div class="with-value">{{ hashCodeSha256Short || '-' }}</div>
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
                    <NIcon>
                      <IconRun />
                    </NIcon>
                  </template>
                  Run model
                </NButton>
                <NButton type="primary" color="#A45EFF" size="large" strong :loading="archiveUrlLoading" @click="onPressArchive">
                  <template #icon>
                    <NIcon>
                      <IconDownload />
                    </NIcon>
                  </template>
                  Download model package
                </NButton>
              </NSpace>
            </div>
          </NGridItem>
        </NGrid>
      </template>
    </NCard>
    <ModelGallery :modelInfo="modelInfo" />
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { NCard, NH3, NSpace, NSpin, NTag, NCarousel, NDescriptions, NDescriptionsItem, NButton, NIcon, NModal, NGrid, NGridItem, NText, useMessage, NPopselect } from 'naive-ui';
import { Http } from '@/tools/http';
import { Utils } from '@/tools/utils';
import { DownloadSharp as IconDownload, CaretForwardCircleOutline as IconRun, CloseSharp as IconClose } from '@vicons/ionicons5';

import { navigateToSD } from './utils';
import * as StableDiffusionMetadata from 'stable-diffusion-image-metadata';
import { useMinio } from '@/composables/use-minio';
import ModelGallery from './model-gallery.vue';

export default defineComponent({
  name: 'model-detail',
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
    NText,
    NPopselect,
    IconRun,
    IconClose,
    IconDownload,
    ModelGallery,
  },
  setup() {
    const route = useRoute();
    const message = useMessage();
    const modelSn = ref(route.params.modelSn as string);
    const error = ref(-1);
    const errorText = ref('');
    const carouselIndex = ref(0);
    const archiveUrlLoading = ref(false);
    const router = useRouter();
    const http = Http.getInstance();

    const name = ref('');
    const covers = ref<Array<{ url: string; parameters: string }>>([]);
    const archive = ref('');
    const version = ref('');
    const tags = ref<string[]>([]);
    const baseModel = ref('');
    const hashCodeSha256 = ref('');
    const hashCodeSha256Short = ref('');
    const floatingPoint = ref('');
    const modelSize = ref('');
    const description = ref('');
    const type = ref('');

    const modelInfo = ref({
      modelHashCode: '',
      modelName: '',
      modelType: '',
      modelSn: '',
      alias: '',
    });

    const { getArchiveUrl } = useMinio();

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
      const _hashCodeSha256 = (lastestVersion.hashCodeSha256 || '-').trim().toLocaleLowerCase(); //'aa9c45d00a';
      const _shortHashCodeSha256 = _hashCodeSha256.substring(0, 10);
      name.value = data.modelName;
      tags.value = _tags;
      covers.value = _covers;
      description.value = data.description;
      type.value = data.type || '-';
      version.value = lastestVersion.modelVersion || '-';
      hashCodeSha256.value = _hashCodeSha256;
      hashCodeSha256Short.value = _shortHashCodeSha256;
      baseModel.value = lastestVersion.baseModel;
      floatingPoint.value = lastestVersion.floatingPoint;
      modelSize.value = lastestVersion.modelSize;
      archive.value = _modelFile.url || '';
      error.value = 0;

      modelInfo.value.modelHashCode = _hashCodeSha256;
      modelInfo.value.modelName = data.modelName;
      modelInfo.value.modelType = data.type;
      modelInfo.value.modelSn = modelSn.value;
      modelInfo.value.alias = data.modelVersions[0].alias;
    };

    onMounted(() => {
      init();
    });

    return {
      error,
      errorText,
      modelSn,
      carouselIndex,
      archiveUrlLoading,
      name,
      covers,
      version,
      tags,
      archive,
      baseModel,
      hashCodeSha256,
      hashCodeSha256Short,
      floatingPoint,
      modelSize,
      description,
      type,
      modelInfo,
      async onPressRun() {
        if (!hashCodeSha256Short.value || hashCodeSha256Short.value === '-') {
          message.error("Sorry, This model without 'Hash Code'");
          return;
        }
        let parameters = '';
        let coverIndex = carouselIndex.value;
        let cover = covers.value[coverIndex];
        if (cover.parameters) {
          parameters = cover.parameters;
        } else {
          const [_parameters, isParameters] = await StableDiffusionMetadata.extract(cover.url);
          parameters = _parameters;
        }
        console.info('image parameters : ', parameters);
        if (!parameters) {
          console.warn(`${cover.url} can not parse parameters`);
        }

        navigateToSD(hashCodeSha256Short.value, parameters);
      },
      async onPressArchive() {
        if (!archive.value) {
          message.error('Sorry, The package disappears');
          return;
        }
        archiveUrlLoading.value = true;
        const { url } = await getArchiveUrl(archive.value);
        archiveUrlLoading.value = false;
        if (!url) {
          message.error('Sorry, Not found url');
          return;
        }
        window.open(url);
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
../sd/node-item
