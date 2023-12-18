<template>
  <RouterLink :to="{ path: '/' }">
    <img class="header-logo" :src="logo.url" :style="logo.style" />
  </RouterLink>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { RouterLink } from 'vue-router';
import { useIsMobile, useIsTablet, useIsSmallDesktop, useIsDesktop } from '@/composables/use-screen';
import logoUrl from '@/assets/logo.png';
import logoLightUrl from '@/assets/logo.light.png';

import logoMiniUrl from '@/assets/logo-mini.png';
import logoMiniLightUrl from '@/assets/logo-mini.light.png';

type logoDef = {
  url: string;
  style: { width: string; height: string };
};

export default defineComponent({
  components: { RouterLink },
  setup(props, context) {
    const isMobile = useIsMobile();
    const isTablet = useIsTablet();
    const isSmallDesktop = useIsSmallDesktop();
    const isDesktop = useIsDesktop();

    //pre load
    [logoUrl, logoLightUrl, logoMiniUrl, logoMiniLightUrl].forEach((url) => (new Image().src = url));

    const logo = computed<logoDef>(() => {
      if (isDesktop.value || isSmallDesktop.value) {
        return { style: { width: '204px', height: '76px' }, url: logoLightUrl };
      } else {
        return { style: { width: '76px', height: '76px' }, url: logoMiniLightUrl };
      }
    });

    return {
      logo,
    };
  },
});
</script>
<style scoped>
.header-logo {
  object-fit: cover;
}
</style>
