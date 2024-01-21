<template>
  <NSpace class="page" vertical :size="[24, 0]" :wrap-item="false">
    <!-- <NH2>Your posts</NH2> -->
    <!-- <NSpace align="center" :size="[12, 0]" :wrap-item="false">
      <NAvatar round object-fit="cover" :size="64" :src="userInfo.avatar" />
      <NSpace vertical :size="[0, 6]" :wrap-item="false">
        <NEllipsis style="max-width: 240px; font-size: 16px">{{ userInfo.nickname }}</NEllipsis>
      </NSpace>
    </NSpace> -->
    <!-- <NTabs class="custom-tabs" type="line" animated tab-style="marginTop:24px;">
      <template v-for="item in tabs">
        <NTabPane :name="item">
          <template #tab>{{ item }}</template>
        </NTabPane>
        </template>
    </NTabs> -->
    <NGrid cols="1100:4 600:2 400:1" :x-gap="24" :y-gap="24">
      <template v-if="list.length > 0">
        <template v-for="item in list">
          <NGridItem>
            <NCard class="card" :bordered="false" footer-style="background-color:#f5f5f5;padding:12px" @click="onPressItem(item)">
              <template #cover>
                <div class="card-cover">
                  <img class="card-cover-img" :src="item.url" />
                  <img class="card-cover-delete" src="@/assets/icon_delete.png" style="width: 24px; height: 24px" @click.stop.pervent="onPressDelete(item)" />
                </div>
              </template>
              <template #footer>
                <NSpace justify="space-between" align="center">
                  <NEllipsis style="max-width: 120px">{{ item.imageTitle }}</NEllipsis>
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
            <NText depth="3" style="color: #666; font-size: 12px">No data</NText>
          </NSpace>
        </NGridItem>
      </template>
    </NGrid>
    <NModal v-model:show="showModal" :mask-closable="false" preset="dialog" title="Tip">
      <NText> This action will permanently delete the fle. Are yousure you want to continue? </NText>
      <NSpace :size="[12, 0]" justify="end">
        <NButton type="primary" ghost color="#A45EFF" @click="onNegativeClick">Cancel</NButton>
        <NButton type="primary" color="#A45EFF" @click="onPositiveClick">Confirm</NButton>
      </NSpace>
    </NModal>
  </NSpace>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, watch, nextTick, computed } from 'vue';
import { NH2, NEllipsis, NText, NAvatar, NSpace, NCard, NTabs, NModal, NTabPane, NGrid, NIcon, NGridItem, NUl, NLi, useMessage, NButton } from 'naive-ui';
import { useUserStore } from '@/stores/user';
import { useRouter, useRoute } from 'vue-router';
import { Http } from '@/tools/http';
import moment from 'moment';

export default defineComponent({
  name: 'user-posts',
  components: {
    NH2,
    NEllipsis,
    NText,
    NAvatar,
    NSpace,
    NCard,
    NModal,
    NButton,
    NTabs,
    NTabPane,
    NGrid,
    NGridItem,
    NIcon,
    NUl,
    NLi,
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

    const tabs = ref(['posts']);
    const list = ref<any[]>([]);

    onMounted(() => {
      init();
    });
    const init = async () => {
      const resp = await http.get({
        url: 'https://client.emchub.ai/emchub/api/client/modelImage/selectByUser',
        data: { pageNo: 1, pageSize: 50 },
      });
      if (resp._result !== 0) return;
      list.value = resp.pageInfo?.list;
    };

    const onPressDelete = async (item: any) => {
      imageId.value = item.id;
      showModal.value = true;
    };

    const onPressItem = (item: any) => {
      router.push({ name: 'model-images', params: { id: item.id } });
    };

    return {
      userInfo,
      tabs,
      list,
      moment,
      onPressItem,
      onPressDelete,
      showModal,
      imageId,
      onNegativeClick() {
        imageId.value = '';
        showModal.value = false;
      },
      async onPositiveClick() {
        const resp = await http.post({
          url: 'https://client.emchub.ai/emchub/api/client/modelImage/deleteByUser',
          data: { id: imageId.value },
        });
        if (resp._result !== 0) return;
        const indexToRemove = list.value.findIndex((item) => item.id === imageId.value);
        if (indexToRemove === -1) return;
        list.value.splice(indexToRemove, 1);
        message.success('delete success');
        showModal.value = false;
      },
    };
  },
});
</script>
<style scoped>
.page {
  width: 100%;
  padding: 24px;
  border-radius: 20px;
  background-color: #fff;
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
