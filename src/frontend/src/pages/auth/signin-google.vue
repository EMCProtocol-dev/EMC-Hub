<template>
  <NButton
    class="signin-btn"
    type="primary"
    strong
    size="large"
    :loading="submitting"
    @click.stop.prevent="onPressSubmit"
    style="width: 100%; font-weight: bold !important"
  >
    <template #icon>
      <NIcon size="28"><img src="@/assets/icon-google.svg" /></NIcon>
    </template>
    Google</NButton
  >
</template>
<script lang="ts">
import { ref, defineComponent } from 'vue';
import { NSpace, NButton, NIcon, useMessage } from 'naive-ui';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
const firebaseConfig = {
  apiKey: 'AIzaSyBGpgtnvmOndaXZ0Z_MGd-7ftVq6vAi2mE',
  authDomain: 'emchubdev.firebaseapp.com',
  projectId: 'emchubdev',
  storageBucket: 'emchubdev.appspot.com',
  messagingSenderId: '444006589364',
  appId: '1:444006589364:web:e07a9baa798f041373c8e1',
  measurementId: 'G-46LLXFJXZG',
};
export default defineComponent({
  components: { NButton, NIcon },
  emits: ['signin', 'signinbefore', 'signinafter'],
  setup(props, ctx) {
    const submitting = ref(false);
    return {
      submitting,
      async onPressSubmit() {
        const message = useMessage();
        const app = initializeApp(firebaseConfig);
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        try {
          const result = await signInWithPopup(auth, provider);
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (!credential) {
            message.error('Google auth error');
            return;
          }
          const token = credential.accessToken;
          console.info('Google access token:', token);
          // The signed-in user info.
          const user = result.user;
          console.info('User Info:', user);
        } catch (error: any) {
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.customData.email;
          const credential = GoogleAuthProvider.credentialFromError(error);
        }
      },
    };
  },
});
</script>
<style scoped></style>
