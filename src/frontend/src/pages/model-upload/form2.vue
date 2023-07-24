<template>
  <NForm ref="formRef" :model="formData" :rules="formRule" :disabled="!ready || disabled">
    <NSpace vertical :wrap-item="false">
      <NFormItem path="images" label="Model Images">
        <NUpload
          multiple
          directory-dnd
          action="https://api.emchub.ai/mrchaiemc/fileUpload.do"
          :max="6"
          list-type="image-card"
          @finish="(options) => handleUploadFinish(options, 'images')"
          @remove="(options) => handleUploadRemove(options, 'images')"
        >
          <NUploadDragger style="max-width: 320px">
            <NSpace vertical :wrap-item="false" align="center" justify="center">
              <NIcon size="32" :depth="3">
                <ArchiveIcon />
              </NIcon>
              <NText style="font-size: 12px">Click or drag images</NText>
            </NSpace>
          </NUploadDragger>
        </NUpload>
      </NFormItem>
      <NFormItem path="archive" label="Model Package">
        <NUpload
          multiple
          directory-dnd
          action="https://api.emchub.ai/mrchaiemc/fileUpload.do"
          :max="1"
          style="max-width: 320px"
          @finish="(options) => handleUploadFinish(options, 'archive')"
          @remove="(options) => handleUploadRemove(options, 'archive')"
        >
          <NUploadDragger style="max-width: 320px">
            <NSpace vertical :wrap-item="false" align="center" justify="center">
              <NIcon size="48" :depth="3">
                <ArchiveIcon />
              </NIcon>
              <NText style="font-size: 12px">Click or drag package</NText>
            </NSpace>
          </NUploadDragger>
        </NUpload>
      </NFormItem>

      <NFormItem path="version" label="Model Version">
        <NInput v-model:value="formData.version" placeholder="Please enter something..." @keydown.enter.prevent />
      </NFormItem>
      <NFormItem path="modelHashCode" label="Model Hash Code">
        <NInput v-model:value="formData.modelHashCode" placeholder="Please enter something..." @keydown.enter.prevent />
      </NFormItem>
      <NFormItem path="guideLink" label="Guide Link">
        <NInput v-model:value="formData.guideLink" placeholder="Please enter something..." @keydown.enter.prevent />
      </NFormItem>
      <NFormItem path="paramsGuideLink" label="Guide Link Params">
        <NInput
          v-model:value="formData.paramsGuideLink"
          placeholder="Please enter something..."
          @keydown.enter.prevent
        />
      </NFormItem>
      <NFormItem path="invokeGuide" label="Invoke Guide">
        <NInput v-model:value="formData.invokeGuide" placeholder="Please enter something..." @keydown.enter.prevent />
      </NFormItem>
      <NFormItem path="positivePrompt" label="Positive Promts">
        <NInput
          v-model:value="formData.positivePrompt"
          placeholder="Please enter something..."
          @keydown.enter.prevent
        />
      </NFormItem>
      <NFormItem path="negativePrompt" label="Negative Promts">
        <NInput
          v-model:value="formData.negativePrompt"
          placeholder="Please enter something..."
          @keydown.enter.prevent
        />
      </NFormItem>
      <NFormItem path="enhancePrompt" label="Enhance Promts">
        <NInput v-model:value="formData.enhancePrompt" placeholder="Please enter something..." @keydown.enter.prevent />
      </NFormItem>
      <NFormItem path="numInferenceSteps" label="Inference Steps Number">
        <NInput
          v-model:value="formData.numInferenceSteps"
          placeholder="Please enter something..."
          @keydown.enter.prevent
        />
      </NFormItem>
      <NFormItem path="seed" label="Seed">
        <NInput v-model:value="formData.seed" placeholder="Please enter something..." @keydown.enter.prevent />
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
  NUpload,
  NUploadDragger,
  NIcon,
  NText,
  NP,
} from 'naive-ui';
import type { UploadFileInfo } from 'naive-ui';
import { Http } from '@/tools/http';
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5';
import { Utils } from '@/tools/utils';
import { useUserStore } from '@/stores/user';

type FormData = {
  images: string[];
  archive: string[];
  version: string;
  modelHashCode: string;
  guideLink: string;
  paramsGuideLink: string;
  sampleCodeLink: string;
  invokeGuide: string;
  positivePrompt: string;
  negativePrompt: string;
  enhancePrompt: string;
  numInferenceSteps: string;
  seed: string;
};

