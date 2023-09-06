<template>
  <NSpace align="center" justify="center" :wrap-item="false">
    <template v-if="!ready">
      <NSpace class="loading" align="center" justify="center" :wrap-item="false">
        <NSpin size="large" />
      </NSpace>
    </template>
    <NForm ref="formRef" :model="formData" :rules="formRule" :disabled="!ready || disabled" style="width: 100%">
      <NSpace vertical>
        <NFormItem path="name" label="Name">
          <NInput v-model:value="formData.name" placeholder="Model name" @keydown.enter.prevent />
        </NFormItem>
        <NFormItem path="type" label="Type">
          <NSelect
            v-model:value="formData.type"
            :options="typeItems"
            label-field="label"
            value-field="val"
            placeholder="Please select..."
          />
        </NFormItem>
        <NFormItem path="category" label="Category">
          <NSelect
            v-model:value="formData.category"
            :options="categoryItems"
            label-field="label"
            value-field="val"
            placeholder="Please select..."
          />
        </NFormItem>
        <NFormItem path="tags" label="Tags">
          <NSelect
            v-model:value="formData.tags"
            :options="tagItems"
            clearable
            filterable
            multiple
            tag
            label-field="label"
            value-field="val"
            placeholder="Please select..."
          />
        </NFormItem>
        <NFormItem path="description" label="Description">
          <NInput
            type="textarea"
            v-model:value="formData.description"
            maxlength="1000"
            show-count
            placeholder="About model"
            @keydown.enter.prevent
          />
        </NFormItem>
        <template v-if="!disabled">
          <NSpace justify="end" :size="[16, 0]">
            <NButton type="default" strong :disabled="!ready || formSubmitting" @click.stop.prevent="onPressCancel"
              >Cancel</NButton
            >
            <template v-if="mode === 'add'">
              <NButton
                type="primary"
                strong
                :disabled="!ready || formSubmitting"
                :loading="formSubmitting"
                @click.stop.prevent="onPressSubmit"
                >Next</NButton
              >
            </template>
            <template v-else>
              <!-- <NButton
                type="primary"
                strong
                :disabled="!ready || formSubmitting"
                :loading="formSubmitting"
                @click.stop.prevent="onPressSubmit"
                >Save & Done</NButton
              > -->
              <NButton
                type="primary"
                strong
                :disabled="!ready || formSubmitting"
                :loading="formSubmitting"
                @click.stop.prevent="onPressSubmitAndReview"
                >Save & Review</NButton
              >
            </template>
          </NSpace>
        </template>
      </NSpace>
    </NForm>
  </NSpace>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, watch } from 'vue';
import { NSpace, NSpin, NForm, NFormItem, NButton, NInput, NSelect, FormInst, FormRules, useMessage } from 'naive-ui';
import { Http } from '@/tools/http';
import { Utils } from '@/tools/utils';
import { useUserStore } from '@/stores/user';
type FormData = {
  name: string;
  type: string;
  category: string;
  tags: string[];
  description: string;
};

