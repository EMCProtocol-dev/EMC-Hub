<template>
  <NButton class="signin-btn" type="primary" strong size="large" color="#A45EFF" :loading="submitting"
    @click.stop.prevent="onPressSubmit" style="width: 100%; font-weight: bold !important">
    <template #icon>
      <NIcon size="24"><img src="@/assets/icon_google.png" /></NIcon>
    </template>
    <span style="margin-left: 8px">Google</span>
  </NButton>
</template>
<script lang="ts">
import { ref, defineComponent } from 'vue';
import { NSpace, NButton, NIcon, useMessage } from 'naive-ui';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useUserStore } from '@/stores/user';
import firebaseConfig from '@/firebase.credentials.json';
export default defineComponent({
  components: { NButton, NIcon },
  emits: ['signin', 'signinbefore', 'signinafter'],
  setup(props, ctx) {
    const submitting = ref(false);
    const userStore = useUserStore();
    const message = useMessage();
    return {
      submitting,
      async onPressSubmit() {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        const params = { token: '' };
        const result = { _result: 0, _desc: '' };
        ctx.emit('signinbefore');
        submitting.value = true;
        try {
          const googleResult = await signInWithPopup(auth, provider);
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(googleResult);
          if (!credential || !credential.accessToken) {
            result._result = 1;
            result._desc = 'Google auth error';
            return;
          }
          // The signed-in user info.
          // const user = result.user;
          // console.info('User Info:', user);
          params.token = credential.accessToken;
          const resp = await userStore.signinWithGoogle(params);
          submitting.value = false;
          ctx.emit('signinafter');
          if (resp._result !== 0) {
            result._result = 1;
            result._desc = resp._desc;
            return;
          }
          result._result = 0;
        } catch (error: any) {
          console.error(error);
          const errorCode = error.code;
          const errorMessage = error.message;
          // const email = error.customData.email;
          // const credential = GoogleAuthProvider.credentialFromError(error);
          result._result = 1;
          result._desc = `${errorMessage}`;
        }
        submitting.value = false;
        ctx.emit('signinafter');
        if (result._result === 1) {
          console.info('sign failure', result);
          message.error(result._desc);
          return;
        }
        ctx.emit('signin', params);
      },
    };
  },
});
</script>
<style scoped></style>
