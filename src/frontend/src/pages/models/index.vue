<template>
  <div class="page">
    <NSpace vertical :size="[0, 24]" :wrap-item="false">
      <!-- <NGrid cols="5" :x-gap="24" :y-gap="24" item-responsive>
        <NGridItem span="5 1000:2">
          <NSpace :wrap-item="false" :wrap="false" :size="[24, 0]">
            <template v-for="item in nftList">
              <NFTItem :item="item" style="flex: 1; width: 0" />
            </template>
          </NSpace>
        </NGridItem>
        <NGridItem span="5 1000:3">
          <div class="grid-item-content">
            <NCarousel class="carousel" autoplay>
              <template v-for="item in bannerList">
                <NA :href="item.link" target="_blank">
                  <img class="carousel-img" :src="item.cover" />
                </NA>
              </template>
            </NCarousel>
          </div>
        </NGridItem>
      </NGrid> -->
      <NCard :bordered="false" content-style="padding:0" header-style="padding:20px 20px 0">
        <template #header>
          <div>
            <span>Recommended models</span>
            <!-- <div style="font-size: 14px; font-weight: 400">Total {{ itemCount }}</div> -->
          </div>
        </template>
        <template #header-extra>
          <template v-if="nickname === '顺子'">
            <NButton type="primary" ghost strong @click="onPressUpload">Click to upload</NButton>
          </template>
        </template>
        <NSpace :wrap-item="false" :size="[24, 0]" :wrap="true">
          <template v-if="loading">
            <NSpace align="center" justify="center" :wrap-item="false" :wrap="false" style="width: 100%; height: 600px">
              <NSpin />
            </NSpace>
          </template>
          <template v-else>
            <!-- <NGrid cols="2 600:3 800:4 1000:5" :x-gap="24" :y-gap="24" item-responsive>
              <template v-for="item in list">
                <NGridItem>
                <ModelItem :item="item" @press="onPressItem" style="width: auto" />
            </NGridItem>
                  </template>
                </NGrid> -->
            <!-- <ModelItem :item="item" @press="onPressItem" style="width: auto" :key="item.modelId" /> -->
            <Waterfall :list="list" :gutter="24" :width="249.6" style="min-height: 600px" row-key="id">
              <template #item="{ item, url, index }">
                <NSpace class="item-carousel-wrap" :wrap-item="false" @click="onPressItem(item)">
                  <LazyImg class="item-cover" :url="item.covers[0]" />
                  <NSpace class="item-carousel-overlay" :wrap-item="false">
                    <NSpace class="item-carousel-overlay-type" :wrap-item="false" align="center">{{ item.type }}</NSpace>
                    <NSpace class="item-carousel-overlay-footer" vertical :wrap-item="false" :size="[0, 12]">
                      <NText style="color: #fff">{{ item.name }}</NText>
                    </NSpace>
                  </NSpace>
                </NSpace>
              </template>
            </Waterfall>
          </template>
        </NSpace>
      </NCard>
    </NSpace>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onActivated } from 'vue';
