<template>
  <NModal v-model:show="isVisible" :close-on-esc="false" :block-scroll="false" :on-mask-click="onPressBack" :on-esc="onPressBack">
    <NSpace class="content" :wrap-item="false">
      <NIcon class="icon-close" size="36" @click="onPressBack">
        <IconClose color="#999" />
      </NIcon>
      <NGrid cols="1 1020:2" item-responsive x-gap="24" style="height: 100%">
        <NGridItem>
          <NCard class="layout-left" :bordered="false" content-style="padding:0">
            <div class="carousel-wrap">
              <NCarousel class="carousel" :autoplay="true">
                <!-- <template v-for="cover in covers"> -->
                <template v-if="imageInfo.url">
                  <img class="cover" :src="imageInfo.url" />
                </template>
                <template v-else>
                  <NSpace align="center" justify="center" style="width: 100%; height: 100%">
                    <NSpin />
                  </NSpace>
                </template>
                <!-- </template> -->
              </NCarousel>
            </div>
          </NCard>
        </NGridItem>
        <NGridItem>
          <NCard class="layout-right" :bordered="false" style="padding: 42px 0 62px" content-style="padding:0">
            <NScrollbar :style="contentStyle.style">
              <div style="padding-right: 20px">
                <div class="header">
                  <div class="header-row">
                    <NSpace align="center" justify="center" :wrap-item="false" style="width: 40px; height: 40px; background-color: #f5f5f5; border-radius: 100%; flex-shrink: 0">
                      <NIcon size="24">
                        <IconPerson color="#666" />
                      </NIcon>
                    </NSpace>
                    <!-- <NAvatar round size="large" src="" /> -->
                    <NSpace vertical :size="[0, 0]">
                      <NH4 class="item-body-row">{{ imageInfo.userName || 'user' + imageInfo.userId }}</NH4>
                      <NH6 class="item-body-row" style="font-size: 12px; color: #666">{{ moment(imageInfo.createTime).fromNow() }}</NH6>
                    </NSpace>
                    <!-- <NButton ghost round color="#A45EFF">
                      <template #icon>
                        <NIcon>
                          <IconStar color="#A45EFF" />
                        </NIcon>
                      </template>
                      Follow
                    </NButton> -->
                  </div>
                </div>
                <div class="body">
                  <NH3 style="margin-bottom: 0px">{{ imageInfo.imageTitle || '-' }}</NH3>
                  <div class="with with__column">
                    <div class="body-description">
                      <div class="with-label">About your image:</div>
                      <div class="with-value with-value__area">
                        {{ imageInfo.description || '-' }}
                      </div>
                    </div>
                  </div>
                  <div class="with with__column">
                    <div class="with-label">Resources Used</div>
                    <NSpace class="with-value with-value__area" justify="space-between" align="center">
                      <span>{{ imageInfo.modelName }}</span>
                      <NSpace class="tags" :wrap-item="false" :size="[8, 8]">
                        <!-- <template v-for="tag in tags"> -->
                        <!-- <NTag round size="small" :bordered="false" :color="{ color: '#8f7df8', textColor: '#f1f1f1' }"> {{ imageInfo.type || '-' }}</NTag> -->
                        <!-- </template> -->
                      </NSpace>
                    </NSpace>
                  </div>
                  <div class="with with__column">
                    <div class="with-label">Prompt details</div>
                    <div class="with-value with-value__area">
                      {{ imageInfo.prompt || '-' }}
                    </div>
                  </div>
                  <div class="with with__column">
                    <div class="with-label">Negative prompt</div>
                    <div class="with-value with-value__area">{{ imageInfo.negativePrompt || '-' }}</div>
                  </div>
                  <NSpace class="with with__column" :wrap="false" :wrap-item="false">
                    <div style="flex: 1">
                      <div class="with-label">Sampler</div>
                      <div class="with-value with-value__area">{{ imageInfo.sampler || '-' }}</div>
                    </div>
                    <div style="flex: 1">
                      <div class="with-label">Steps</div>
                      <div class="with-value with-value__area">{{ imageInfo.steps || '-' }}</div>
                    </div>
                  </NSpace>
                  <NSpace class="with with__column" :wrap="false" :wrap-item="false">
                    <div style="flex: 1">
                      <div class="with-label">CFG scale</div>
                      <div class="with-value with-value__area">{{ imageInfo.scale || '-' }}</div>
                    </div>
                    <div style="flex: 1">
                      <div class="with-label">Seed</div>
                      <div class="with-value with-value__area">{{ imageInfo.seed || '-' }}</div>
                    </div>
                  </NSpace>
                </div>
              </div>
            </NScrollbar>
            <NSpace class="card-button" align="center" justify="space-around" :size="[24, 24]">
              <NButton color="#F5F5F5" text-color="#000" size="large" strong @click="onPressCopy">
                <template #icon>
                  <NIcon>
                    <IconCopy />
                  </NIcon>
                </template>
                Copy Generation Data
              </NButton>
              <NButton color="#A45EFF" size="large" strong @click="onPressRun">
                <template #icon>
                  <NIcon>
                    <IconPlay />
                  </NIcon>
                </template>
                Generate with this model
              </NButton>
            </NSpace>
          </NCard>
        </NGridItem>
      </NGrid>
    </NSpace>
  </NModal>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Http } from '@/tools/http';
