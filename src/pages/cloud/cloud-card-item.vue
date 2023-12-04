<template>
  <div class="cloud-card" :style="[cardStyle.style, cardBgStyle.style]">
    <img class="cloud-card-bg" :src="item.background" />
    <NSpace class="cloud-card-content" vertical align="center" justify="center" :size="[0, 20]" style="height: 100%">
      <NH3 style="margin: 0">{{ item.title }}</NH3>
      <div class="cloud-card-content-desc">{{ item.desc }}</div>
    </NSpace>
    <div class="cloud-card-footer" :style="cardFooterStyle.style"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { NSpace, NH3 } from 'naive-ui';
import { useIsMobile, useIsTablet, useIsSmallDesktop, useIsDesktop } from '../../composables/use-screen';

type cardFooterType = {
  style: { borderColor: string };
};

export default defineComponent({
  components: { NSpace, NH3 },
  props: {
    item: { type: Object, default: () => ({}) },
    index: { type: Number, default: 0 },
  },

  setup(props, context) {
    const isMobile = useIsMobile();
    const isTablet = useIsTablet();

    const cardStyle = computed(() => {
      if (isMobile.value || isTablet.value) {
        return { style: { height: 'calc((100vw - 48px) / 2.6)' } };
      } else {
        return { style: { height: 'calc((50vw - 74px) / 2.6)', 'max-height': '250px' } };
      }
    });
    const cardBgStyle = computed(() => {
      if (props.index === 0) {
        return { style: { boxShadow: '0px 4px 20px 0px #6A459D2E' } };
      } else if (props.index === 1) {
        return { style: { boxShadow: '0px 4px 20px 0px #D37D462E' } };
      } else {
        return { style: { boxShadow: '0px 4px 20px 0px #6A459D2E' } };
      }
    });

    const cardFooterStyle = computed<cardFooterType>(() => {
      if (props.index === 0) {
        return { style: { borderColor: '#c19cf2' } };
      } else if (props.index === 1) {
        return { style: { borderColor: '#E2B395' } };
      } else {
        return { style: { borderColor: '#F3B1F4' } };
      }
    });

    return { isMobile, isTablet, cardStyle, cardBgStyle, cardFooterStyle };
  },
});
</script>
<style scoped>
.cloud-card {
  position: relative;
  margin-bottom: 52px;
  border-radius: 10px;
}
.cloud-card-bg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 2;
}
.cloud-card-content {
  position: absolute;
  top: 0;
  right: 0;
  width: 70%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  text-align: center;
  z-index: 3;
}
.cloud-card-content-desc {
  color: #666;
}
.cloud-card-footer {
  position: absolute;
  left: 10%;
  bottom: -24px;
  width: 80%;
  height: 70%;
  border-width: 1px;
  border-style: solid;
  border-radius: 10px;
  z-index: 1;
}
</style>
