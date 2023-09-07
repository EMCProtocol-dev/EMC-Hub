<<<<<<< HEAD
=======
<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <!-- <n-theme-editor> </n-theme-editor> -->
    <n-loading-bar-provider>
      <n-message-provider>
        <n-notification-provider>
          <n-dialog-provider>
            <App />
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
    <n-global-style />
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {
  NLoadingBarProvider,
  NMessageProvider,
  NNotificationProvider,
  NDialogProvider,
  NGlobalStyle,
  NThemeEditor,
  darkTheme,
  NConfigProvider,
} from 'naive-ui';

// import { useRouter, useRoute } from 'vue-router';
// import { initRouter, siteSetup } from './store'
import App from './App.vue';
export default defineComponent({
  name: 'AppSetup',
  components: {
    NConfigProvider,
    NLoadingBarProvider,
    NMessageProvider,
    NNotificationProvider,
    NDialogProvider,
    NGlobalStyle,
    NThemeEditor,
    App,
  },
  setup() {
    const isDark = false; //window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = ref(isDark ? darkTheme : null);
    
    const lightThemeOverrides = {
      common: {
        primaryColor: '#6c2cfd',
      },
      Input: {
        borderFocus: '1px solid #9747ff',
        borderHover: '1px solid #9747ff',
        caretColor: '',
        boxShadowFocus: '0 0 0 2px rgba(225, 93, 239, 0.2)',
        borderRadius: '10px',
        border: '1px solid #e2e6ee',
        placeholderColor: '#9EA8BD',
        // fontSize: '12px',
        // height: '40px',
      },
      Upload: {
        draggerBorderHover: '1px dashed #9747FF',
      },
      Tabs: {
        // tabTextColorActive: '#6c2cfd',
        // tabTextColorHover: '#6c2cfd',
        // barColor: '#6c2cfd',
      },
    };

    const darkThemeOverrides = {
      common: {
        primaryColor: '#6c2cfd',
      },
      Input: {
        borderFocus: '1px solid #9747ff',
        borderHover: '1px solid #9747ff',
        caretColor: '',
        boxShadowFocus: '0 0 0 2px rgba(225, 93, 239, 0.2)',
        borderRadius: '10px',
        border: '1px solid #e2e6ee',
        placeholderColor: '#9EA8BD',
        // fontSize: '12px',
        // height: '40px',
      },
      Upload: {
        draggerBorderHover: '1px dashed #9747FF',
      },
      Tabs: {
        // tabTextColorActive: '#6c2cfd',
        // tabTextColorHover: '#6c2cfd',
        // barColor: '#6c2cfd',
      },
    };

    const themeOverrides = ref(isDark ? darkThemeOverrides : lightThemeOverrides);

    return { theme, themeOverrides, lightThemeOverrides, darkThemeOverrides };
  },
});
</script>
>>>>>>> 3cf5440 (~)
