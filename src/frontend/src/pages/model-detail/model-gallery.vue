<template>
  <div class="page">
    <NSpace justify="space-between" style="margin: 60px 0 48px">
      <NSpace align="center">
        <NH2 style="margin: 0">Gallery</NH2>
        <NPopselect v-model:value="selectValue" :options="options" trigger="click">
          <NButton icon-placement="right">
            {{ selectValue || 'select' }}
            <template #icon>
              <NIcon>
                <IconDown />
              </NIcon>
            </template>
          </NButton>
        </NPopselect>
      </NSpace>
      <NButton color="#A45EFF" icon-placement="right" style="background: linear-gradient(90deg, #9540ff 0%, #bb3ef7 100%); color: #fff; padding: 8px 12px; border-radius: 6px" @click="onPressAdd">
        Add Post
        <template #icon>
          <NIcon>
            <IconAdd color="#fff" />
          </NIcon>
        </template>
      </NButton>
    </NSpace>
    <template v-if="newList">
      <template v-if="newList.length !== 0">
        <Waterfall :list="newList" :gutter="24" :width="249.6" style="min-height: 400px" row-key="id">
          <template #item="{ item, url, index }">
            <!-- <GalleryItem :item="item" @press="onPressImages" :key="item.id" /> -->
            <div class="item" @click="onPressImages(item)">
              <div class="item-carousel-wrap">
                <NCarousel class="item-carousel" :autoplay="true">
                  <!-- <template v-for="cover in item.covers"> -->
                  <template v-if="item.url">
                    <!-- <AppImage class="item-cover" :src="item.url" object-fit="cover" :preview-disabled="true" :imgProps="{ style: 'width:100%;height:100%;' }" /> -->
                    <LazyImg class="item-cover" :url="item.url" />
                  </template>
                  <template v-else>
                    <NEmpty style="padding: 96px 0" />
                  </template>
                  <!-- </template> -->
                </NCarousel>
              </div>
              <NSpace class="item-body" align="center" :wrap-item="false" :wrap="false">
                <NSpace align="center" justify="center" :wrap-item="false" style="width: 40px; height: 40px; background-color: #f5f5f5; border-radius: 100%; flex-shrink: 0">
                  <NIcon size="24"><IconPerson color="#666" /></NIcon>
                </NSpace>
                <!-- <NAvatar round size="large" src="" /> -->
                <NSpace vertical :size="[0, 0]">
                  <NH4 class="item-body-row">{{ item.userName || 'user' + item.userId }}</NH4>
                  <NH6 class="item-body-row" style="font-size: 12px; color: #666"> {{ moment(item.createTime).fromNow() }}</NH6>
                </NSpace>
              </NSpace>
            </div>
          </template>
        </Waterfall>
      </template>
      <template v-else>
        <NSpace align="center" justify="center" style="background: #fff; min-height: 400px">
          <NEmpty description="No pictures" />
        </NSpace>
      </template>
    </template>
    <template v-else>
      <NSpin size="medium" />
    </template>
    <ModelImage :showModal="showImage" @cancel="cancelImage" :id="imageId" />
    <GalleryUpload :showModal="showModal" :modelInfo="modelInfo" @cancel="cancel" :initList="initList" />
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Http } from '@/tools/http';
import { useUserStore } from '@/stores/user';

import { NH2, NH4, NH6, NSpace, NSpin, NCarousel, NEmpty, NButton, NIcon, NModal, useMessage, NPopselect } from 'naive-ui';
import { AddSharp as IconAdd, ChevronDownSharp as IconDown, PersonSharp as IconPerson } from '@vicons/ionicons5';
import moment from 'moment';

import GalleryUpload from './gallery-upload.vue';
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next';
import 'vue-waterfall-plugin-next/dist/style.css';
import ModelImage from '../model-image/index.vue';

export default defineComponent({
  name: 'model-detail-gallery',
  props: {
    modelInfo: { type: Object, default: {} },
  },
  components: {
    NH2,
    NH4,
    NH6,
    NSpace,
    NCarousel,
    NButton,
    NIcon,
    NModal,
    NPopselect,
    NSpin,
    NEmpty,
    IconAdd,
    IconDown,
    GalleryUpload,
    IconPerson,
    Waterfall,
    LazyImg,
    ModelImage,
  },

  setup(props, ctx) {
    const route = useRoute();
    const message = useMessage();
    const router = useRouter();
    const http = Http.getInstance();
    const userStore = useUserStore();

    const selectValue = ref('NEWEST');
    const showModal = ref(false);
    const showImage = ref(false);
    const imageId = ref('');

    const list = ref<any[]>([]);
    const newList = ref<any[]>([]);

    const pageNo = ref(1);
    const pageSize = ref(50);
    const loading = ref(true);

    onMounted(() => {
      initList();
    });
    const { modelSn } = route.params;
    const updateList = async () => {
      loading.value = true;
      const resp = await http.get({
        url: 'https://client.emchub.ai/emchub/api/client/modelImage/queryListByModelSn',
        data: { pageNo: pageNo.value, pageSize: pageSize.value, modelSn: modelSn },
      });
      loading.value = false;
      if (resp._result !== 0) return;

      newList.value = resp.pageInfo?.list || [];
      // const newList: any[] = resp.pageInfo?.list || [];
    };
    const initList = async () => {
      pageNo.value = 1;
      return updateList();
    };

    return {
      newList,
      selectValue,
      showModal,
      showImage,
      imageId,
      initList,
      moment,
      options: [
        {
          label: 'NEWEST',
          value: 'NEWEST',
        },
      ],
      onPressAdd() {
        if (userStore.user.id === '') {
          message.warning('please log in first');
          return;
        }
        showModal.value = true;
      },
      cancel() {
        showModal.value = false;
      },
      cancelImage() {
        showImage.value = false;
      },
      onPressImages(item: any) {
        // router.push({ name: 'model-images', params: { id: item.id } });
        imageId.value = item.id;
        showImage.value = true;
      },
    };
  },
});
</script>

<style scoped>
.item {
  width: 100%;
  border: solid 1px #f1f1f1;
  border-radius: 8px;
  box-shadow: 1px 1px 6px 0 #cccccc50;
  cursor: pointer;
}

.item-carousel {
  width: 100%;
  height: 100%;
}
.item-cover {
  width: 100%;
  height: 100%;
  transform: scale(1);
  transition: all 0.2s;
}

.item-cover:hover {
  transform: scale(1.2);
}
.item-carousel-wrap {
  width: 100%;
  /* padding-top: calc(100% * 1.25); */
  position: relative;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  overflow: hidden;
}
.item-body {
  padding: 10px 16px 16px 16px;
}
.item-body-row {
  margin-bottom: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
