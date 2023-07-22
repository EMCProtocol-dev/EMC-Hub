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
          <NUpload
            action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
            :headers="{
              'naive-info': 'hello!',
            }"
            :data="{
              'naive-data': 'cool! naive!',
            }"
          >
            <NButton>Click to upload</NButton>
          </NUpload>
        </template>
<<<<<<< HEAD
        <NSpace :wrap-item="false" :size="[24, 0]" :wrap="true">
          <template v-for="item in list">
            <div class="item">
              <NCarousel class="item-carousel" :autoplay="true">
                <template v-for="cover in item.covers">
                  <img class="item-cover" :src="cover" />
                </template>
              </NCarousel>
              <div class="item-body">
                <div class="item-body-row">
                  <NH4 style="margin-bottom: 0">{{ item.name }}</NH4>
                </div>
                <!-- <div class="item-body-row">
                  <NTag type="success"> {{ item.status }} </NTag>
                </div> -->
                <div class="item-body-row">
                  <template v-for="tag in item.tags">
                    <NTag :color="{ color: '#BBB', textColor: '#555', borderColor: '#555' }">
                      {{ tag }}
                    </NTag>
                  </template>
                </div>
              </div>
            </div>
=======
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
>>>>>>> 4a3626c (~)
          </template>
        </NSpace>
      </NCard>
    </NSpace>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch, onActivated, ComputedRef } from 'vue';
import { NPagination, NSpace, NUpload, NButton, NSpin, NCard, NCarousel, NTag, NH4 } from 'naive-ui';
<<<<<<< HEAD
import { useRoute } from 'vue-router';
import { useList } from '../../composables/use-list';
=======
import { useRoute, useRouter } from 'vue-router';
>>>>>>> 4a3626c (~)
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
    const list = ref<any[]>([]);
    const loading = ref(true);
    const pageNo = ref(1);
    const pageSize = ref(20);
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
        url: 'http://36.155.7.134:9080/mrchaiemc/queryModelInfoForMainView.do',
        data: { custId: '', bussData: { pageIndex: pageNo.value - 1, pageSize: pageSize.value } },
      });
      loading.value = false;

      const newList: any[] = resp.modelInfoList || [];
      const total = resp.totalNum || 0;
      const tagsProps = ['cateGory1', 'cateGory2', 'cateGory3'];

      newList.forEach((item) => {
        let status = item.modelStat;
        if (status === 'HIDDEN') return;
        let tags = [];
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
      if (route.meta.isBack) {
        updateList();
      } else {
        initList();
      }
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
<<<<<<< HEAD
=======
      onPressUpload() {
        router.push({ name: 'model-upload' });
      },
      onPressItem(item) {
        router.push({ name: 'model-detail', params: { id: item.id } });
      },
>>>>>>> 4a3626c (~)
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
<<<<<<< HEAD
.article {
  padding: 24px;
  display: flex;
  flex-direction: row;
}
.article-bg {
  background-image: url('../../assets/article-bg.jpg');
  background-size: 100%;
  background-repeat: no-repeat;
}

.article-wrapper {
  flex: 1;
  width: 0;
}
.article-header {
  font-weight: 700;
  font-size: 18px;
  color: var(--article-text);
  margin-bottom: 16px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.article-body {
  font-size: 14px;
  line-height: 1.6;
  color: var(--article-text);
  height: 8em;
  text-indent: 2em;
  overflow: hidden;
  margin-bottom: 16px;
}
.article-footer {
  display: flex;
  flex-direction: row;
  color: var(--article-text);
}
.article-cover {
  width: 200px;
  padding-top: 200px;
  position: relative;
  overflow: hiddent;
}
.article-cover-image {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.item {
  width: 240px;
  border: solid 1px #f1f1f1;
  border-radius: 8px;
  box-shadow: 1px 1px 6px 0 #ccc;
}

.item-carousel {
  width: 240px;
  height: calc(240px * 1.25);
}
.item-cover {
  width: 240px;
  height: calc(240px * 1.25);
}
.item-body {
  padding: 16px 16px;
}
.item-body-row {
  display: flex;
  align-items: center;
}

.item-body-row:not(:last-child) {
  margin-bottom: 8px;
}
=======
>>>>>>> 4a3626c (~)
</style>
