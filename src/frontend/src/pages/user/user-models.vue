<template>
  <NSpace class="page" vertical :size="[24, 0]" :wrap-item="false">
    <NH2>Your posts</NH2>
    <NSpace align="center" :size="[12, 0]" :wrap-item="false">
      <NAvatar round object-fit="cover" :size="64" :src="userInfo.avatar" />
      <NSpace vertical :size="[0, 6]" :wrap-item="false">
        <NEllipsis style="max-width: 240px; font-size: 16px">{{ userInfo.nickname }}</NEllipsis>
        <!-- <NText depth="3">{{ userNickname }}</NText> -->
      </NSpace>
    </NSpace>
    <NTabs class="custom-tabs" type="line" animated tab-style="marginTop:24px;">
      <template v-for="item in tabs">
        <NTabPane :name="item">
          <template #tab>{{ item }}</template>
          <NGrid cols="1100:4 600:2 400:1" :x-gap="24" :y-gap="24">
            <template v-if="list.length > 0">
              <template v-for="item in list">
                <NGridItem>
                  <NCard class="card" :bordered="false" footer-style="background-color:#f5f5f5;padding:12px">
                    <template #cover>
                      <ModelStatus :status="item.status" :covers="item.covers" :sn="item.sn" />
                    </template>
                    <template #footer>
                      <NSpace justify="space-between" align="center">
                        <NEllipsis style="max-width: 120px">{{ item.name }}</NEllipsis>
                        <NText style="color: #666; font-size: 12px">{{ moment(item.createTime).fromNow() }}</NText>
                      </NSpace>
                    </template>
                  </NCard>
                </NGridItem>
              </template>
            </template>
            <template v-else>
              <NGridItem span="4">
                <NSpace vertical align="center" justify="center" style="height: 400px">
                  <img src="@/assets/icon_empty.png" />
                  <NText style="color: #666; font-size: 12px">no data</NText>
                </NSpace>
              </NGridItem>
            </template>
          </NGrid>
        </NTabPane>
      </template>
    </NTabs>
  </NSpace>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, watch, nextTick, computed } from 'vue';
import { NH2, NEmpty, NEllipsis, NText, NAvatar, NSpace, NCard, NTabs, NModal, NTabPane, NGrid, NIcon, NGridItem, NUl, NLi, useMessage } from 'naive-ui';
import { useUserStore } from '@/stores/user';
import { useRouter, useRoute } from 'vue-router';
import { Http } from '@/tools/http';
import { Utils } from '@/tools/utils';
import moment from 'moment';
import ModelStatus from './model-status.vue';

export default defineComponent({
  name: 'user-models',
  components: {
    NH2,
    NEmpty,
    NEllipsis,
    NText,
    NAvatar,
    NSpace,
    NCard,
    NModal,
    NTabs,
    NTabPane,
    NGrid,
    NGridItem,
    NIcon,
    NUl,
    NLi,
    ModelStatus,
  },
  setup(props, context) {
    const http = Http.getInstance();
    const userStore = useUserStore();
    const router = useRouter();

    const { nickname, id } = userStore.user;
    const userInfo = ref(userStore.user);
    const message = useMessage();
    const showModal = ref(false);
    const imageId = ref('');

    const tabs = ref(['models']);
    const list = ref<any[]>([]);

    onMounted(() => {
      init();
    });
    const init = async () => {
      const resp = await http.get({
        url: '/emchub/api/client/modelInfo/queryListBySession',
        data: { pageNo: 1, pageSize: 50 },
      });

      if (resp._result !== 0) return;
      // list.value = resp.pageInfo?.list;
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
          createTime: item.createTime,
        });
      });

      console.log(list.value);
    };
    const onPressDelete = async (item: any) => {
      imageId.value = item.id;
      showModal.value = true;
    };

    return {
      userInfo,
      tabs,
      list,
      moment,
      onPressDelete,
      showModal,
      imageId,
    };
  },
});
</script>
<style scoped>
.page {
  width: 100%;
}
.card {
  border-radius: 6px;
  overflow: hidden;
}
.card-cover {
  width: 100%;
  height: 400px;
}
.card-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  transition: all 0.2s;
  cursor: pointer;
}

.card-cover:hover .card-cover-img {
  transform: scale(1.2);
}
.card-cover-delete {
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
}
</style>
