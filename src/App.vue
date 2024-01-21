<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue';
import { useLoadingBar, useMessage, NSpin } from 'naive-ui';
import { router } from '@/routes/index';
import { useUserStore } from '@/stores/user';
import { WalletConnect } from '@/web3/wallet-connect';
type Message = {
  type: string;
  data?: any;
};

export default defineComponent({
  name: 'app',
  components: { NSpin },
  setup() {
    const loadingBar = useLoadingBar();
    const message = useMessage();
    const userStore = useUserStore();

    WalletConnect.init();
    
    onMounted(() => {
      window.$message = message;
      window.$loadingBar = loadingBar;
      userStore.initLocalData();
      if (userStore.user.id) {
        //init user info
      }
      //emchub upload
      window.addEventListener('message', (event: any) => {
        const message = event.data as Message;
        const window = event.source as Window;
        switch (message.type) {
          case 'emchub-upload-cancel': {
            window.close();
            break;
          }
          case 'emchub-upload-done':
            window.close();
            break;
          default:
            console.info(`unknow message type '${message.type}'`);
            break;
        }
      });
    });

    return {};
  },
});
</script>
<style scoped>
.loading {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.n-header {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 84px;
  z-index: 99;
}
</style>
