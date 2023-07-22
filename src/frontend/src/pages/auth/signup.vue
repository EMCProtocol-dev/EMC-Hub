<template>
  <NForm ref="formRef" :model="formData" :rules="formRule">
    <input name="account" style="position: fixed; z-index: -9999" />
    <input type="password" name="password" style="position: fixed; z-index: -9999" />
<<<<<<< HEAD
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
=======
    <NFormItem path="account" label="Account" label-style="font-size:12px;">
      <NInput v-model:value="formData.account" placeholder="" @keydown.enter.prevent />
    </NFormItem>
    <NFormItem path="password" label="Password" label-style="font-size:12px;">
      <NInput v-model:value="formData.password" type="password" placeholder="" @keydown.enter.prevent />
    </NFormItem>
    <NFormItem path="nickname" label="Nickname" label-style="font-size:12px;">
      <NInput v-model:value="formData.nickname" placeholder="" @keydown.enter.prevent />
    </NFormItem>
    <NFormItem path="email" label="Email" label-style="font-size:12px;">
      <NInput v-model:value="formData.email" placeholder="" @keydown.enter.prevent />
    </NFormItem>
    <NFormItem path="principal" label="ICP-Principal" label-style="font-size:12px;">
      <NInput v-model:value="formData.principal" :disabled="true" placeholder="" @keydown.enter.prevent>
        <template #suffix>
          <NButton
            type="warning"
            strong
            :loading="principalLoading"
            @click="onPressGetPrincipal"
            style="margin-right: -12px"
            >Get Principal</NButton
          >
        </template>
      </NInput>
    </NFormItem>
>>>>>>> 4a3626c (~)
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
<<<<<<< HEAD
import { NForm, NFormItem, NButton, NInput, NDivider, NSpace, NText, FormInst, FormRules, useMessage } from 'naive-ui';
=======
import { NForm, NFormItem, NButton, NInput, NDivider, NSpace, FormInst, FormRules, useMessage } from 'naive-ui';
>>>>>>> 4a3626c (~)
import { useUserStore } from '@/stores/user';
import { Utils } from '@/tools/utils';

type SignIn = {
  account: string;
  password: string;
  nickname: string;
  email: string;
<<<<<<< HEAD
};

export default defineComponent({
  components: { NForm, NFormItem, NButton, NInput, NDivider, NSpace, NText },
=======
  principal: string;
};

export default defineComponent({
  components: { NForm, NFormItem, NButton, NInput, NDivider, NSpace },
>>>>>>> 4a3626c (~)
  emits: ['cancel', 'signup', 'signupbefore', 'signupafter'],
  setup(props, ctx) {
    const formRef = ref<FormInst | null>(null);
    const formData = ref<SignIn>({
      account: '',
      password: '',
      nickname: '',
      email: '',
<<<<<<< HEAD
    });
    const formRule: FormRules = {
      account: [{ required: true, trigger: ['input', 'blur'], validator: Utils.validatorNotEmpty }],
      password: [{ required: true, trigger: ['input', 'blur'], validator: Utils.validatorNotEmpty }],
      nickname: [{ required: true, trigger: ['input', 'blur'], validator: Utils.validatorNotEmpty }],
      email: [{ required: true, trigger: ['input', 'blur'], validator: Utils.validatorNotEmpty }],
    };
    const submitting = ref(false);
=======
      principal: '',
    });
    const formRule: FormRules = {
      account: [{ trigger: ['input', 'blur'], validator: Utils.validatorNotEmpty }],
      password: [{ trigger: ['input', 'blur'], validator: Utils.validatorNotEmpty }],
      nickname: [{ trigger: ['input', 'blur'], validator: Utils.validatorNotEmpty }],
      email: [{ trigger: ['input', 'blur'], validator: Utils.validatorNotEmpty }],
      principal: [{ trigger: ['input', 'blur'], validator: Utils.validatorNotEmpty }],
    };
    const submitting = ref(false);
    const principalLoading = ref(false);
>>>>>>> 4a3626c (~)
    const message = useMessage();
    const userStore = useUserStore();
    const handleSubmit = async () => {
      let account = formData.value.account;
      let password = formData.value.password;
      let email = formData.value.email;
      let nickname = formData.value.nickname;
<<<<<<< HEAD
      const params = { account, password, nickname, email };
=======
      let principal = formData.value.principal;
      const params = { account, password, nickname, email, principal };
>>>>>>> 4a3626c (~)
      submitting.value = true;
      const resp = await userStore.signup(params);
      submitting.value = false;
      if (resp._result !== 0) {
        message.warning(resp._desc as string);
        return;
      }
      ctx.emit('signup', params);
    };

    return {
      formRef,
      formData,
      formRule,
      submitting,
<<<<<<< HEAD
=======
      principalLoading,
      async onPressGetPrincipal() {
        principalLoading.value = true;
        const resp = await Utils.emcLogin();
        principalLoading.value = false;
        if (resp._result !== 0) {
          message.error(resp._desc as string);
          return;
        }
        if (!resp.data?.principal) {
          message.error('Response data error');
          return;
        }
        formData.value.principal = resp.data.principal as string;
      },
>>>>>>> 4a3626c (~)
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
