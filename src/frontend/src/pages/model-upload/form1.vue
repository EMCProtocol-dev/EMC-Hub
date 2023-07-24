<template>
  <NForm ref="formRef" :model="formData" :rules="formRule" :disabled="!ready || disabled">
    <NSpace vertical>
      <NFormItem path="name" label="Model Name">
        <NInput v-model:value="formData.name" placeholder="Please enter something..." @keydown.enter.prevent />
      </NFormItem>
      <NFormItem path="tags" label="Model Tags">
        <NCheckboxGroup v-model:value="formData.tags">
          <NSpace>
            <template v-for="item in tagItems">
              <NCheckbox :value="item.val"> {{ item.label }} </NCheckbox>
            </template>
          </NSpace>
        </NCheckboxGroup>
      </NFormItem>
      <NFormItem path="category" label="Model Category">
        <NRadioGroup v-model:value="formData.category">
          <NSpace>
            <template v-for="item in categoryItems">
              <NRadio :value="item.val"> {{ item.label }} </NRadio>
            </template>
          </NSpace>
        </NRadioGroup>
      </NFormItem>
      <template v-if="!disabled">
        <NSpace justify="end" :size="[16, 0]">
          <NButton
            type="default"
            :disabled="!ready || formSubmitting"
            :loading="formSubmitting"
            @click.stop.prevent="onPressReset"
            >Reset</NButton
          >
          <NButton
            type="primary"
            :disabled="!ready || formSubmitting"
            :loading="formSubmitting"
            @click.stop.prevent="onPressSubmit"
            >Submit</NButton
          >
        </NSpace>
      </template>
    </NSpace>
  </NForm>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, watch } from 'vue';
import {
  NForm,
  NFormItem,
  NButton,
  NInput,
  NSpace,
  NRadioGroup,
  NRadio,
  NCheckboxGroup,
  NCheckbox,
  FormInst,
  FormItemInst,
  FormRules,
  FormItemRule,
  useMessage,
} from 'naive-ui';
import { Http } from '@/tools/http';
import { useUserStore } from '@/stores/user';
type FormData = {
  name: string;
  tags: string[];
  category: string;
};

function defaultFormData() {
  return {
    name: '',
    tags: [],
    category: '',
  };
}

type TagItem = {
  label: string;
  val: string;
};

type CategoryItem = {
  label: string;
  val: string;
};

const tagItemOptions = [
  { val: 'PERSON', label: 'PERSON' },
  { val: 'WEDDING', label: 'WEDDING' },
  { val: 'WOMEN', label: 'WOMEN' },
  { val: 'PHOTOREALISTIC', label: 'PHOTOREALISTIC' },
  { val: 'HIGHLY', label: 'HIGHLY' },
  { val: 'DETAILED', label: 'DETAILED' },
];

const categoryItemOptions = [{ val: 'CHECKPOINT', label: 'CHECKPOINT' }];

export default defineComponent({
  components: { NForm, NFormItem, NButton, NInput, NSpace, NRadioGroup, NRadio, NCheckboxGroup, NCheckbox },
  props: {
    disabled: { type: Boolean, default: false },
  },
  emits: ['cancel', 'submit'],
  setup(props, ctx) {
    const ready = ref(false);
    const http = Http.getInstance();
    const tagItems = ref<TagItem[]>([]);
    const categoryItems = ref<CategoryItem[]>([]);
    const formRef = ref<FormInst | null>(null);
    const formItemPassword1Ref = ref<FormItemInst | null>(null);
    const formData = ref<FormData>(defaultFormData());
    const userStore = useUserStore();
    const formRule: FormRules = {
      name: [{ required: true, message: 'Can not be empty', trigger: ['input', 'blur'] }],
      tags: [{ required: true, type: 'array', message: 'Can not be empty', trigger: ['input', 'blur'] }],
      category: [{ required: true, message: 'Can not be empty', trigger: ['input', 'blur'] }],
    };
    const formSubmitting = ref(false);
    const message = useMessage();

    const handleSubmit = async () => {
      let name = formData.value.name;
      let tags = formData.value.tags.join(',');
      let category = formData.value.category;
      if (!userStore.user.id) {
        message.error('Please sign in first');
        return;
      }

      let url = '/mrchaiemc/addNewModel.do';
      let params = {
        custId: userStore.user.id,
        bussData: { modelName: name, modelSubName: tags, category1: category },
      } as any;

      formSubmitting.value = true;
      const resp = await http.postJSON({ url: url, data: params });
      formSubmitting.value = false;
      const modelId = resp.bussData?.modelId;
      if (!modelId) {
        message.warning('Failure');
        console.info(resp);
        return;
      }
      ctx.emit('submit', { modelId });
    };

    const init = async () => {
      ready.value = false;
      tagItems.value = tagItemOptions;
      categoryItems.value = categoryItemOptions;
      // set default
      formData.value.category = categoryItemOptions[0].val;

      ready.value = true;
    };

    onMounted(() => {
      init();
    });
    // watch(
    //   () => props.editId,
    //   (val) => {
    //     console.info('watch');
    //     init(val);
    //   },
    //   { immediate: true }
    // );

    return {
      ready,
      tagItems,
      categoryItems,
      formRef,
      formItemPassword1Ref,
      formData,
      formRule,
      formSubmitting,
      onPressReset() {
        formData.value = defaultFormData();
      },
      async onPressSubmit() {
        try {
          await formRef.value?.validate();
          handleSubmit();
        } catch (errors) {
          console.info(errors);
        }
      },
    };
  },
});
</script>
<style scoped></style>
