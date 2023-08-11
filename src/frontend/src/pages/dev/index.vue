<template>
  <NForm ref="formRef" :model="formData" :rules="formRule" :disabled="!ready || disabled">
    <NSpace vertical :wrap-item="false">
      <!-- @finish="(options:any) => handleUploadFinish(options, 'images')" -->
      <NFormItem path="images" label="Model Images">
        <NUpload
          multiple
          directory-dnd
          :max="6"
          list-type="image-card"
          :custom-request="(options: UploadCustomRequestOptions)=>handleUpload(options,'images')"
          @remove="(options:UploadRemoveOptions) => handleUploadRemove(options, 'images')"
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
          :max="1"
          style="max-width: 320px"
          :custom-request="(options: UploadCustomRequestOptions)=>handleUpload(options,'archive')"
          @remove="(options:UploadRemoveOptions) => handleUploadRemove(options, 'archive')"
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
      <NFormItem path="baseModel" label="Base Model">
        <NInput v-model:value="formData.baseModel" placeholder="Please enter something..." @keydown.enter.prevent />
      </NFormItem>
      <NFormItem path="floatingPoint" label="Floating Point">
        <NInput v-model:value="formData.floatingPoint" placeholder="Please enter something..." @keydown.enter.prevent />
      </NFormItem>
      <NFormItem path="modelSize" label="Model Size">
        <NInput v-model:value="formData.modelSize" placeholder="Please enter something..." @keydown.enter.prevent />
      </NFormItem>
      <NFormItem path="description" label="Description">
        <NInput
          v-model:value="formData.description"
          type="textarea"
          placeholder="Please enter something..."
          @keydown.enter.prevent
        />
      </NFormItem>
      <template v-if="!disabled">
        <NSpace justify="end" :size="[16, 0]">
          <NButton
            type="default"
            strong
            :disabled="!ready || formSubmitting"
            :loading="formSubmitting"
            @click.stop.prevent="onPressReset"
            >Reset</NButton
          >
          <NButton
            type="primary"
            strong
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
import { ref, defineComponent, onMounted, watch, nextTick } from 'vue';
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
  UploadCustomRequestOptions,
  NIcon,
  NText,
  NP,
} from 'naive-ui';
import type { UploadFileInfo } from 'naive-ui';
import { Http } from '@/tools/http';
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5';
import { Utils } from '@/tools/utils';
import { useUserStore } from '@/stores/user';
import { useMinio } from '@/composables/use-minio';
import { parametersWith } from '@/tools/exif';

type FormData = {
  images: string[];
  archive: string[];
  version: string;
  modelHashCode: string;
  baseModel: string;
  modelSize: string;
  floatingPoint: string;
  description: string;
};

function defaultFormData() {
  return {
    images: [],
    archive: [],
    version: '',
    modelHashCode: '',
    baseModel: '',
    modelSize: '',
    floatingPoint: '',
    description: '',
  };
}
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
    const imgUrl = ref('');
    const formRule: FormRules = {
      images: [{ required: true, type: 'array', message: 'Can not be empty', trigger: ['input', 'blur'] }],
      archive: [{ required: true, type: 'array', message: 'Can not be empty', trigger: ['input', 'blur'] }],
      version: [{ required: true, message: 'Can not be empty', trigger: ['input', 'blur'] }],
    };
    const formSubmitting = ref(false);
    const message = useMessage();
    const { upload } = useMinio();

    const handleUpload = async (params: UploadCustomRequestOptions, property: UploadProperties) => {
      const { file, data, headers, withCredentials, action, onFinish, onError, onProgress } = params;
      const parameters: string = await parametersWith(file.file as File);
      const resp = await upload({ file, onProgress: ({ progress }) => onProgress({ percent: (progress || 0) * 100 }) });
      if (resp._result !== 0) {
        onError();
        message.error(resp._desc || '');
        return;
      }
      onFinish();
      const url = resp.url || '';
      formData.value[property].push(url);
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
      if (!userStore.user?.id) {
        message.error('Please sign in first');
        return;
      }

      let modelId = props.modelId;
      let baseModel = formData.value.baseModel;
      let modelSize = formData.value.modelSize;
      let floatingPoint = formData.value.floatingPoint;
      let description = formData.value.description;

      let version = formData.value.version;
      let modelHashCode = formData.value.modelHashCode;
      let modelFileLinks = formData.value.archive.join(',');
      let sampleImgFileLinks = formData.value.images.join(',');

      let url = '/mrchaiemc/modModelDetailInfo.do';
      let params = {
        custId: userStore.user.id,
        bussData: {
          modelId,
          modelHashCode,
          baseModel,
          modelSize,
          floatingPoint,
          description,
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
      imgUrl,
      formRef,
      formItemPassword1Ref,
      formData,
      formRule,
      formSubmitting,
      handleUpload,
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
