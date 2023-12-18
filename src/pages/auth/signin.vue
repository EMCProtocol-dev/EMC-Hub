<template>
  <div>
    <SignInGoogle @signin="onSignin" @signinbefore="onSigninBefore" @signinafter="onSigninAfter" />
    <NDivider>or</NDivider>
    <SignInAccount
      ref="signInAccountRef"
      @signin="onSignin"
      @signinbefore="onSigninBefore"
      @signinafter="onSigninAfter"
    />
  </div>
</template>
<script lang="ts">
import { ref, defineComponent, nextTick } from 'vue';
import { NSpace, NButton, NDivider } from 'naive-ui';
import SignInAccount from './signin-account.vue';
import SignInGoogle from './signin-google.vue';
export default defineComponent({
  components: { NSpace, NButton, NDivider, SignInGoogle, SignInAccount },
  emits: ['signin', 'signinbefore', 'signinafter'],
  setup(props, ctx) {
    const business = ref(false);
    const signInAccountRef = ref<InstanceType<typeof SignInAccount>>();
    return {
      business,
      signInAccountRef,
      postLogin(data: { account: string; password: string }) {
        signInAccountRef.value?.postLogin(data);
      },
      onSignin(data: any) {
        ctx.emit('signin', data);
      },
      onSigninBefore() {
        business.value = true;
        ctx.emit('signinbefore');
      },
      onSigninAfter() {
        business.value = false;
        ctx.emit('signinafter');
      },
    };
  },
});
</script>
<style scoped>
.tab-toggle {
  width: 100%;
  margin-top: 24px;
}
</style>