import { NA, NPagination, NSpace, NButton, NGrid, NGridItem, NSpin, NCard, NCarousel, NText, useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';
import { Http } from '@/tools/http';
import { Utils } from '@/tools/utils';
import { useUserStore } from '@/stores/user';
import { Waterfall, LazyImg } from 'vue-waterfall-plugin-next';
import 'vue-waterfall-plugin-next/dist/style.css';
import NFTItem from './nft-item.vue';
import type { Item as NftItemDef } from './nft-item';

import ModelItem from './model-item.vue';

type BannerItem = {
  cover: string;
  link: string;
};

export default defineComponent({
  name: 'models',
  components: {
    NA,
    NPagination,
    NSpace,
    NButton,
    NGrid,
    NGridItem,
    NSpin,
    NCard,
    NCarousel,
    NFTItem,
    ModelItem,
    Waterfall,
    LazyImg,
    NText,
  },
  beforeRouteEnter(to, from, next) {
    if (typeof to.meta !== 'object') {
      to.meta = {};
    }
    if (from.name === 'node-detail') {
      to.meta.isBack = true;
    } else {
      to.meta.isBack = false;
    }
    next();
  },

  setup() {
    const userStore = useUserStore();
    const message = useMessage();
    const router = useRouter();

    const bannerList = ref<BannerItem[]>([]);
    const nftList = ref<NftItemDef[]>([]);

    const list = ref<any[]>([]);
    const loading = ref(true);
    const pageNo = ref(1);
    const pageSize = ref(80);
    const queryParams = ref<any>({});
    const pageCount = ref(1);
    const itemCount = ref(0);
    const http = Http.getInstance();

    const updateList = async () => {
      loading.value = true;
      const resp = await http.get({
        url: '/emchub/api/client/modelInfo/queryList',
        data: { pageNo: pageNo.value, pageSize: pageSize.value },
      });
      loading.value = false;

      const newList: any[] = resp.pageInfo?.list || [];
      const total = resp.totalNum || 0;
      list.value = [];
      newList.forEach((item) => {
        const tags: any[] = item.tags ? item.tags.split(',') : [];
        const covers: string[] = [];
        if (item.modelVersions && item.modelVersions[0] && item.modelVersions[0].previewPicturesUrl) {
          const lastestVersionImages = Utils.parseJSON(item.modelVersions[0].previewPicturesUrl);
          lastestVersionImages.forEach((item: any) => {
            covers.push(item.url);
          });
        }
        list.value.push({
          id: item.modelId,
          sn: item.modelSn,
          tags: tags,
          name: item.modelName,
          status: item.status,
          covers: covers,
          type: item.type,
          userId: item.userId,
        });
      });
      itemCount.value = total;
      pageCount.value = Math.ceil(total / pageSize.value);
    };

    const initList = async () => {
      pageNo.value = 1;
      return updateList();
    };

    onActivated(async () => {
      // if (route.meta.isBack) {
      // } else {
      // }
      const resp = await http.get({ url: 'https://ma.emchub.ai/config.json' });
      bannerList.value = resp.banners;
      nftList.value = resp.nfts.map((item: any) => ({
        link: item.link,
        cover: item.cover,
        publisherName: item.name,
        publisherAvatar: item.avatar,
        numericals: item.data,
      }));

      initList();
    });

    return {
      nickname: computed(() => userStore.user.nickname),
      nftList,
      bannerList,
      list,
      loading,
      pageNo,
      pageSize,
      queryParams,
      pageCount,
      itemCount,
      initList,
      updateList,
      onPressUpload() {
        if (!userStore.user.id) {
          message.error('Please sign in first');
          return;
        }
        const host = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://models.emchub.ai';
        window.open(`${host}/#/model-upload`, `emchub-upload-${new Date().getTime()}`);
        // router.push({ name: 'model-upload' });
      },
      onPressItem(item: any) {
        router.push({ name: 'model-detail', params: { modelSn: item.sn } });
      },
    };
  },
});
</script>

<style scoped>
.grid-item-content {
  width: 100%;
  height: 100%;
  /* size of banner image file  */
  padding-top: calc(100% * 0.46);
  box-sizing: border-box;
  position: relative;
}

.carousel {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-carousel-wrap {
  position: relative;
  width: 100%;
  border-radius: 6px;
  box-shadow: 1px 1px 6px 0 #ccc;
  cursor: pointer;
  box-sizing: border-box;
  overflow: hidden;
  /* padding-top: calc(100% * 1.25); */
}

.item-carousel-overlay {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.item-cover {
  width: 100%;
  height: 100%;
  transform: scale(1);
  transition: all 0.2s;
  object-fit: cover;
}

.item-carousel-wrap:hover .item-cover {
  transform: scale(1.2);
}

.item-carousel-overlay-type {
  position: absolute;
  top: 16px;
  left: 16px;
  height: 20px;
  padding: 0px 12px;
  font-size: 12px;
  color: #ffffff;
  border-radius: 40px;
  background-color: #00000052;
}

.item-carousel-overlay-footer {
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  padding: 12px;
  background-color: #00000052;
}
</style>
