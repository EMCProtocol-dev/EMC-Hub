<template>
  <NForm ref="formRef" :model="formData" :rules="formRule">
    <!-- <input name="account" style="position: fixed; z-index: -9999" /> -->
    <input type="password" name="password" style="position: fixed; left: -9999px; top: -9999px; z-index: -9999" />
    <NFormItem path="account" label="Account" label-style="font-size:12px;">
      <NInput v-model:value="formData.account" placeholder="" @keydown.enter.prevent />
    </NFormItem>
    <NFormItem path="password" label="Password" label-style="font-size:12px;">
      <NInput v-model:value="formData.password" type="password" placeholder="" @keydown.enter.prevent />
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
      >Sign in</NButton
    >
  </NSpace>
</template>
<script lang="ts">
import { ref, defineComponent, nextTick } from 'vue';
import { NForm, NFormItem, NButton, NInput, NDivider, NSpace, FormInst, FormRules, useMessage } from 'naive-ui';
import { useUserStore } from '@/stores/user';
import type { AuthType } from '@/stores/user';
import { Utils } from '@/tools/utils';

type SignIn = {
  account: string;
  password: string;
};

export default defineComponent({
  components: { NForm, NFormItem, NButton, NInput, NDivider, NSpace },
  emits: ['cancel', 'signin', 'signinbefore', 'signinafter'],
  setup(props, ctx) {
    const formRef = ref<FormInst | null>(null);
    const formData = ref<SignIn>({
      account: '',
      password: '',
    });
    const formRule: FormRules = {
      account: [{ trigger: ['input', 'blur'], validator: Utils.validatorNotEmpty }],
      password: [{ trigger: ['input', 'blur'], validator: Utils.validatorNotEmpty }],
    };
    const submitting = ref(false);
    const message = useMessage();
    const userStore = useUserStore();
    const handleSubmit = async () => {
      const account = formData.value.account;
      const password = formData.value.password;
      const params = { account, password, type: 'password' as AuthType };
      ctx.emit('signinbefore');
      submitting.value = true;
      const resp = await userStore.signin(params);
      submitting.value = false;
      ctx.emit('signinafter');
      if (resp._result !== 0) {
        message.warning(resp._desc);
        return;
      }
      ctx.emit('signin', params);
    };

    return {
      formRef,
      formData,
      formRule,
      submitting,
      async postLogin({ account, password }: { account: string; password: string }) {
        if (!account || !password) return;
        formData.value.account = account;
        formData.value.password = password;
        await nextTick();
        handleSubmit();
      },
      async onPressSubmit() {
        try {
          await formRef.value?.validate();
          await handleSubmit();
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