import copy from 'copy-to-clipboard';
import moment from 'moment';
import { useIsMobile, useIsTablet, useIsSmallDesktop, useIsDesktop } from '@/composables/use-screen';

import { NLayout, NModal, NSpace, NGrid, NGridItem, NCard, NScrollbar, NSpin, NCarousel, NTag, NButton, NIcon, NAvatar, NH4, NH3, useMessage, NH6 } from 'naive-ui';
import { StarOutline as IconStar, CloseCircleOutline as IconClose, CopyOutline as IconCopy, PlayCircleOutline as IconPlay, PersonSharp as IconPerson } from '@vicons/ionicons5';
import * as StableDiffusionMetadata from 'stable-diffusion-image-metadata';
import { navigateToSD } from '@/pages/model-detail/utils';
type contentType = {
  style: { 'max-height': string };
};

export default defineComponent({
  name: 'model-images',
  props: {
    showModal: { type: Boolean, default: false },
    id: { type: [String, Number], default: 0 || '' },
  },
  emits: ['cancel', 'info'],
  components: { NLayout, NModal, NSpace, NGrid, NGridItem, NCard, NScrollbar, NSpin, NCarousel, NTag, NH3, NH4, NH6, NButton, NIcon, NAvatar, IconStar, IconClose, IconCopy, IconPlay, IconPerson },
  setup(props, context) {
    const http = Http.getInstance();
    const message = useMessage();
    const router = useRouter();
    const route = useRoute();
    const isMobile = useIsMobile();
    const isTablet = useIsTablet();
    const isVisible = ref(false);
    const imageId = ref('');

    const imageInfo = ref({
      imageTitle: '',
      modelName: '',
      description: '',
      prompt: '',
      negativePrompt: '',
      sampler: '',
      steps: '',
      scale: '',
      seed: '',
      modelHash: '',
      raw: '',
      url: '',
      createTime: '',
      userName: '',
      userId: '',
      type: '',
      modelSn: '',
      hashs: '',
    });

    // const covers = ref<Array<{ url: string; parameters: string }>>([  { url: '', }, ]);

    const contentStyle = computed<contentType>(() => {
      if (isMobile.value || isTablet.value) {
        return { style: { 'max-height': '' } };
      } else {
        return { style: { 'max-height': 'calc(100vh - 196px)' } };
      }
    });

    onMounted(() => {});

    const init = async (id: string) => {
      // const { id } = route.params;
      // const { id } = props;

      const resp = await http.get({
        url: '/emchub/api/client/modelImage/queryOne',
        data: { id: id },
      });
      if (resp._result !== 0) return;
      imageInfo.value = resp.data;
      const pf = StableDiffusionMetadata.parse(resp.data.raw);
      const hashs: any = pf.hashes;
      imageInfo.value.hashs = hashs.model;
    };
    const onPressBack = () => {
      imageId.value = '';
      context.emit('cancel');
    };
    watch(
      () => props.showModal,
      (newVal: boolean) => {
        isVisible.value = newVal;
        imageId.value = props.id as string;
        init(imageId.value);
      }
    );
    return {
      isVisible,
      onPressBack,
      imageInfo,
      moment,
      contentStyle,
      isMobile,
      isTablet,
      onPressCopy() {
        copy(imageInfo.value.raw);
        message.success('Copied!');
      },
      async onPressRun() {
        // message.info('comming soon');
        let parameters = '';
        if (imageInfo.value.raw) {
          parameters = imageInfo.value.raw;
        } else {
          const [_parameters, isParameters] = await StableDiffusionMetadata.extract(imageInfo.value.url);
          parameters = _parameters;
        }

        console.info('image parameters :\n', parameters);

        if (!parameters) {
          console.warn(`${imageInfo.value.url} can not parse parameters`);
        }

        navigateToSD(imageInfo.value.hashs, parameters);
        // router.push({ name: 'sd', params: { modelHashCode: ''} });
      },
    };
  },
});
</script>

<style scoped>
.content {
  width: 1440px;
  height: 100%;
  min-height: calc(100vh - 96px);
  padding: 24px;
  margin: 0px auto;
  background-color: #fff;
  border-radius: 20px;
  box-sizing: border-box;
}

.layout-left,
.layout-right {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.carousel-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #f9f9f9;
  box-sizing: border-box;
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
  object-fit: contain;
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

.item-body-row {
  margin: 0 32px 0 12px;
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
  background-color: #f5f5f5;
  min-height: 32px;

  line-height: 32px;
}

.body-description {
  border-radius: 10px;
  border: 1px solid #c7cddb;
  padding: 12px;
}

.icon-close {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  z-index: 1;
}
.card-button {
  width: 100%;
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
