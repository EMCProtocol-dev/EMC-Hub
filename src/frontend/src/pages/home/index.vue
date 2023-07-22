<template>
   <div class="page">
      <NSpace align="center" style="position: relative;height: 600px;">
         <NSpace class="carouse" :vertical="true">
            <NH2 class="carouse-title">Fully <span class="carouse-title-span">Decentralized</span> Al Application</NH2>
            <NH4 class="carouse-content">With the help of idle GPU computing power distributed onEdgeMatrix worldwide, you
               can generate the Al images youdesire from anywhere at any time. It is a fully decentralized Alapplication.
            </NH4>
            <NButton class="warn-button" type="warning">
               Generate Your First Al lmage on Chain
            </NButton>
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
                  <div class="section-card-description"> {{ item.description }} </div>
                  <template #footer>
                     <NSpace justify="center" align="center">
                        <NA :href="item.link" target="_blank" style="text-decoration: none; color: inherit">
                           <NButton class=" section-card-button" type="primary" ghost color="#6C2CFD">
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
         <NH2 class=" section-title">{{ worksList.title }}</NH2>
         <NH4 class="section-subtitle">{{ worksList.subtitle }}</NH4>
         <template v-for="(item, index) in worksList.data">
            <NSpace class="section-item" :wrap="false" justify="space-between" :size="[78, 0]"
               :style="{ 'flex-flow': index % 2 != 1 ? 'row' : 'row-reverse' }">
               <NCard class="section-item-content" :title="index + 1 + '. ' + item.title" :bordered="false">
                  <pre class="section-item-pre" v-html="item.content"></pre>
               </NCard>
               <NSpace class="section-item-side" :wrap-item="false" justify="center">
                  <img class="section-item-side-image" :src="item.image" />
               </NSpace>
            </NSpace>
         </template>
      </NSpace>
      <div class="footer">
         <div class=" footer-left-decoration"></div>
         <NSpace class="footer-center" :vertical="true" align="center">
            <div class="footer-title">{{ footer.title }} </div>
            <div class="footer-description">{{ footer.description }}</div>
            <NButton class="warn-button">{{ footer.button }}</NButton>
         </NSpace>
         <div class="footer-right-decoration"></div>
      </div>
   </div>
</template>

<script lang="ts">
import {
   ref,
   onMounted,
   computed,
   onUnmounted,
   defineComponent,
   nextTick,
} from "vue";
import { NCarousel, NPopover, NButton, NSpace, NSpin, NCard, NH2, NH4, NA } from "naive-ui";
import { RouterLink } from 'vue-router';
import { Utils } from "@/tools/utils";

import setup1 from "@/assets/image-setup1.png";
import setup2 from "@/assets/image-setup2.png";
import setup3 from "@/assets/image-setup3.png";
import setup4 from "@/assets/image-setup4.png";
import cover1 from "@/assets/image-card-cover1.png";
import cover2 from "@/assets/image-card-cover2.png";
import cover3 from "@/assets/image-card-cover3.png";





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
         title: 'A Better way to experiment with AI in Web3',
         subtitle: 'Generate any image you want and unleash your imagination',
         data: [
            {
               cover: cover1,
               name: 'Stable Diffusion',
               description: 'Do consectetur proident proident id eiusmod deserunt consequat',
               button: 'Try',
               link: 'https://www.naiveui.com/zh-CN/light/components/card',
            }, {
               cover: cover2,
               name: 'LLaMa',
               description: 'Adipisicing labore ea nulla dolor et adad quis proident laboris',
               button: 'Coming soon',
               link: 'https://www.naiveui.com/zh-CN/light/components/card',
            }, {
               cover: cover3,
               name: 'Feature',
               description: 'Consequat dolor exercitation minim eaaliquip officia et',
               button: 'Coming soon',
               link: 'https://www.naiveui.com/zh-CN/light/components/card',
            }
         ]
      })

      const worksList = ref({
         title: 'How it works',
         subtitle: 'Grnerate AI image in a few simple steps',
         data: [{
            title: 'Select a model',
            content: `
Select the modell you wrant to use . You can a custommodel or any of the 60,000. 
Transformers, Diffusers orSentence Transformers models aailable on the Hub for NLP.
computer vislon, or speech tarsks.
            `,
            image: setup1,
         }, {
            title: 'Choose a node',
            content: `
Plck your cloud and select a region close to your data incompliance with your 
requirements (e.g. Europe NorthAmerica or Asin Pacific).
            `,
            image: setup2,
         }, {
            title: 'Input the prompts',
            content: `
Protected Endpoints are accessible from the Internet andrequire valid authentication.

Public Endpoints are accessible from the internet and do notrequire authentication.

Private Endpoints are only available through an intra-regionsecured AWS or Azure 
PrivateLink direct connection to a VPCand are not accessible from the internet.
            `,
            image: setup3,
         }, {
            title: 'Generate your image',
            content: `
Click create and your new endpoint is ready in a couple ofminutes. 
Dofine autoscaling. accass logs and monitoring. setcustom metrics routes, 
manage endpoints programmaticallywith APICLl, and 
rollback models - all super easily.
            `,
            image: setup4,
         }]
      })

      const footer = ref({
         title: "Embark on your AI journey in the Web3 world now!",
         description: "Upload your own Al model, and in the future, you can manage the model's revenue rights and explore various unique features through NFTs.",
         button: "Browser Models",
         link: '',
      })

      return { cardList, worksList, footer, };
   },
});
</script>

<style scoped>
.page {}

.carouse {
   width: 552px;
}

.carouse-background {
   position: absolute;
   top: -132px;
   right: -96px;
   width: 960px;
   height: 960px;
}

.carouse-background-image {
   position: absolute;
   top: 20px;
   right: 0px;
   width: 600px;
   height: 580px;
}

.carouse-title {
   font-size: 52px;
   font-weight: 700;
   line-height: 72px;
   letter-spacing: 2.6px;
}

.carouse-title-span {
   background: linear-gradient(90deg, #DA22FF 0%, #9733EE 100%);
   background-clip: text;
   -webkit-background-clip: text;
   -webkit-text-fill-color: transparent;
}

.carouse-content {
   color: #7B7E86;
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
   border: 1px solid #E5E4E9;
}

.section-card-cover {
   width: 100%;
   height: 288px;
   object-fit: cover;
   border-radius: 12px 12px 0px 0px;
   background-color: #D9D9D9;
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
   border: 1px solid #E5E4E9;
   box-sizing: border-box;
}

.section-item-side-image {
   height: 100%;
   object-fit: cover;
}

.footer {
   position: relative;
   width: 100%;
   padding: 64px 0;
   border-radius: 20px;
   background-color: #6C2CFD;
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
   border: 1px solid #C5ACFF;
   background-color: #5E5CE6;
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