function defaultFormData() {
  return {
    name: '',
    type: '',
    category: '',
    tags: [],
    description: '',
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

type TypeItem = {
  label: string;
  val: string;
};

const tagItemOptions = [
  { val: 'PERSON', label: 'PERSON' },
  { val: 'WEDDING', label: 'WEDDING' },
  { val: 'WOMEN', label: 'WOMEN' },
  { val: 'HIGHLY', label: 'HIGHLY' },
  { val: 'DETAILED', label: 'DETAILED' },
  { val: 'CHARACTER', label: 'CHARACTER' },
  { val: 'ANIME', label: 'ANIME' },
  { val: 'GIRL', label: 'GIRL' },
  { val: 'BACKGROUND', label: 'BACKGROUND' },
  { val: 'CONCEPT', label: 'CONCEPT' },
  { val: 'OBJECTS', label: 'OBJECTS' },
  { val: 'PHOTOREALISTIC', label: 'PHOTOREALISTIC' },
  { val: 'SURREALISM', label: 'SURREALISM' },
  { val: 'DIGITAL', label: 'DIGITAL' },
  { val: 'FOOD', label: 'FOOD' },
  { val: 'BUILDINGS', label: 'BUILDINGS' },
  { val: 'LANDSCAPES', label: 'LANDSCAPES' },
  { val: '3D', label: '3D' },
  { val: 'ARCHITECTURE', label: 'ARCHITECTURE' },
  { val: 'VEHICLE', label: 'VEHICLE' },
  { val: 'CAR', label: 'CAR' },
  { val: 'FANTASY', label: 'FANTASY' },
  { val: 'MIDJOURNEY', label: 'MIDJOURNEY' },
  { val: 'CARTOON', label: 'CARTOON' },
  { val: 'PORTRAIT', label: 'PORTRAIT' },
  { val: 'NATURE', label: 'NATURE' },
  { val: 'ANIMALS', label: 'ANIMALS' },
  { val: 'ABSTRACT', label: 'ABSTRACT' },
  { val: 'TECHNOLOGY', label: 'TECHNOLOGY' },
  { val: 'FASHION', label: 'FASHION' },
  { val: 'ART', label: 'ART' },
  { val: 'VINTAGE', label: 'VINTAGE' },
  { val: 'TEXTURE', label: 'TEXTURE' },
  { val: 'ASTRONOMY', label: 'ASTRONOMY' },
  { val: 'UNDERWATER', label: 'UNDERWATER' },
  { val: 'MEDICAL', label: 'MEDICAL' },
  { val: 'CELEBRITIES', label: 'CELEBRITIES' },
  { val: 'SPORTS', label: 'SPORTS' },
  { val: 'HOLIDAYS', label: 'HOLIDAYS' },
  { val: 'MUSIC', label: 'MUSIC' },
  { val: 'FUTURISTIC', label: 'FUTURISTIC' },
  { val: 'LANDMARKS', label: 'LANDMARKS' },
  { val: 'WILDLIFE', label: 'WILDLIFE' },
  { val: 'SURREAL', label: 'SURREAL' },
  { val: 'CITIES', label: 'CITIES' },
  { val: 'TRAVEL', label: 'TRAVEL' },
  { val: 'SPACE', label: 'SPACE' },
];

const categoryItemOptions = [
  { label: 'character', val: 'character' },
  { label: 'style', val: 'style' },
  { label: 'celebrity', val: 'celebrity' },
  { label: 'concept', val: 'concept' },
  { label: 'clothing', val: 'clothing' },
  { label: 'base model', val: 'base model' },
  { label: 'poses', val: 'poses' },
  { label: 'background', val: 'background' },
  { label: 'buildings', val: 'buildings' },
  { label: 'tool', val: 'tool' },
  { label: 'vehicle', val: 'vehicle' },
  { label: 'objects', val: 'objects' },
  { label: 'animal', val: 'animal' },
  { label: 'action', val: 'action' },
  { label: 'assets', val: 'assets' },
];

const typeItemsOptions = [
  { val: 'CHECKPOINT', label: 'CHECKPOINT' },
  { val: 'LORA', label: 'LORA' },
];

export default defineComponent({
  components: { NSpace, NSpin, NForm, NFormItem, NButton, NInput, NSelect },
  props: {
    mode: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    modelSn: { type: String, default: '-1' },
  },
  emits: ['prev', 'submit', 'submitandreview'],
  setup(props, ctx) {
    const ready = ref(false);
    const http = Http.getInstance();
    const tagItems = ref<TagItem[]>([]);
    const typeItems = ref<TypeItem[]>([]);
    const categoryItems = ref<CategoryItem[]>([]);
    const formRef = ref<FormInst | null>(null);
    const formData = ref<FormData>(defaultFormData());
    const userStore = useUserStore();
    const formRule: FormRules = {
      name: [{ required: true, message: 'Can not be empty', trigger: ['input', 'blur'] }],
      type: [{ required: true, message: 'Can not be empty', trigger: ['input', 'blur'] }],
      category: [{ required: true, message: 'Can not be empty', trigger: ['input', 'blur'] }],
      tags: [{ required: true, type: 'array', message: 'Can not be empty', trigger: ['input', 'blur'] }],
      description: [{ required: true, validator: Utils.validatorStrLength(0, 1000), trigger: ['input', 'blur'] }],
    };
    const formSubmitting = ref(false);
    const message = useMessage();

    const initItems = (() => {
      let promise: Promise<void>;
      return () => {
        if (!promise) {
          promise = new Promise((resolve) => {
            const tagmap = {};
            tagItemOptions.forEach((i) => {
              if (!tagmap[i.val]) {
                tagmap[i.val] = 1;
              } else {
                tagmap[i.val]++;
              }
            });
            typeItems.value = typeItemsOptions.map((item) => ({
              label: item.label.toLocaleUpperCase(),
              val: item.val.toLocaleUpperCase(),
            }));
            categoryItems.value = categoryItemOptions.map((item) => ({
              label: item.label.toLocaleUpperCase(),
              val: item.val.toLocaleUpperCase(),
            }));
            tagItems.value = tagItemOptions.map((item) => ({
              label: item.label.toLocaleUpperCase(),
              val: item.val.toLocaleUpperCase(),
            }));

            // set default
            formData.value.type = typeItems.value[0].val;
            formData.value.category = categoryItems.value[0].val;
            resolve();
          });
        }
        return promise;
      };
    })();

    const initFormData = async (modelSn: string) => {
      const resp = await http.get({
        url: '/emchub/api/client/modelInfo/queryOne',
        data: { modelSn },
      });
      if (resp._result !== 0) {
        message.error('invalid model sn');
        return;
      }
      const { modelName = '', type = '', category = '', tags = '', description = '' } = resp.data || {};
      formData.value = {
        name: modelName,
        type,
        category,
        tags: tags ? tags.split(',') : [],
        description,
      };
    };

    const init = async (modelSn?: string) => {
      ready.value = false;
      await initItems();
      if (modelSn && modelSn !== '-1') {
        await initFormData(modelSn);
      }
      ready.value = true;
    };

    const handleSubmit = async () => {
      let name = formData.value.name;
      let type = formData.value.type;
      let category = formData.value.category;
      let tags = formData.value.tags.join(',');
      let description = formData.value.description;

      let url = '/emchub/api/client/modelInfo/saveOne';
      let params: any = { modelName: name, type, category, tags, description };

      if (props.modelSn && props.modelSn !== '-1') {
        url = '/emchub/api/client/modelInfo/updateOne';
        params.modelSn = props.modelSn;
      }
      const resp = await http.postJSON({ url: url, data: params });
      return resp;
    };

    const handleReview = async (modelSn: string) => {
      const resp = await http.post({
        url: '/emchub/api/client/modelInfo/submitAudit',
        data: { modelSn },
      });
      return resp;
    };

    watch(
      () => props.modelSn,
      (val) => {
        init(val);
      },
      { immediate: true }
    );

    return {
      ready,
      typeItems,
      categoryItems,
      tagItems,
      formRef,
      formData,
      formRule,
      formSubmitting,
      onPressCancel() {
        ctx.emit('prev');
      },
      async onPressSubmitAndReview() {
        if (!userStore.user.id) {
          message.error('Please sign in first');
          return;
        }
        try {
          await formRef.value?.validate();
          formSubmitting.value = true;
          const resp = await handleSubmit();
          formSubmitting.value = false;
          const modelSn = resp.data?.modelSn;
          if (resp._result !== 0) {
            message.error(resp._desc);
            return;
          }
          if (!modelSn) {
            message.error('Not found model sn');
            return;
          }
          formSubmitting.value = true;
          const resp2 = await handleReview(modelSn);
          formSubmitting.value = false;
          if (resp2._result !== 0) {
            message.error(resp2._desc);
            return;
          }
          ctx.emit('submitandreview', { modelSn });
        } catch (errors) {
          console.info(errors);
        }
      },
      async onPressSubmit() {
        if (!userStore.user.id) {
          message.error('Please sign in first');
          return;
        }
        try {
          await formRef.value?.validate();
          formSubmitting.value = true;
          const resp = await handleSubmit();
          formSubmitting.value = false;
          if (resp._result !== 0) {
            message.error(resp._desc);
            return;
          }
          const modelSn = resp.data?.modelSn;
          ctx.emit('submit', { modelSn });
        } catch (errors) {
          console.info(errors);
        }
      },
    };
  },
});
</script>
<style scoped>
.loading {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
