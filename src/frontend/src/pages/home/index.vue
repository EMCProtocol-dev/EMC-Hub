<template>
  <div class="page">
    <NSpace align="center" style="position: relative; height: 640px">
      <NSpace class="carouse" :vertical="true">
        <NH2 class="carouse-title">Fully <span class="carouse-title-span">Decentralized</span> Al Application</NH2>
        <NH4 class="carouse-content">With the help of idle GPU computing power distributed on EdgeMatrix worldwide, you can generate the AI images you desire from anywhere at any time. It is a fully decentralized AI platform. </NH4>
        <RouterLink :to="{ path: '/models' }">
          <NButton class="warn-button" type="warning"> Generate Your First Al lmage on Chain </NButton>
        </RouterLink>
        <img class="carouse-background" src="@/assets/home-background.png" />
        <img class="carouse-background-image" src="@/assets/home-background-image.png" />
      </NSpace>
    </NSpace>
    <NSpace class="section" :vertical="true" align="center">
      <NH2 class="section-title">{{ cardList.title }}</NH2>
      <NH4 class="section-subtitle">{{ cardList.subtitle }}</NH4>
      <NSpace align="center">
        <template v-for="(item, index) in cardList.data">
          <NCard class="section-card" :title="item.name">
            <template #cover>
              <img class="section-card-cover" :src="item.cover" />
            </template>
            <div class="section-card-description">{{ item.description }}</div>
            <template #footer>
              <NSpace justify="center" align="center">
                <NA :href="item.link" target="_blank" style="text-decoration: none; color: inherit">
                  <NButton class="section-card-button" type="primary" ghost color="#6C2CFD">
                    {{ item.button }}
                  </NButton>
                </NA>
              </NSpace>
            </template>
          </NCard>
        </template>
      </NSpace>
    </NSpace>
    <NSpace class="section" :vertical="true" align="center">
      <NH2 class="section-title">{{ worksList.title }}</NH2>
      <NH4 class="section-subtitle">{{ worksList.subtitle }}</NH4>
      <template v-for="(item, index) in worksList.data">
        <NSpace class="section-item" :wrap="false" justify="space-between" :size="[78, 0]" :style="{ 'flex-flow': index % 2 != 1 ? 'row' : 'row-reverse' }">
          <NCard class="section-item-content" :title="index + 1 + '. ' + item.title" :bordered="false" header-style="font-size:28px;font-weight:700">
            <span class="section-item-pre" v-html="item.content"></span>
          </NCard>
          <NSpace class="section-item-side" :wrap-item="false" justify="center">
            <img class="section-item-side-image" :src="item.image" />
          </NSpace>
        </NSpace>
      </template>
    </NSpace>
    <div class="footer">
      <div class="footer-left-decoration"></div>
      <NSpace class="footer-center" :vertical="true" align="center">
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
import { NCarousel, NPopover, NButton, NSpace, NSpin, NCard, NH2, NH4, NA } from 'naive-ui';
import { RouterLink } from 'vue-router';
import { Utils } from '@/tools/utils';

import setup1 from '@/assets/image-setup1.png';
import setup2 from '@/assets/image-setup2.png';
import setup3 from '@/assets/image-setup3.png';
import setup4 from '@/assets/image-setup4.png';
import cover1 from '@/assets/image-card-cover1.png';
import cover2 from '@/assets/image-card-cover2.png';
import cover3 from '@/assets/image-card-cover3.png';

export default defineComponent({
  components: {
    RouterLink,
    NCarousel,
    NPopover,
    NButton,
    NSpace,
    NSpin,
    NCard,
    NH2,
    NH4,
    NA,
  },

  setup() {
    // const carouselList = ref(
    //    {
    //       title: `Fully Decentralized Al Application`,
    //       content: 'With the help of idle GPU computing power distributed onEdgeMatrix worldwide, you can generate the Al images youdesire from anywhere at any time. It is a fully decentralized Alapplication.',
    //       button: 'Generate Your First Al lmage on Chain',
    //       data: [
    //          { background: '' }
    //       ]
    //    }
    // )

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
      button: 'Browser Models',
    });

    return { cardList, worksList, footer };
  },
});
</script>

<style scoped>
.carouse {
  width: 552px;
}

.carouse-background {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 100%;
}
.carouse-background-image {
  position: absolute;
  top: 102px;
  right: 0px;
  width: 560px;
  height: 546px;
}

.carouse-title {
  font-size: 52px;
  font-weight: 700;
  line-height: 72px;
  letter-spacing: 2.6px;
}

.carouse-title-span {
  background: linear-gradient(90deg, #da22ff 0%, #9733ee 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.carouse-content {
  color: #7b7e86;
  font-size: 18px;
  font-weight: 400;
  line-height: 26px;
  padding-right: 44px;
  margin: 32px 0 64px;
}

.section {
  margin-top: 88px;
}

.section-title {
  font-size: 32px;
  font-weight: 500;
  line-height: 32px;
}

.section-subtitle {
  margin-bottom: 44px;
}

.section-card {
  width: 456px;
  height: 520px;
  padding: 2px;
  border-radius: 12px;
  border: 1px solid #e5e4e9;
}

.section-card-cover {
  width: 100%;
  height: 288px;
  object-fit: cover;
  border-radius: 12px 12px 0px 0px;
  background-color: #d9d9d9;
}

.section-card-button {
  min-width: 120px;
  margin: 0 auto;
}

.section-item {
  width: 100%;
  margin-bottom: 120px;
}

/* .section-item:nth-child(odd) {
   flex-flow: row-reverse;
} */

.section-item-content {
  width: 618px;
  background-color: transparent;
}

.section-item-pre {
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
  white-space: pre-line;
}

.section-item-side {
  flex: 1;
  width: 696px;
  height: 420px;
  padding: 20px;
  border-radius: 20px;
  border: 1px solid #e5e4e9;
  box-sizing: border-box;
}

.section-item-side-image {
  border-radius: 10px;
  width: 100%;
  object-fit: cover;
}

.footer {
  position: relative;
  width: 100%;
  padding: 64px 0;
  border-radius: 20px;
  background-color: #6c2cfd;
  overflow: hidden;
}

.footer-center {
  width: 800px;
  margin: 0 auto;
}

.footer-title {
  color: #fff;
  font-size: 32px;
  font-weight: 500;
  line-height: 32px;
}

.footer-description {
  padding: 16px 80px 32px;
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
}

.footer-right-decoration {
  position: absolute;
  bottom: -156px;
  right: -180px;
  width: 280px;
  height: 228px;
  border-radius: 280px;
  border: 8px solid #fff;
}
</style>
