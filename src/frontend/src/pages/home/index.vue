<template>
  <div class="page">
    <HomeCarouse />
    <NSpace class="section" :vertical="true">
      <NH2 class="section-title">{{ cardList.title }}</NH2>
      <NH4 class="section-subtitle">{{ cardList.subtitle }}</NH4>
      <NGrid cols="1 800:3" :x-gap="24" :y-gap="24" item-responsive>
        <template v-for="(item, index) in cardList.data">
          <NGridItem>
            <ProjectItem :item="item" />
          </NGridItem>
        </template>
      </NGrid>
    </NSpace>

    <NSpace class="section" :vertical="true" align="center">
      <NH2 class="section-title">{{ worksList.title }}</NH2>
      <NH4 class="section-subtitle">{{ worksList.subtitle }}</NH4>
      <template v-for="(item, index) in worksList.data">
        <SetupItem :item="item" :index="index" />
      </template>
    </NSpace>
    <div class="footer">
      <div class="footer-left-decoration"></div>
      <NSpace class="footer-center" :vertical="true" align="center" :wrap="true">
        <div class="footer-title">{{ footer.title }}</div>
        <div class="footer-description">{{ footer.description }}</div>
        <RouterLink :to="{ path: '/models' }">
          <NButton class="warn-button" type="warning">{{ footer.button }}</NButton>
        </RouterLink>
      </NSpace>
      <div class="footer-right-decoration"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed, onUnmounted, defineComponent, nextTick } from 'vue';
import { NCarousel, NPopover, NButton, NSpace, NSpin, NGrid, NGridItem, NCard, NH2, NH4, NA } from 'naive-ui';
import { RouterLink } from 'vue-router';
import { Utils } from '@/tools/utils';

import ProjectItem from './project-item.vue';
import SetupItem from './setup-item.vue';
import HomeCarouse from './home-carouse.vue';

import setup1 from '@/assets/image-setup1.png';
import setup2 from '@/assets/image-setup2.png';
import setup3 from '@/assets/image-setup3.png';
import setup4 from '@/assets/image-setup4.png';
import cover1 from '@/assets/image-card-cover1.png';
import cover2 from '@/assets/image-card-cover2.png';
import cover3 from '@/assets/image-card-cover3.png';

export default defineComponent({
  components: {
    HomeCarouse,
    ProjectItem,
    SetupItem,
    RouterLink,
    NCarousel,
    NPopover,
    NButton,
    NSpace,
    NSpin,
    NGrid,
    NGridItem,
    NCard,
    NH2,
    NH4,
    NA,
  },

  setup() {
    const cardList = ref({
      title: 'A better way to experiment AI in Web3',
      subtitle: 'Generate any image you want and unleash your imagination',
      data: [
        {
          cover: cover1,
          name: 'Stable Diffusion',
          description: 'Creators can flexibly conduct AI model training and inference, unleashing their creative potential.',
          button: 'Try',
          link: 'https://6tq33-2iaaa-aaaap-qbhpa-cai.icp0.io/#/home',
        },
        {
          cover: cover2,
          name: 'LLaMa',
          description: 'Developers can use LLMs to create exciting language generation and text applications.',
          button: 'Coming soon',
          link: 'javascript:void(0)',
        },
        {
          cover: cover3,
          name: 'MusicGen',
          description: 'Musicians and music enthusiasts can unlock a world of creativity and innovation through the AI Music Model.',
          button: 'Coming soon',
          link: 'javascript:void(0)',
        },
      ],
    });

    const worksList = ref({
      title: 'How it works',
      subtitle: 'Generate AI image in 4 simple steps',
      data: [
        {
          title: 'Select a model',
          content: `
            Select the model you want to use. You can discover a wide variety of categories: characters, animations, clothing, cars, buildings, and more. There are also different model types available: checkpoint, Lora, and others. 
            `,
          image: setup1,
        },
        {
          title: 'Choose a node',
          content: `
            Choose the appropriate node based on your specific needs and consider factors such as price, location, efficiency, stability, and security on the EMC computing power network.
            `,
          image: setup2,
        },
        {
          title: 'Input the prompts',
          content: `
            The purpose of prompts is to guide AIGC models to create images that align with your expectations. You can learn and utilize better prompts techniques in the EMC Hub community.
            `,
          image: setup3,
        },
        {
          title: 'Generate your image',
          content: `
            By continuously trying different prompts, you can explore various styles and themes of images, resulting in more personalized, diverse, and tailored artistic outcomes that meet your individual or business needs.
            `,
          image: setup4,
        },
      ],
    });

    const footer = ref({
      title: 'Embark on your Al journey in the Web3 world now!',
      description: "Upload your own Al model, and in the future, you can manage the model's revenue rights and explore various unique features through NFTs.",
      button: 'Browse Models',
    });

    return { cardList, worksList, footer };
  },
});
</script>

<style scoped>
.section {
  margin-top: 88px;
}

.section-title {
  font-size: 32px;
  font-weight: 500;
  line-height: 44px;
  text-align: center;
}

.section-subtitle {
  margin-bottom: 32px;
  text-align: center;
}

.footer {
  position: relative;
  width: 100%;
  margin: 0 auto;
  padding: 64px 24px;
  border-radius: 20px;
  background-color: #6c2cfd;
  box-sizing: border-box;
  overflow: hidden;
}

.footer-center {
  position: relative;
  width: 100%;
  margin: 0 auto;
  z-index: 2;
}

.footer-title {
  width: 100%;
  color: #fff;
  font-size: 32px;
  font-weight: 500;
  line-height: 44px;
  text-align: center;
}

.footer-description {
  padding: 16px 0px 32px;
  color: #fff;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
}

.warn-button {
  height: 48px;
  padding: 0 72px;
  color: #fff;
  border-radius: 10px;
  border: 1px solid #c5acff;
  background-color: #5e5ce6;
  box-shadow: 0px 8px 8px -4px rgba(24, 39, 75, 0.08), 0px 4px 6px -4px rgba(24, 39, 75, 0.12);
}

.footer-left-decoration {
  position: absolute;
  top: -144px;
  left: -176px;
  width: 264px;
  height: 220px;
  border-radius: 266px;
  border: 8px solid #f1f5f920;
  z-index: 1;
}

.footer-right-decoration {
  position: absolute;
  bottom: -156px;
  right: -180px;
  width: 280px;
  height: 228px;
  border-radius: 280px;
  border: 8px solid #fff;
  z-index: 1;
}
</style>
