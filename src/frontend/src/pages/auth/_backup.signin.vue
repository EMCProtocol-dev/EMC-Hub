<template>
  <NForm ref="formRef" :model="formData" :rules="formRule">
    <input name="account" style="position: fixed; z-index: -9999" />
    <input type="password" name="password" style="position: fixed; z-index: -9999" />
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
      >Sign In</NButton
    >
    <NDivider style="width: 40px" />
    <NButton
      class="signin-btn"
      type="primary"
      strong
      size="large"
      :loading="submitting"
      @click.stop.prevent="onPressSubmit"
      >Wallet Login</NButton
    >
  </NSpace>
</template>
<script lang="ts">
import { ref, defineComponent, nextTick } from 'vue';
import { NForm, NFormItem, NButton, NInput, NDivider, NSpace, FormInst, FormRules, useMessage } from 'naive-ui';
import { useUserStore } from '@/stores/user';

type SignIn = {
  account: string;
  password: string;
};

export default defineComponent({
  components: { NForm, NFormItem, NButton, NInput, NDivider, NSpace },
  props: {
    account: { type: String, default: '' },
    password: { type: String, default: '' },
  },
  emits: ['cancel', 'signin', 'signinbefore', 'signinafter'],
  setup(props, ctx) {
    const formRef = ref<FormInst | null>(null);
    const formData = ref<SignIn>({
      account: props.account,
      password: props.password,
    });
    const formRule: FormRules = {
      account: [{ message: 'Can not be empty', trigger: ['input', 'blur'] }],
      password: [{ message: 'Can not be empty', trigger: ['input', 'blur'] }],
    };
    const submitting = ref(false);
    const message = useMessage();
    const userStore = useUserStore();
    const handleSubmit = async () => {
      let account = formData.value.account;
      let password = formData.value.password;
      submitting.value = true;
      const resp = await userStore.signin({ account, password, principal: '', type: '' });
      submitting.value = false;
      if (resp._result !== 0) {
        message.warning(resp._desc);
        return;
      }
      ctx.emit('signin', { account, password });
    };

    return {
      formRef,
      formData,
      formRule,
      submitting,
      async postLogin({ account, password, principal }: { account: string; password: string; principal?: string }) {
        if (account) formData.value.account = account;
        if (password) formData.value.password = password;
        await nextTick();
        handleSubmit();
      },
      async onPressSubmit() {
        try {
          await formRef.value?.validate();
          ctx.emit('signinbefore');
          await handleSubmit();
          ctx.emit('signinafter');
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
