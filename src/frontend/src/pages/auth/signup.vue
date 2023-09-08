<template>
  <NForm ref="formRef" :model="formData" :rules="formRule">
    <input name="account" style="position: fixed; z-index: -9999" />
    <input type="password" name="password" style="position: fixed; z-index: -9999" />
    <NFormItem path="account">
      <template #label>
        <NText strong>Account</NText>
      </template>
      <NInput v-model:value="formData.account" placeholder="" @keydown.enter.prevent />
    </NFormItem>
    <NFormItem path="password">
      <template #label>
        <NText strong>Password</NText>
      </template>
      <NInput
        v-model:value="formData.password"
        type="password"
        show-password-on="mousedown"
        placeholder=""
        @keydown.enter.prevent
      />
    </NFormItem>
    <NFormItem path="nickname">
      <template #label>
        <NText strong>Nickname</NText>
      </template>
      <NInput v-model:value="formData.nickname" placeholder="" @keydown.enter.prevent />
    </NFormItem>
    <NFormItem path="email">
      <template #label>
        <NText strong>Email</NText>
      </template>
      <NInput v-model:value="formData.email" placeholder="" @keydown.enter.prevent />
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
      >Sign up</NButton
    >
  </NSpace>
</template>
<script lang="ts">
import { ref, defineComponent } from 'vue';
import { NForm, NFormItem, NButton, NInput, NDivider, NSpace, NText, FormInst, FormRules, useMessage } from 'naive-ui';
import { useUserStore } from '@/stores/user';
import { Utils } from '@/tools/utils';

type SignIn = {
  account: string;
  password: string;
  nickname: string;
  email: string;
};

export default defineComponent({
  components: { NForm, NFormItem, NButton, NInput, NDivider, NSpace, NText },
  emits: ['cancel', 'signup', 'signupbefore', 'signupafter'],
  setup(props, ctx) {
    const formRef = ref<FormInst | null>(null);
    const formData = ref<SignIn>({
      account: '',
      password: '',
      nickname: '',
      email: '',
    });
    const formRule: FormRules = {
      account: [{ required: true, trigger: ['input', 'blur'], validator: Utils.validatorNotEmpty }],
      password: [{ required: true, trigger: ['input', 'blur'], validator: Utils.validatorNotEmpty }],
      nickname: [{ required: true, trigger: ['input', 'blur'], validator: Utils.validatorNotEmpty }],
      email: [{ required: true, trigger: ['input', 'blur'], validator: Utils.validatorNotEmpty }],
    };
    const submitting = ref(false);
    const message = useMessage();
    const userStore = useUserStore();
    const handleSubmit = async () => {
      let account = formData.value.account;
      let password = formData.value.password;
      let email = formData.value.email;
      let nickname = formData.value.nickname;
      const params = { account, password, nickname, email };
      submitting.value = true;
      const resp = await userStore.signup(params);
      submitting.value = false;
      if (resp._result !== 0) {
        message.error(resp._desc as string);
        return;
      }
      ctx.emit('signup', params);
    };

    return {
      formRef,
      formData,
      formRule,
      submitting,
      async onPressSubmit() {
        try {
          await formRef.value?.validate();
          ctx.emit('signupbefore');
          await handleSubmit();
          ctx.emit('signupafter');
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
