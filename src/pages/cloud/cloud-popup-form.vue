<template>
  <NModal v-model:show="isVisible" :block-scroll="false" :on-mask-click="onPressMask">
    <NSpace class="form" vertical align="center" :wrap-item="false" :size="[0, 0]">
      <img src="@/assets/logo-mini.png" width="58" height="58" />
      <NH5 class="form-title">Fill out the form below, and our expert team will get in touch with you soon.</NH5>

      <NForm ref="formRef" :model="formData" :rules="rules" style="width: 100%">
        <input type="password" name="password" style="position: fixed; left: -9999px; top: -9999px; z-index: -9999" />
        <NFormItem path="" label="Full Name" :label-style="labelStyle.style">
          <NInput class="form-input" v-model:value="formData.name" size="large" placeholder="Please provide your full name." @keydown.enter.prevent />
        </NFormItem>
        <NFormItem path="" label="Project Name" :label-style="labelStyle.style">
          <NInput class="form-input" v-model:value="formData.project" size="large" placeholder="What is the name of your project or company?" @keydown.enter.prevent />
        </NFormItem>
        <NFormItem path="" label="Project Website" :label-style="labelStyle.style">
          <NInput class="form-input" v-model:value="formData.website" size="large" placeholder="Could you share the website of your project or company?" @keydown.enter.prevent />
        </NFormItem>
        <NFormItem path="email" label="Email" :label-style="labelStyle.style">
          <NInput class="form-input" v-model:value="formData.email" size="large" placeholder="Kindly provide your email address." @keydown.enter.prevent />
        </NFormItem>
        <NFormItem path="" label="Other Contact" :label-style="labelStyle.style">
          <NGrid :cols="2" :x-gap="24" :y-gap="24">
            <NGridItem :span="2">
              <NSpace :wrap="false" justify="space-between">
                <NInput class="form-input" v-model:value="formData.twitter" size="large" placeholder="Twitter" @keydown.enter.prevent />
                <NInput class="form-input" v-model:value="formData.telegram" size="large" placeholder="Telegram" @keydown.enter.prevent />
              </NSpace>
            </NGridItem>
            <NGridItem :span="2">
              <NInput class="form-input" v-model:value="formData.otherContact" size="large" placeholder="Do you have additional contact information such as Twitter, Telegram, or other platforms?" @keydown.enter.prevent />
            </NGridItem>
          </NGrid>
        </NFormItem>
        <NFormItem path="" label="Usage and Requirements" :label-style="labelStyle.style">
          <NInput
            class="form-input"
            v-model:value="formData.requirement"
            type="textarea"
            :autosize="{
              minRows: 2,
              maxRows: 5,
            }"
            maxlength="99"
            show-count
            size="large"
            placeholder="Please tell us about your requirements and intended usage of GPUs for your project."
            @keydown.enter.prevent
          />
        </NFormItem>
      </NForm>
      <NSpace vertical align="center" :wrap-item="false" style="width: 90%">
        <NButton class="form-btn" type="primary" color="#8a2be2" size="large" :loading="submitting" @click.stop.prevent="onPressSubmit">Submit</NButton>
      </NSpace>
    </NSpace>
  </NModal>
</template>

<script lang="ts">
import { ref, watch, onMounted, computed, defineComponent } from 'vue';
import { NForm, NGrid, NGridItem, NFormItem, NInput, FormInst, FormItemRule, FormRules, NSpace, NModal, NButton, NH5 } from 'naive-ui';

type FormType = {
  name: string;
  project: string;
  website: string;
  email: string;
  twitter: string;
  telegram: string;
  otherContact: string;
  requirement: string;
};

type labelType = {
  style: { color: string; 'font-size': string; 'padding-bottom': string };
};

export default defineComponent({
  components: { NForm, NGrid, NGridItem, NFormItem, NInput, NSpace, NModal, NButton, NH5 },

  props: {
    showModal: { type: Boolean, default: false },
    userInfo: { type: Object, default: {} },
  },
  emits: ['cancel', 'info'],
  setup(props, context) {
    const submitting = ref(false);
    const isVisible = ref(props.showModal);
    const formData = ref<FormType>({
      name: '',
      project: '',
      website: '',
      email: '',
      twitter: '',
      telegram: '',
      otherContact: '',
      requirement: '',
    });
    const formRef = ref<FormInst | null>();

    const rules: FormRules = {
      email: [
        {
          required: true,
          validator(rule: FormItemRule, value: string) {
            if (!value) {
              return new Error('Email cannot be empty');
            } else if (!/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value)) {
              return new Error('Please fill in the correct email');
            }
            return true;
          },
          trigger: ['input', 'blur'],
        },
      ],
    };

    const labelStyle = computed<labelType>(() => {
      return { style: { color: '#030102', 'font-size': '16px', 'padding-bottom': '10px' } };
    });

    const onPressMask = () => {
      context.emit('cancel');
    };

    watch(
      () => props.showModal,
      (newVal: boolean) => {
        isVisible.value = newVal;
      }
    );

    return {
      isVisible,
      onPressMask,
      labelStyle,
      formRef,
      formData,
      rules,
      submitting,
      async onPressSubmit() {
        try {
          submitting.value = true;
          await formRef.value?.validate();
          if (formRef.value) {
            context.emit('info', formRef.value);
          }
          submitting.value = false;
          context.emit('cancel');
        } catch (error) {
          submitting.value = false;
        }
      },
    };
  },
});
</script>

<style scoped>
.form {
  width: 90%;
  max-width: 364px;
  padding: 8px 44px 24px;
  border-radius: 20px;
  background-color: #fff;
}
.form-title {
  width: 80%;
  margin: 8px auto 28px;
  font-size: 14px;
  font-weight: 300;
  line-height: 20px;
  text-align: center;
}
.form-input {
  font-size: 12px;
  box-shadow: 0px 4px 18px 0px #9ea8bd38;
}
.form-btn {
  width: 100%;
  border-radius: 10px;
}
</style>
