<template>
  <div style="position: relative; min-height: 640px">
    <NGrid cols="1 976:2" :x-gap="0" :y-gap="56" item-responsive style="position: absolute; z-index: 1; height: 100%">
      <NGridItem>
        <!-- <NSpace :wrap-item="false"> -->
        <NSpace class="carouse-box" :wrap-item="false" :vertical="true" justify="center" :align="isMobile || isTablet ? 'center' : 'start'" :style="titleStyle.style">
          <NH2 class="carouse-title">Fully <span class="carouse-title-span">Decentralized</span> Al Application</NH2>
          <NH4 class="carouse-content">With the help of idle GPU computing power distributed on EdgeMatrix worldwide, you can generate the AI images you desire from anywhere at any time. It is a fully decentralized AI platform. </NH4>
          <RouterLink :to="{ path: '/models' }">
            <NButton class="carouse-button" type="warning"> Generate Your First Al lmage on Chain </NButton>
          </RouterLink>
        </NSpace>
        <!-- </NSpace> -->
      </NGridItem>
      <NGridItem>
        <NSpace class="carouse-cover" :vertical="true" :wrap-item="false" justify="center" :align="isMobile || isTablet ? 'center' : 'end'">
          <img class="carouse-cover-img" src="@/assets/home-background-image.png" />
        </NSpace>
      </NGridItem>
    </NGrid>
    <template v-if="!isMobile && !isTablet">
      <img class="carouse-background" src="@/assets/home-background.png" />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { RouterLink } from 'vue-router';
import { NButton, NSpace, NH2, NH4, NGrid, NGridItem } from 'naive-ui';
import { useIsMobile, useIsTablet, useIsSmallDesktop, useIsDesktop } from '@/composables/use-screen';

type titleType = {
  style: { 'text-align': string; width: string };
};

export default defineComponent({  
  name: 'home-carouse',
  components: { RouterLink, NButton, NSpace, NH2, NH4, NGrid, NGridItem },
  setup(props, context) {
    const isMobile = useIsMobile();
    const isTablet = useIsTablet();
    console.log(isMobile.value || isTablet.value);

    const titleStyle = computed<titleType>(() => {
      if (isMobile.value || isTablet.value) {
        return { style: { 'text-align': 'center', width: '100%' } };
      } else {
        return { style: { 'text-align': 'left', width: '85%' } };
      }
    });
    return { titleStyle, isMobile, isTablet };
  },
});
</script>
<style scoped>
.carouse-background {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 100%;
}
.carouse-cover {
  height: 100%;
}
.carouse-cover-img {
  width: 85%;
}
.carouse-box {
  height: 100%;
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
  width: 90%;
  margin: 32px 0 64px;
}

.carouse-button {
  height: 48px;
  padding: 0 56px;
  color: #fff;
  border-radius: 10px;
  border: 1px solid #c5acff;
  background-color: #5e5ce6;
  box-shadow: 0px 8px 8px -4px rgba(24, 39, 75, 0.08), 0px 4px 6px -4px rgba(24, 39, 75, 0.12);
}
</style>
