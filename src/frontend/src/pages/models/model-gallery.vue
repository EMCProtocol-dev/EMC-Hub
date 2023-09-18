<template>
  <NSpace vertical :size="[24, 0]" :wrap-item="false">
    <NCard :bordered="false" content-style="padding:24px" header-style="padding:24px 24px 0" style="min-height: 400px">
      <template #header>
        <div>
          <span>Recommended posts</span>
        </div>
      </template>
      <template #header-extra>
        <NButton type="primary" color="#A45EFF" ghost strong :loading="loading" @click="onPressRefresh">Click to refresh</NButton>
      </template>
      <NGrid cols="2 600:3 800:4 1000:5" :x-gap="24" :y-gap="24" item-responsive>
        <template v-for="item in imageList">
          <NGridItem>
            <GalleryItem :item="item" @press="onPressItem" style="width: auto" />
          </NGridItem>
        </template>
      </NGrid>
    </NCard>
    <ModelImage :showModal="showModal" @cancel="cancel" :id="imageId" />
  </NSpace>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onActivated } from 'vue';
import { NSpace, NButton, NGrid, NGridItem, NSpin, NCard, NCarousel, NText, useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';
import { Http } from '@/tools/http';

import GalleryItem from './gallery-item.vue';
import ModelImage from '../model-image/index.vue';

export default defineComponent({
  name: 'models-gallery',
  components: {
    NSpace,
    NButton,
    NGrid,
    NGridItem,
    NSpin,
    NCard,
    NCarousel,
    NText,
    GalleryItem,
    ModelImage,
  },

  setup() {
    const http = Http.getInstance();
    const router = useRouter();

    const loading = ref(true);
    const imageList = ref<any[]>([]);
    const galleryTotal = ref(0);
    const galleryPageNo = ref(1);

    const showModal = ref(false);
    const imageId = ref('');

    onMounted(() => {
      galleryList(1);
    });

    const galleryList = async (pageNo: number) => {
      loading.value = true;
      const resp = await http.get({
        url: '/emchub/api/client/modelImage/queryList',
        data: { pageNo: pageNo, pageSize: 5 },
      });
      loading.value = false;
      const newList: any[] = resp.pageInfo?.list || [];
      galleryTotal.value = resp.pageInfo?.total || 0;
      imageList.value = newList;
    };

    const onPressRefresh = () => {
      const total = Math.floor(galleryTotal.value / 5) || 0;
      const pageNo = galleryPageNo.value < total ? (galleryPageNo.value = galleryPageNo.value + 1) : (galleryPageNo.value = 1);
      galleryList(pageNo);
    };

    return {
      loading,
      imageList,
      onPressRefresh,
      showModal,
      imageId,
      onPressItem(item: any) {
        imageId.value = item.id;
        showModal.value = true;
      },
      cancel() {
        showModal.value = false;
      },
    };
  },
});
</script>

<style scoped></style>
