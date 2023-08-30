<template>
  <NSpace class="cloud" vertical align="center" justify="space-between" :size="[0, 0]" :wrap-item="false">
    <div class="cloud-banner" style="margin-bottom: 136px">
      <img class="cloud-banner-bg" :src="banner.background" />
      <NSpace class="cloud-banner-content" vertical align="center" justify="center" :size="[0, 24]">
        <NH1 class="cloud-h1" style="color: #fff; text-align: center">{{ banner.title }}</NH1>
        <NH3 class="cloud-h3" style="color: #ffffff; text-align: center">{{ banner.subtitle }}</NH3>
        <NButton class="cloud-btn" :focusable="false" color="#d9d9d9" @click="handleClick">{{ banner.button }}</NButton>
      </NSpace>
    </div>
    <NGrid cols="1 976:2" :x-gap="86" :y-gap="0" item-responsive style="margin-bottom: 136px">
      <NGridItem>
        <div class="cloud-card-title">
          <NH2 class="cloud-card-title-content">Service Hightlights</NH2>
          <div class="cloud-card-title-bg"></div>
        </div>
        <NSpace vertical justify="center" style="height: calc(100% - 68px)">
          <CardItem :item="cards[0]" :index="0" />
        </NSpace>
      </NGridItem>
      <NGridItem>
        <template v-for="(item, index) in cards">
          <template v-if="index > 0">
            <CardItem :item="item" :index="index" />
          </template>
        </template>
      </NGridItem>
    </NGrid>
    <NGrid cols="1 900:2" :x-gap="86" :y-gap="56" item-responsive style="margin-bottom: 136px">
      <NGridItem>
        <NSpace :wrap-item="false" align="center" style="height: 100%">
          <img class="cloud-cases-cover" :src="cases.cover" />
        </NSpace>
      </NGridItem>
      <NGridItem>
        <NSpace vertical :wrap-item="false" justify="center" style="height: 100%">
          <NH2 class="cloud-h2">{{ cases.title }}</NH2>
          <template v-for="item in cases.content">
            <NH3 class="cloud-h3">{{ item.title }}</NH3>
            <div class="cloud-cases-desc">{{ item.desc }}</div>
          </template>
        </NSpace>
      </NGridItem>
    </NGrid>
    <NGrid cols="1 1200:2" :x-gap="86" :y-gap="56" item-responsive style="margin-bottom: 136px">
      <NGridItem>
        <div class="cloud-table">
          <NSpace class="cloud-table-thead" justify="space-between" :wrap-item="false" :size="[0, 0]">
            <template v-for="item in table.thead">
              <div class="cloud-table-item" style="font-size: 20px">{{ item }}</div>
            </template>
          </NSpace>
          <template v-for="item in table.data">
            <NSpace justify="space-between" :wrap-item="false" :size="[0, 0]">
              <template v-for="items in item">
                <div class="cloud-table-item">{{ items }}</div>
              </template>
            </NSpace>
          </template>
        </div>
      </NGridItem>
      <NGridItem>
        <NSpace vertical justify="center" :wrap-item="false" style="height: 100%">
          <NH2 class="cloud-h2">{{ table.title }}</NH2>
          <NUl>
            <template v-for="item in table.content">
              <NLi class="cloud-table-li">{{ item }}</NLi>
            </template>
          </NUl>
        </NSpace>
      </NGridItem>
    </NGrid>
    <div class="cloud-footer">
      <img class="cloud-footer-bg" :src="footer.background" />
      <img class="cloud-footer-fly" :src="footer.backgroundFly" />
      <NSpace class="cloud-footer-content" vertical align="center" justify="center" :size="[0, 24]">
        <div style="font-size: 48px">{{ footer.title }}</div>
        <div>{{ footer.desc }}</div>
        <NButton class="cloud-btn" :focusable="false" color="#5424D9" @click="handleClick">{{ footer.button }}</NButton>
      </NSpace>
    </div>
    <PopupForm :showModal="showModal" @cancel="cancel" @info="getInfo" />
  </NSpace>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, watch, nextTick, computed } from 'vue';
import { NButton, NSpace, NCard, NModal, NGrid, NGridItem, NH1, NH2, NH3, NUl, NLi, useMessage } from 'naive-ui';
import { useIsMobile, useIsTablet, useIsSmallDesktop, useIsDesktop } from '@/composables/use-screen';
import { Http } from '@/tools/http';

import CardItem from './cloud-card-item.vue';
import PopupForm from './cloud-popup-form.vue';

