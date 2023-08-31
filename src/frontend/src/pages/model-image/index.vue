<template>
  <NLayout position="absolute" style="display: flex; justify-content: center; align-items: center; background-color: #f9f9f9">
    <NSpace class="content" :wrap-item="false">
      <NCard :bordered="false" content-style="padding:0;height:100%" style="width: 100%">
        <NGrid cols="2" item-responsive style="height: 100%" x-gap="24">
          <NGridItem span="2 880:1">
            <div class="layout-left">
              <div class="carousel-wrap">
                <NCarousel class="carousel" :autoplay="true">
                  <template v-for="cover in covers">
                    <img class="cover" :src="cover.url" />
                  </template>
                </NCarousel>
              </div>
            </div>
          </NGridItem>
          <NGridItem span="2 880:1">
            <div class="layout-right">
              <div style="max-height: calc(100vh - 196px); overflow-y: auto; padding-right: 20px">
                <div class="header">
                  <NSpace justify="end">
                    <NIcon size="36" @click="onPressBack" style="cursor: pointer">
                      <IconClose color="#999" />
                    </NIcon>
                  </NSpace>
                  <div class="header-row">
                    <NAvatar round size="large" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
                    <div class="item-body-row">
                      <NH4 style="margin-bottom: 0">sdadfsdfsdf</NH4>
                    </div>
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
                  <div class="with with__column">
                    <div class="with-label">Resources Used</div>
                    <NSpace class="with-value with-value__area" justify="space-between" align="center">
                      <span>A-Mecha Musume</span>
                      <NSpace class="tags" :wrap-item="false" :size="[8, 8]">
                        <!-- <template v-for="tag in tags"> -->
                        <NTag round size="small" :bordered="false" :color="{ color: '#8f7df8', textColor: '#f1f1f1' }">
                          Lora
                          <!-- {{ tag }} -->
                        </NTag>
                        <!-- </template> -->
                      </NSpace>
                    </NSpace>
                  </div>
                  <div class="with with__column">
                    <div class="with-label">Prompt details</div>
                    <div class="with-value with-value__area">
                      masterpiece,best q masterpiece,best q masterpiece,best q masterpiece,best q masterpiece,best q masterpiece,best q masterpiece,best q masterpiece,best q masterpiece,best q masterpiece,best q masterpiece,best q starry
                      starry sky,skylpiece,best q masterpiece,best q masterpiece,best q masterpiece,best q masterpiece,best q masterpiece,best q masterpiece,best q masterpiece,best q masterpiece,best q masterpiece,best q masterpiece,best q
                      starry sky,skyl
                    </div>
                  </div>
                  <div class="with with__column">
                    <div class="with-label">Negative prompt</div>
                    <div class="with-value with-value__area">EasyNegative, (worst quality:1.4), (low quality:1.4), (normal quality:1.4), lowres, badhandv4,</div>
                  </div>
                  <NSpace class="with with__column" :wrap="false" :wrap-item="false">
                    <div style="flex: 1">
                      <div class="with-label">Sampler</div>
                      <div class="with-value with-value__area">Sampler</div>
                    </div>
                    <div style="flex: 1">
                      <div class="with-label">Steps</div>
                      <div class="with-value with-value__area">Steps</div>
                    </div>
                  </NSpace>
                  <NSpace class="with with__column" :wrap="false" :wrap-item="false">
                    <div style="flex: 1">
                      <div class="with-label">CFG scale</div>
                      <div class="with-value with-value__area"></div>
                    </div>
                    <div style="flex: 1">
                      <div class="with-label">Seed</div>
                      <div class="with-value with-value__area"></div>
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
                <NButton color="#A45EFF" size="large" strong @click="onPressBack">
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
  </NLayout>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMinio } from '@/composables/use-minio';
import { Http } from '@/tools/http';
import { useUserStore } from '@/stores/user';
import { sign } from '@/tools/open-api';
import copy from 'copy-to-clipboard';

import { NLayout, NSpace, NGrid, NGridItem, NCard, NSpin, NCarousel, NTag, NButton, NIcon, NAvatar, NH4, useMessage } from 'naive-ui';
import { StarOutline as IconStar, CloseCircleOutline as IconClose, CopyOutline as IconCopy, PlayCircleOutline as IconPlay } from '@vicons/ionicons5';
export default defineComponent({
  name: 'model-images',
  components: { NLayout, NSpace, NGrid, NGridItem, NCard, NSpin, NCarousel, NTag, NButton, NIcon, NAvatar, NH4, IconStar, IconClose, IconCopy, IconPlay },
  setup() {
    const http = Http.getInstance();

    const name = ref('');
    const message = useMessage();
    const router = useRouter();
    const covers = ref<Array<{ url: string; parameters: string }>>([
      {
        url: 'https://res.emchub.ai/emcbucket/2023/07/24/%5B1690211014903%5D00029-3331471849-masterpiece%2Cbest%20quality%2Cupper%20body%2C1girl%2Csmall%20breasts%2Ccollared_shirt%20and%20flared_skirt%20as%20material2%2Cpink%20theme%2Cbook%20cover%20_%28med.png',
        parameters: '',
      },
    ]);

    onMounted(() => {
      init();
    });

    const init = async () => {
      const resp = await http.get({
        url: 'https://client.emchub.ai/emchub/api/client/modelImage/queryOne',
        data: { id: 1 },
      });
      console.log(resp);
    };

    return {
      covers,
      onPressCopy() {
        copy('HHH');
        message.success('Copied!');
      },
      onPressBack() {
        router.back();
      },
    };
  },
});
</script>

<style scoped>
.content {
  width: 1440px;
  height: calc(100vh - 96px);
  padding: 24px;
  margin: 48px auto;
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
  height: 100%;
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
</style>
