<template>
   <div class="page">
      <NSpace justify="space-between" style="margin: 96px 0 48px">
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
         <NButton color="#A45EFF" icon-placement="right"
            style="background: linear-gradient(90deg, #4e74fc 0%, #bb3ef7 100%); color: #fff; padding: 8px 12px; border-radius: 6px"
            @click="onPressAdd">
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
            <Waterfall :list="newList" :gutter="24" :width="248">
               <template #item="{ item, url, index }">
                  <GalleryItem :item="item" @press="onPressImages" :key="item.id" />
               </template>
            </Waterfall>
         </template>
         <template v-else>
            <NSpace align="center" justify="center" style="background: #fff;min-height: 400px;">
               <NEmpty description="No pictures" />
            </NSpace>
         </template>
      </template>
      <template v-else>
         <NSpin size="medium" />
      </template>

      <GalleryUpload :showModal="showModal" :modelInfo="modelInfo" @cancel="cancel" />
   </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Http } from '@/tools/http';

import { NCard, NH2, NH3, NSpace, NSpin, NTag, NCarousel, NDescriptions, NDescriptionsItem, NEmpty, NButton, NIcon, NModal, NGrid, NGridItem, useMessage, NPopselect } from 'naive-ui';
import { AddSharp as IconAdd, ChevronDownSharp as IconDown } from '@vicons/ionicons5';
import GalleryItem from './gallery-item.vue';
import GalleryUpload from './gallery-upload.vue';
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next';
import 'vue-waterfall-plugin-next/dist/style.css';

export default defineComponent({
   name: 'node-detail',
   props: {
      modelInfo: { type: Object, default: {} },
   },
   components: {
      NCard,
      NH2,
      NH3,
      NSpace,
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
      NSpin,
      NEmpty,
      IconAdd,
      IconDown,
      GalleryUpload,
      GalleryItem,
      Waterfall,
   },

   setup(props) {
      const route = useRoute();
      const message = useMessage();
      const router = useRouter();
      const http = Http.getInstance();

      const selectValue = ref('NEWEST');
      const showModal = ref(false);
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
         options: [
            {
               label: 'NEWEST',
               value: 'NEWEST',
            },
         ],
         onPressAdd() {
            showModal.value = true;
         },
         cancel() {
            showModal.value = false;
         },
         onPressImages(item: any) {
            router.push({ name: 'model-images', params: { id: item.id } });
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
