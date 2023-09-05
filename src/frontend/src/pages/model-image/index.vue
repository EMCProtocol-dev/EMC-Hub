<template>
  <NSpace align="center" justify="center" :wrap-item="false" style="background-color: #f9f9f9">
    <NSpace class="content" :wrap-item="false">
      <NCard :bordered="false" content-style="padding:0;height:100%" style="width: 100%; height: 100%; position: relative">
        <NIcon class="icon-close" size="36" @click="onPressBack">
          <IconClose color="#999" />
        </NIcon>
        <NGrid cols="1 800:2" item-responsive x-gap="24">
          <NGridItem>
            <div class="layout-left">
              <div class="carousel-wrap">
                <NCarousel class="carousel" :autoplay="true">
                  <!-- <template v-for="cover in covers"> -->
                  <img class="cover" :src="imageInfo.url" />
                  <!-- </template> -->
                </NCarousel>
              </div>
            </div>
          </NGridItem>
          <NGridItem>
            <div class="layout-right" style="padding-top: 42px">
              <div style="max-height: calc(100vh - 196px); overflow-y: auto; padding-right: 20px">
                <div class="header">
                  <div class="header-row">
                    <NSpace align="center" justify="center" :wrap-item="false" style="width: 40px; height: 40px; background-color: #f5f5f5; border-radius: 100%; flex-shrink: 0">
                      <NIcon size="24"><IconPerson color="#666" /></NIcon>
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
                  <NH3>{{ imageInfo.imageTitle || '-' }}</NH3>
                  <div class="body-description">
                    <div class="with with__column">
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
              <NSpace align="center" justify="space-around" :size="[24, 24]" style="margin-top: 12px">
                <NButton color="#F5F5F5" text-color="#000" size="large" strong @click="onPressCopy">
                  <template #icon>
                    <NIcon><IconCopy /></NIcon>
                  </template>
                  Copy Generation Data
                </NButton>
                <NButton color="#A45EFF" size="large" strong @click="onPressRun">
                  <template #icon>
                    <NIcon><IconPlay /></NIcon>
                  </template>
                  Generate with this model
                </NButton>
              </NSpace>
            </div>
          </NGridItem>
        </NGrid>
      </NCard>
    </NSpace>
  </NSpace>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Http } from '@/tools/http';
import copy from 'copy-to-clipboard';
import moment from 'moment';

import { NLayout, NSpace, NGrid, NGridItem, NCard, NSpin, NCarousel, NTag, NButton, NIcon, NAvatar, NH4, NH3, useMessage, NH6 } from 'naive-ui';
import { StarOutline as IconStar, CloseCircleOutline as IconClose, CopyOutline as IconCopy, PlayCircleOutline as IconPlay, PersonSharp as IconPerson } from '@vicons/ionicons5';

type InfoType = {
  imageTitle: string;
  modelName: string;
  description: string;
  prompt: string;
  negativePrompt: string;
  sampler: string;
  steps: string;
  scale: string;
  seed: string;
  modelHash: string;
  raw: string;
  images: string;
  createTime: string;
  userName: string;
  userId: string;
  type: string;
};

export default defineComponent({
  name: 'model-images',
  components: { NLayout, NSpace, NGrid, NGridItem, NCard, NSpin, NCarousel, NTag, NH3, NH4, NH6, NButton, NIcon, NAvatar, IconStar, IconClose, IconCopy, IconPlay, IconPerson },
  setup() {
    const http = Http.getInstance();
    const message = useMessage();
    const router = useRouter();
    const route = useRoute();
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
    });

    // const covers = ref<Array<{ url: string; parameters: string }>>([  { url: '', }, ]);

    onMounted(() => {
      init();
    });

    const init = async () => {
      const { id } = route.params;

      const resp = await http.get({
        url: 'https://client.emchub.ai/emchub/api/client/modelImage/queryOne',
        data: { id: id },
      });
      if (resp._result !== 0) return;
      imageInfo.value = resp.data;
    };

    return {
      imageInfo,
      moment,
      onPressCopy() {
        copy(imageInfo.value.raw);
        message.success('Copied!');
      },
      onPressBack() {
        router.back();
      },
      onPressRun() {
        message.info('comming soon');
        // if (!hashCode.value) {
        //   message.error("Sorry, This model without 'Hash Code'");
        //   return;
        // }
        // nodeVisible.value = true;
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
  margin: 48px auto 0;
  background-color: #fff;
  border-radius: 20px;
  box-sizing: border-box;
}

.layout-loading {
  width: 100%;
  height: 600px;
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
  /* padding-top: 100%; */
  position: relative;
  border-radius: 10px;
  border: 1px solid #f9f9f9;
  overflow: hidden;
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
  padding: 0 12px;
}
.icon-close {
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
}
</style>
