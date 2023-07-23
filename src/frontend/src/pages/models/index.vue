<template>
  <div class="page">
    <NSpace vertical :size="[0, 24]" :wrap-item="false">
      <NSpace class="banners" align="center" justify="space-between" :wrap-item="false" :size="[24, 0]">
        <NCard :bordered="false" class="banner-cell" style="width: calc(40% - 24px)" content-style="padding:0">
          <ArticleItem :item="article" class="article-bg" style="--article-text: #ffffff" />
        </NCard>
        <NCard :bordered="false" class="banner-cell" content-style="padding:0">
          <ArticleItem :item="article2" style="--article-text: #000000" />
        </NCard>
      </NSpace>
      <NCard :bordered="false">
        <template #header>
          <div>
            <span>Recommend models</span>
            <div style="font-size: 14px; font-weight: 400">Total {{ itemCount }}</div>
          </div>
        </template>
        <template #header-extra>
          <NButton type="primary" ghost strong @click="onPressUpload">Click to upload</NButton>
        </template>
        <NSpace :wrap-item="false" :size="[24, 0]" :wrap="true" style="margin-bottom: -24px">
          <template v-if="loading">
            <NSpace align="center" justify="center" style="width: 100%; height: 400px">
              <NSpin />
            </NSpace>
          </template>
          <template v-else>
            <template v-for="item in list">
              <ModelItem :item="item" @press="onPressItem" />
            </template>
          </template>
        </NSpace>
      </NCard>
    </NSpace>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch, onActivated, ComputedRef } from 'vue';
import { NPagination, NSpace, NUpload, NButton, NSpin, NCard, NCarousel, NTag, NH4 } from 'naive-ui';
import { useRoute, useRouter } from 'vue-router';
import { Http } from '../../tools/http';
import ArticleItem from './article-item.vue';
import ModelItem from './model-item.vue';
const ArticleDefaultCover = require('../../assets/article-default-cover.png');

export default defineComponent({
  name: 'nodes',
  components: { NPagination, NSpace, NUpload, NButton, NSpin, NCard, NCarousel, NTag, NH4, ArticleItem, ModelItem },
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
    const route = useRoute();
    const router = useRouter();
    const list = ref<any[]>([]);
    const loading = ref(true);
    const pageNo = ref(1);
    const pageSize = ref(80);
    const queryParams = ref<any>({});
    const pageCount = ref(1);
    const itemCount = ref(0);
    const article = ref({
      title: "EMC Hub will soon launch Lora NFT, the world's first AI model NFT",
      content: `EMC Hub is about to release Lora NFT, which is the industry's first AI model NFT. This innovation represents EMC Hub's innovation in the AI+web3 field. Lora NFT will use AI technology to bring more possibilities and innovations to the NFT market, creating more revenue and value for AI model creators and collectors. Stay tuned for the release of Lora NFT!`,
    });
    const article2 = ref({
      cover: ArticleDefaultCover,
      title: 'EMC Genesis AI Computing Power RWA-NFT',
      content: `EMC AI Computing Power RWA-NFT is the world's first AI computing power Real-World Asset Non-Fungible Token (RWA-NFT). The Genesis edition, limited to 80 units, is now available for sale. The introduction of EMC's AI computing power RWA-NFT represents the introduction of a new Web3 asset in the era of AI. This new form of asset will greatly expand the value of NFTs, anchored to the real-world asset of computing power, specifically GPU hardware and the various products and services it generates. The aggregated rights of EMC's AI computing power RWA-NFT will include actual GPU computing power usage rights, earnings from correspondi`,
    });
    const http = Http.getInstance();
    const updateList = async () => {
      loading.value = true;
      const resp = await http.postJSON({
        url: 'https://api.emchub.ai/mrchaiemc/queryModelInfoForMainView.do',
        data: { custId: '1690226134332', bussData: { pageIndex: pageNo.value - 1, pageSize: pageSize.value } },
      });
      loading.value = false;

      const newList: any[] = resp.modelInfoList || [];
      const total = resp.totalNum || 0;
      const tagsProps = ['cateGory1', 'cateGory2', 'cateGory3'];
      list.value = [];
      newList.forEach((item) => {
        let status = item.modelStat;
        // if (status === 'HIDDEN') return;
        let tags: any[] = [];
        tagsProps.forEach((p) => {
          const vals = item[p] ? item[p].split(',') : [];
          if (vals.length > 0) {
            tags = tags.concat(vals);
          }
        });
        list.value.push({
          id: item.modelId,
          covers: item.sampleImgFileLinks ? item.sampleImgFileLinks.split(',') : [],
          name: item.modelName,
          tags: tags,
          status: status,
        });
      });
      itemCount.value = total;
      pageCount.value = Math.ceil(total / pageSize.value);
    };

    const initList = async () => {
      pageNo.value = 1;
      return updateList();
    };

    onActivated(() => {
      // if (route.meta.isBack) {
      //   updateList();
      // } else {
      //   initList();
      // }
      initList();
    });

    return {
      list,
      loading,
      pageNo,
      pageSize,
      queryParams,
      pageCount,
      itemCount,
      article,
      article2,
      initList,
      updateList,
      onPressUpload() {
        router.push({ name: 'model-upload' });
      },
      onPressItem(item: any) {
        router.push({ name: 'model-detail', params: { id: item.id } });
      },
    };
  },
});
</script>

<style scoped>
.page {
}
.banner-cell {
  width: 60%;
  /* background-color: var(--fg-color); */
  /* border-radius: var(--card-radius); */
  /* border-radius: 16px; */
}
</style>
