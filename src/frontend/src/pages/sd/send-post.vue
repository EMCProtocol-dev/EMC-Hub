<template>
  <NModal v-model:show="isVisible" :close-on-esc="false" :block-scroll="false" :on-mask-click="onPressBack" :on-esc="onPressBack">
    <NSpace align="center" justify="center" :wrap-item="false" style="background-color: #f9f9f9; border-radius: 12px">
      <NSpace class="content" :wrap-item="false">
        <NCard :bordered="false" content-style="padding:0;height:100%" style="width: 100%; height: 100%; position: relative">
          <NIcon class="icon-close" size="36" @click="onPressBack">
            <IconClose color="#999" />
          </NIcon>
          <NGrid cols="1 876:2" item-responsive x-gap="24" style="height: 100%">
            <NGridItem>
              <div class="layout-left">
                <div class="carousel-wrap">
                  <NCarousel class="carousel" :autoplay="true">
                    <!-- <template v-for="cover in covers"> -->
                    <img class="cover" :src="insert.url" />
                    <!-- </template> -->
                  </NCarousel>
                </div>
              </div>
            </NGridItem>
            <NGridItem>
              <div class="layout-right" style="padding-top: 42px">
                <NScrollbar>
                  <div style="padding-right: 20px">
                    <div class="header">
                      <div class="header-row" style="margin-bottom: 28px">
                        <span style="font-size: 20px">Send a post</span>
                      </div>
                    </div>
                    <div class="body">
                      <NForm ref="formRef" :model="formData">
                        <NGrid :cols="24" :x-gap="24">
                          <NFormItemGi :span="24" path="imageTitle" label="Image title" show-require-mark>
                            <NInput type="textarea" v-model:value="formData.imageTitle" placeholder="Image title" :autosize="true" style="min-height: 32px; width: 80%" />
                          </NFormItemGi>
                          <NFormItemGi :span="24" path="description" label="About your image">
                            <NInput type="textarea" v-model:value="formData.description" placeholder="About your image" :autosize="true" style="min-height: 112px; width: 80%" />
                          </NFormItemGi>
                        </NGrid>
                      </NForm>
                      <NSpace align="center" justify="space-around" :size="[24, 24]" style="margin-top: 12px">
                        <NButton color="#A45EFF" strong @click="onSendPost" :loading="loading" style="width: 300px; height: 40px"> Send </NButton>
                      </NSpace>
                    </div>
                  </div>
                </NScrollbar>
              </div>
            </NGridItem>
          </NGrid>
        </NCard>
      </NSpace>
    </NSpace>
  </NModal>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Http } from '@/tools/http';
import copy from 'copy-to-clipboard';
import { useIsMobile, useIsTablet, useIsSmallDesktop, useIsDesktop } from '@/composables/use-screen';

import { NLayout, NModal, NSpace, NGrid, NForm, NFormItemGi, NGridItem, NInput, NCard, NScrollbar, NSpin, NCarousel, NTag, NButton, NIcon, NAvatar, NH4, NH3, useMessage, NH6 } from 'naive-ui';
import { StarOutline as IconStar, CloseCircleOutline as IconClose, CopyOutline as IconCopy, PlayCircleOutline as IconPlay, PersonSharp as IconPerson } from '@vicons/ionicons5';
import * as StableDiffusionMetadata from 'stable-diffusion-image-metadata';

type contentType = {
  style: { 'max-height': string };
};

interface FormDataType {
  imageTitle: string;
  description: string;
}

export default defineComponent({
  name: 'send-post',
  props: {
    showModal: { type: Boolean, default: false },
    insert: { type: Object, default: {} },
  },
  emits: ['cancel', 'info'],
  components: { NLayout, NModal, NSpace, NGrid, NInput, NForm, NFormItemGi, NGridItem, NCard, NScrollbar, NSpin, NCarousel, NTag, NH3, NH4, NH6, NButton, NIcon, NAvatar, IconStar, IconClose, IconCopy, IconPlay, IconPerson },
  setup(props, context) {
    const http = Http.getInstance();
    const message = useMessage();
    const router = useRouter();
    const route = useRoute();
    const isMobile = useIsMobile();
    const isTablet = useIsTablet();
    const isVisible = ref(props.showModal);
    const loading = ref(false);

    const formData = ref<FormDataType>({ imageTitle: '', description: '' });

    const onSendPost = async () => {
      const { insert } = props;
      const { imageTitle, description } = formData.value;
      insert.imageTitle = imageTitle || '';
      insert.description = description || '';
      loading.value = true;
      const resp = await http.postJSON({
        url: 'https://client.emchub.ai/emchub/api/client/modelImage/insert',
        data: insert,
      });
      if (resp._result !== 0) return;
      loading.value = false;
      message.success('success');
      context.emit('cancel');
    };
    const onPressBack = () => {
      context.emit('cancel');
    };
    watch(
      () => props.showModal,
      (newVal: boolean) => {
        isVisible.value = newVal;
      }
    );
    return {
      isVisible,
      onPressBack,
      isMobile,
      isTablet,
      formData,
      onSendPost,
      loading,
    };
  },
});
</script>

<style scoped>
.content {
  width: 1000px;
  height: 100%;
  min-height: 680px;
  padding: 24px 0 24px 24px;
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
  min-height: 680px;
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

.icon-close {
  position: absolute;
  top: 0;
  right: 20px;
  cursor: pointer;
}
</style>