function defaultFormData() {
  return {
    images: [],
    archive: [],
    version: '',
    modelHashCode: '',
    guideLink: '',
    paramsGuideLink: '',
    sampleCodeLink: '',
    invokeGuide: '',
    positivePrompt: '',
    negativePrompt: '',
    enhancePrompt: '',
    numInferenceSteps: '',
    seed: '-1',
  };
}
type UploadFinishOptions = { file: UploadFileInfo; event?: ProgressEvent };
type UploadRemoveOptions = { file: UploadFileInfo; fileList: Array<UploadFileInfo> };
type UploadProperties = 'images' | 'archive';
export default defineComponent({
  components: {
    NForm,
    NFormItem,
    NButton,
    NInput,
    NSpace,
    NRadioGroup,
    NRadio,
    NCheckboxGroup,
    NCheckbox,
    NUpload,
    NUploadDragger,
    NIcon,
    NText,
    NP,
    ArchiveIcon,
  },
  props: {
    disabled: { type: Boolean, default: false },
    modelId: { type: String, default: '' },
  },
  emits: ['cancel', 'submit'],
  setup(props, ctx) {
    const ready = ref(false);
    const http = Http.getInstance();
    const formRef = ref<FormInst | null>(null);
    const formItemPassword1Ref = ref<FormItemInst | null>(null);
    const formData = ref<FormData>(defaultFormData());
    const userStore = useUserStore();
    const formRule: FormRules = {
      images: [{ required: true, type: 'array', message: 'Can not be empty', trigger: ['input', 'blur'] }],
      archive: [{ required: true, type: 'array', message: 'Can not be empty', trigger: ['input', 'blur'] }],
      version: [{ required: true, message: 'Can not be empty', trigger: ['input', 'blur'] }],
    };
    const formSubmitting = ref(false);
    const message = useMessage();

    const handleUploadFinish = ({ file, event }: UploadFinishOptions, property: UploadProperties) => {
      const resp = Utils.parseJSON((event?.target as XMLHttpRequest).response) || {};
      const url = resp?.bussData?.file_link as string;
      file.url = url;
      formData.value[property].push(url);
      return file;
    };

    const handleUploadRemove = ({ file, fileList }: UploadRemoveOptions, property: UploadProperties) => {
      const list: any[] = [];
      fileList.forEach((item) => {
        if (item.id === file.id) return;
        list.push(item.url);
      });
      formData.value[property] = list;
    };

    const handleSubmit = async () => {
      if (!userStore.user.id) {
        message.error('Please sign in first');
        return;
      }

      let modelId = props.modelId;

      let modelHashCode = formData.value.modelHashCode;
      let guideLink = formData.value.guideLink;
      let paramsGuideLink = formData.value.paramsGuideLink;
      let sampleCodeLink = formData.value.sampleCodeLink;
      let invokeGuide = formData.value.invokeGuide;
      let positivePrompt = formData.value.positivePrompt;
      let negativePrompt = formData.value.negativePrompt;
      let enhancePrompt = formData.value.enhancePrompt;
      let numInferenceSteps = formData.value.numInferenceSteps;

      let seed = formData.value.seed;
      let version = formData.value.version;

      let modelFileLinks = formData.value.archive.join(',');
      let sampleImgFileLinks = formData.value.images.join(',');

      let url = 'https://api.emchub.ai/mrchaiemc/modModelDetailInfo.do';
      let params = {
        custId: userStore.user.id,
        bussData: {
          modelId,
          modelHashCode,
          guideLink,
          paramsGuideLink,
          sampleCodeLink,
          invokeGuide,
          positivePrompt,
          negativePrompt,
          enhancePrompt,
          numInferenceSteps,
          seed,
          version,
          modelFileLinks,
          sampleImgFileLinks,
        },
      };

      formSubmitting.value = true;
      const resp = await http.postJSON({ url: url, data: params });
      formSubmitting.value = false;
      if (resp.resultCode !== 'SUCCESS') {
        message.warning('Failure');
        return;
      }
      ctx.emit('submit', params);
    };

    const init = async () => {
      ready.value = false;

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
      formRef,
      formItemPassword1Ref,
      formData,
      formRule,
      formSubmitting,
      handleUploadFinish,
      handleUploadRemove,
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