type bannerItem = {
  background: string;
  button: string;
  subtitle: string;
  title: string;
};

export default defineComponent({
  name: 'cloud',
  components: {
    PopupForm,
    CardItem,
    NButton,
    NSpace,
    NCard,
    NModal,
    NGrid,
    NGridItem,
    NH1,
    NH2,
    NH3,
    NUl,
    NLi,
  },
  emits: ['isLoading'],
  setup(props, context) {
    const http = Http.getInstance();

    const message = useMessage();
    const showModal = ref(false);
    const banner = ref<bannerItem>({
      background: '',
      button: '',
      subtitle: '',
      title: '',
    });
    const cards = ref([]);
    const cases = ref({ content: [{ title: '', desc: '' }], cover: '', title: '' });
    const table = ref({ content: [], data: [], thead: [], title: '' });
    const footer = ref({ background: '', backgroundFly: '', button: '', title: '', desc: '' });

    onMounted(() => {
      nextTick(async () => {
        const resp = await http.get({ url: 'https://ma.emchub.ai/cloud.json' });
        ({ banner: banner.value, cards: cards.value, cases: cases.value, table: table.value, footer: footer.value } = resp);
      });
    });

    return {
      showModal,
      banner,
      cards,
      cases,
      table,
      footer,
      handleClick() {
        showModal.value = true;
      },
      cancel() {
        showModal.value = false;
      },
      async getInfo(value: any) {
        const { name, project, website, email, twitter, telegram, otherContact, requirement } = value?.model || {};
        const resp = await http.postJSON({
          url: 'https://client.emchub.ai/emchub/api/client/contactInfo/saveOne',
          data: {
            name: name,
            project: project,
            website: website,
            email: email,
            twitter: twitter,
            telegram: telegram,
            otherContact: otherContact,
            requirement: requirement,
          },
        });
        if (resp._result !== 0) return;
        message.success('success');
      },
    };
  },
});
</script>
<style scoped>
.cloud-h1 {
  font-size: 56px;
  line-height: 60px;
  font-weight: 700;
  margin: 0;
}
.cloud-h2 {
  font-size: 32px;
}
.cloud-h3 {
  margin: 0;
}
.cloud-banner {
  position: relative;
  width: 100%;
  height: 560px;
}
.cloud-banner-bg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cloud-banner-content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
}
.cloud-card-title {
  position: relative;
  width: 200px;
  height: 40px;
  line-height: 40px;
  margin-bottom: 28px;
}
.cloud-card-title-content {
  position: absolute;
  margin: 0;
  z-index: 2;
}
.cloud-card-title-bg {
  position: absolute;
  top: 5px;
  right: 0;
  width: 120px;
  height: 30px;
  background: linear-gradient(90deg, #d5e3fa 0%, #f7cdf5 54.69%, #fbd1da 100%);
  filter: blur(10px);
  z-index: 1;
}

.cloud-table {
  width: 100%;
  padding: 44px 36px;
  border: 1px solid #6c2cfd;
  box-shadow: 0px 4px 38px 0px #7f52fb1f;
  border-radius: 24px;
  box-sizing: border-box;
}

.cloud-table-item {
  flex: 1;
  line-height: 62px;
  border-bottom: 1px solid #6c2cfd;
}
.cloud-table-thead:nth-child(1) .cloud-table-item {
  border-bottom: 2px solid #6c2cfd;
}
.cloud-table-item:nth-last-child(1) {
  flex: 0.3;
  text-align: right;
}
.cloud-table-li {
  margin-bottom: 54px;
  line-height: 24px;
  color: #666;
}
.cloud-cases-cover {
  width: 100%;
}
.cloud-cases-desc {
  margin-bottom: 54px;
  line-height: 24px;
  color: #666;
}
.cloud-footer {
  position: relative;
  width: 90%;
  height: 352px;
  margin: 0 auto;
}
.cloud-footer-bg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
}
.cloud-footer-fly {
  position: absolute;
  top: -24px;
  right: -32px;
  width: 360px;
  z-index: 1;
}
.cloud-footer-content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 24px;
  color: #fff;
  border-radius: 10px;
  z-index: 2;
  box-sizing: border-box;
}
.cloud-btn {
  width: 240px;
  height: 60px;
  background-color: #ffffff;
  border: none;
  box-shadow: 0px 8px 10px -4px rgba(24, 39, 75, 0.08);
  border-radius: 16px;
  font-size: 16px;
  color: #7f52fb;
}
</style>
