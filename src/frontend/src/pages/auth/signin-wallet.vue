<template>
  <NForm ref="formRef" :model="formData" :rules="formRule">
    <NFormItem path="account">
      <template #label>
        <NText strong>Account</NText>
      </template>
      <NInput v-model:value="formData.account" placeholder="" @keydown.enter.prevent />
    </NFormItem>
  </NForm>
  <NSpace vertical align="center" :wrap-item="false">
    <NButton
      class="signin-btn"
      type="primary"
      strong
      size="large"
      :loading="submitting"
      @click.stop.prevent="onPressSubmit"
      >Connect Wallet</NButton
    >
  </NSpace>
</template>
<script lang="ts">
import { ref, defineComponent, nextTick } from 'vue';
import { NForm, NFormItem, NButton, NInput, NDivider, NSpace, NText, FormInst, FormRules, useMessage } from 'naive-ui';
import { useUserStore } from '@/stores/user';
import { AuthType } from '@/stores/user';
import { Utils } from '@/tools/utils';

type SignIn = {
  account: string;
  principal: string;
};

export default defineComponent({
  components: { NForm, NFormItem, NButton, NInput, NDivider, NSpace, NText },
  emits: ['cancel', 'signin', 'signinbefore', 'signinafter'],
  setup(props, ctx) {
    const formRef = ref<FormInst | null>(null);
    const formData = ref<SignIn>({
      account: '',
      principal: '',
    });
    const formRule: FormRules = {
      account: [{ trigger: ['input', 'blur'], validator: Utils.validatorNotEmpty }],
      principal: [{ trigger: ['input', 'blur'], validator: Utils.validatorNotEmpty }],
    };
    const submitting = ref(false);
    const message = useMessage();
    const userStore = useUserStore();
    const handleSubmit = async () => {
      const account = formData.value.account;
      const principal = formData.value.principal;
      const params = { account, principal, type: 'wallet' as AuthType };
      ctx.emit('signinbefore');
      submitting.value = true;
      const resp1 = await userStore.signin(params);
      submitting.value = false;
      ctx.emit('signinafter');
      if (resp1._result !== 0) {
        message.warning(resp1._desc);
        return;
      }
      ctx.emit('signin', params);
    };

    return {
      formRef,
      formData,
      formRule,
      submitting,
      async postLogin({ account, principal }: { account: string; principal: string }) {
        if (!account || !principal) return;
        formData.value.account = account;
        formData.value.principal = principal;
        await nextTick();
        handleSubmit();
      },
      async onPressSubmit() {
        try {
          await formRef.value?.validate();
          submitting.value = true;
          const resp = await Utils.emcLogin();
          submitting.value = false;
          if (resp._result !== 0) {
            message.error(resp._desc as string);
            return;
          }
          if (!resp.data?.principal) {
            message.error('Response data error');
            return;
          }
          const principal = resp.data.principal as string;
          formData.value.principal = principal;
          handleSubmit();
        } catch (errors) {
          console.info(errors);
        }
      },
    };
  },
});
</script>
<style scoped>
.signin-btn {
  width: 100%;
  font-weight: bold !important;
}
</style>
