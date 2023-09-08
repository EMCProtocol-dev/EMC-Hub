<template>
  <NSpace class="page" vertical :size="[24, 0]" :wrap-item="false">
    <NH2>Your posts</NH2>
    <NSpace align="center" :size="[12, 0]" :wrap-item="false">
      <NAvatar round :size="64" src="">123</NAvatar>
      <NSpace vertical :size="[0, 6]" :wrap-item="false">
        <NText depth="1" style="font-size: 16px">{{ userNickname }}</NText>
        <NText depth="3">{{ userNickname }}</NText>
      </NSpace>
    </NSpace>
    <NTabs class="custom-tabs" type="line" animated tab-style="marginTop:24px;">
      <template v-for="item in tabs">
        <NTabPane :name="item">
          <template #tab>{{ item }}</template>
          <NGrid :cols="4" :x-gap="24" :y-gap="24">
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
                      <NText>{{ item.imageTitle }}</NText>
                      <NText style="color: #666; font-size: 12px">{{ moment(item.createTime).fromNow() }}</NText>
                    </NSpace>
                  </template>
                </NCard>
              </NGridItem>
            </template>
          </NGrid>
          <NModal v-model:show="showModal" :mask-closable="false" preset="dialog" title="确认" content="你确认" positive-text="确认" negative-text="算了" @positive-click="onPositiveClick" @negative-click="onNegativeClick" />
        </NTabPane>
      </template>
    </NTabs>
  </NSpace>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, watch, nextTick, computed } from 'vue';
import { NH2, NText, NAvatar, NSpace, NCard, NTabs, NModal, NTabPane, NGrid, NIcon, NGridItem, NUl, NLi, useMessage } from 'naive-ui';
import { useUserStore } from '@/stores/user';
import { useRouter, useRoute } from 'vue-router';
import { Http } from '@/tools/http';
import moment from 'moment';

export default defineComponent({
  name: 'user-posts',
  components: {
    NH2,
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
  },
  setup(props, context) {
    const http = Http.getInstance();
    const userStore = useUserStore();
    const router = useRouter();

    const { nickname, id } = userStore.user;
    const userNickname = ref(nickname);
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
      userNickname,
      tabs,
      list,
      moment,
      onPressItem,
      onPressDelete,
      showModal,
      imageId,
      onNegativeClick() {
        imageId.value = '';
        message.success('Cancel');
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
