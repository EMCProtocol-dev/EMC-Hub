<template>
  <div class="page">
    <NCard :bordered="false" content-style="padding:0">
      <NSpace class="layout" :wrap-item="false" :size="[0, 0]">
        <template v-if="!ready">
          <NSpace class="layout-loading" align="center" justify="center">
            <NSpin />
          </NSpace>
        </template>
        <template v-else>
          <div class="layout-left">
            <div class="carousel-wrap">
              <NCarousel class="carousel" :autoplay="true">
                <template v-for="cover in covers">
                  <img class="cover" :src="cover" />
                </template>
              </NCarousel>
            </div>
          </div>
          <div class="layout-right" style="padding: 32px">
            <div class="header">
              <div class="header-row">
                <div class="name">{{ name }}</div>
              </div>
              <div class="tags">
                <template v-for="tag in tags">
                  <NTag round size="small" :bordered="false" :color="{ color: '#8f7df8', textColor: '#f1f1f1' }">
                    {{ tag }}
                  </NTag>
                </template>
              </div>
            </div>
            <div class="body">
              <div class="with">
                <div class="with-label">Version</div>
                <div class="with-value">v{{ version }}</div>
              </div>
              <div class="with">
                <div class="with-label">Hash Code</div>
                <div class="with-value">{{ modelHashCode }}</div>
              </div>
              <div class="with">
                <div class="with-label">Seed</div>
                <div class="with-value">{{ seed }}</div>
              </div>
              <div class="with with__column">
                <div class="with-label">Positive Prompt</div>
                <div class="with-value with-value__area">{{ positivePrompt }}</div>
              </div>
              <div class="with with__column">
                <div class="with-label">Negative Prompt</div>
                <div class="with-value with-value__area">{{ negativePrompt }}</div>
              </div>
            </div>
            <NButton type="primary" size="large" strong @click="onPressArchive" style="margin-top: 12px">
              <template #icon>
                <NIcon><IconDownload /></NIcon>
              </template>
              Download model package
            </NButton>
          </div>
        </template>
      </NSpace>
    </NCard>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  NCard,
  NSpace,
  NSpin,
  NTag,
  NCarousel,
  NDescriptions,
  NDescriptionsItem,
  NButton,
  NIcon,
  useMessage,
} from 'naive-ui';
import { useUserStore } from '@/stores/user';
import { Http } from '@/tools/http';
import { DownloadSharp as IconDownload } from '@vicons/ionicons5';

export default defineComponent({
  components: {
    NCard,
    NSpace,
    NSpin,
    NTag,
    NCarousel,
    NDescriptions,
    NDescriptionsItem,
    NButton,
    NIcon,
    IconDownload,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const message = useMessage();
    const modelId = ref(route.params.id);
    const ready = ref(false);
    const name = ref('');
    const covers = ref<string[]>([]);
    const archive = ref('');
    const version = ref('');
    const tags = ref<string[]>([]);
    const seed = ref('');
    const modelHashCode = ref('');
    const positivePrompt = ref('');
    const negativePrompt = ref('');

    const http = Http.getInstance();
    const useStore = useUserStore();
    const init = async () => {
      const resp = await http.postJSON({
        url: 'https://api.emchub.ai/mrchaiemc/queryModelDetailInfo.do',
        data: { custId: useStore.user.id, bussData: { modelId: modelId.value } },
      });
      const data = resp.bussData || { sampleImgFileLinks: '' };

      let tagsProps = ['cateGory1', 'cateGory2', 'cateGory3'];
      let _tags: string[] = [];
      tagsProps.forEach((p) => {
        const vals = data[p] ? data[p].split(',') : [];
        if (vals.length > 0) {
          _tags = _tags.concat(vals);
        }
      });
      let _covers: string[] = data.sampleImgFileLinks.split(',');
      name.value = data.modelName;
      covers.value = _covers;
      version.value = data.version || '1';
      tags.value = _tags;
      archive.value = data.modelFileLinks;
      seed.value = data.seed || '-';
      modelHashCode.value = data.modelHashCode || '-';
      positivePrompt.value = data.positivePromts || '-';
      negativePrompt.value = data.negativePrompt || '-';
      ready.value = true;
    };

    onMounted(() => {
      init();
    });

    return {
      ready,
      covers,
      name,
      version,
      tags,
      archive,
      seed,
      modelHashCode,
      positivePrompt,
      negativePrompt,
      onPressArchive() {
        if (!archive.value) {
          message.error('Sorry, The package disappears');
        }
        window.open(archive.value);
      },
    };
  },
});
</script>

<style scoped>
.layout {
}
.layout-loading {
  width: 100%;
  height: 600px;
}

.layout-left,
.layout-right {
  width: 50%;
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
  width: 88px;
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
