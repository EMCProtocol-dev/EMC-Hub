<template>
<<<<<<< HEAD
<<<<<<< HEAD
  <div>
    <!-- <SignInGoogle />
    <NDivider>or</NDivider> -->
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
=======
  <NTabs
    class="card-tabs"
    default-value="signin"
    size="large"
    animated
    :value="current"
    @update:value="onChangeTab"
    tab-style="display:none;"
    pane-style="padding-top:0"
  >
    <NTabPane name="signin-wallet" tab="ICP Wallet">
      <SignInWallet
        ref="signInWalletRef"
        @signin="onSignin"
        @signinbefore="onSigninBefore"
        @signinafter="onSigninAfter"
      />
      <NButton
        class="tab-toggle"
        quaternary
        type="primary"
        :disabled="business"
        strong
        size="large"
        @click="current = 'signin-account'"
        >Account signin</NButton
      >
    </NTabPane>
    <NTabPane name="signin-account" tab="Account">
      <SignInAccount
        ref="signInAccountRef"
        @signin="onSignin"
        @signinbefore="onSigninBefore"
        @signinafter="onSigninAfter"
      />
      <NButton
        class="tab-toggle"
        quaternary
        type="primary"
        :disabled="business"
        strong
        size="large"
        @click="current = 'signin-wallet'"
        >Wallet signin</NButton
      >
    </NTabPane>
  </NTabs>
=======
  <SignInAccount
    ref="signInAccountRef"
    @signin="onSignin"
    @signinbefore="onSigninBefore"
    @signinafter="onSigninAfter"
  />
>>>>>>> 13fe58d (~)
</template>
<script lang="ts">
import { ref, defineComponent, nextTick } from 'vue';
import { NSpace, NButton } from 'naive-ui';
import SignInAccount from './signin-account.vue';
export default defineComponent({
  components: { NSpace, NButton, SignInAccount },
  emits: ['signin', 'signinbefore', 'signinafter'],
  setup(props, ctx) {
    const business = ref(false);
    const signInAccountRef = ref<InstanceType<typeof SignInAccount>>();
    return {
      business,
      signInAccountRef,
      postLogin(data: { account: string; password: string; principal: string }) {
<<<<<<< HEAD
        if (current.value === 'signin-wallet') {
          signInWalletRef.value?.postLogin(data);
        } else if (current.value === 'signin-account') {
          signInAccountRef.value?.postLogin(data);
        }
>>>>>>> 4a3626c (~)
=======
        signInAccountRef.value?.postLogin(data);
>>>>>>> 13fe58d (~)
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
