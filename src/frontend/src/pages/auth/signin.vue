<template>
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
</template>
<script lang="ts">
import { ref, defineComponent, nextTick } from 'vue';
import { NSpace, NTabs, NTabPane, NButton } from 'naive-ui';
import SignInWallet from './signin-wallet.vue';
import SignInAccount from './signin-account.vue';
type TabName = 'signin-wallet' | 'signin-account';
export default defineComponent({
  components: { NSpace, NTabs, NTabPane, NButton, SignInWallet, SignInAccount },
  emits: ['signin', 'signinbefore', 'signinafter'],
  setup(props, ctx) {
    const current = ref<TabName>('signin-wallet');
    const business = ref(false);
    const signInWalletRef = ref<InstanceType<typeof SignInWallet>>();
    const signInAccountRef = ref<InstanceType<typeof SignInAccount>>();
    return {
      current,
      business,
      signInWalletRef,
      signInAccountRef,
      onChangeTab(tab: TabName) {
        current.value = tab;
      },
      postLogin(data: { account: string; password: string; principal: string }) {
        if (current.value === 'signin-wallet') {
          signInWalletRef.value?.postLogin(data);
        } else if (current.value === 'signin-account') {
          signInAccountRef.value?.postLogin(data);
        }
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
