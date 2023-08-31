<template>
  <div class="page">
    <div>
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
        <NButton icon-placement="right" style="background: linear-gradient(90deg, #4e74fc 0%, #bb3ef7 100%); color: #fff" @click="onPressAdd">
          Add Post
          <template #icon>
            <NIcon>
              <IconAdd color="#fff" />
            </NIcon>
          </template>
        </NButton>
      </NSpace>
      <NGrid cols="2 600:3 800:4 1000:5" :x-gap="24" :y-gap="24" item-responsive>
        <template v-for="item in list">
          <NGridItem>
            <GalleryItem :item="item" @press="onPressImages" />
          </NGridItem>
        </template>
      </NGrid>
    </div>
    <GalleryUpload :showModal="showModal" :id="modelId" :modelHashCode="modelHashCode" :modelName="modelName" @cancel="cancel" @info="getInfo" />
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { NCard, NH2, NH3, NSpace, NSpin, NTag, NCarousel, NDescriptions, NDescriptionsItem, NButton, NIcon, NModal, NGrid, NGridItem, useMessage, NPopselect } from 'naive-ui';
import { AddSharp as IconAdd, ChevronDownSharp as IconDown } from '@vicons/ionicons5';
import GalleryItem from './gallery-item.vue';
import GalleryUpload from './gallery-upload.vue';

export default defineComponent({
  name: 'node-detail',
  props: {
    modelHashCode: { type: String, default: '' },
    modelName: { type: String, default: '' },
    modelId: { type: String, default: '' },
  },
  components: {
    NCard,
    NH2,
    NH3,
    NSpace,
    NSpin,
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
    IconAdd,
    IconDown,
    GalleryUpload,
    GalleryItem,
  },
  setup() {
    const route = useRoute();
    const message = useMessage();
    const router = useRouter();

    const selectValue = ref('NEWEST');
    const showModal = ref(false);
    const list = ref<any[]>([
      {
        id: '03f0cae2-e8f5-4d68-888a-beaad9fcc7f3',
        covers: [
          'https://res.emchub.ai/emcbucket/2023/07/24/%5B1690211014903%5D00029-3331471849-masterpiece%2Cbest%20quality%2Cupper%20body%2C1girl%2Csmall%20breasts%2Ccollared_shirt%20and%20flared_skirt%20as%20material2%2Cpink%20theme%2Cbook%20cover%20_%28med.png',
        ],
        name: 'Animix Reality',
        tags: [],
        status: 'PUBLISH',
      },
    ]);

    return {
      list,
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
      getInfo(value: any) {},
      onPressImages(val: any) {
        router.push({ name: 'model-images' });
        // params: { id: item.id }
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
