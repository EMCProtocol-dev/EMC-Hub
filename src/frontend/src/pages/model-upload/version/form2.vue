<template>
  <NSpace align="center" justify="center" :wrap-item="false">
    <template v-if="!ready">
      <NSpace class="loading" align="center" justify="center" :wrap-item="false">
        <NSpin size="large" />
      </NSpace>
    </template>
    <NForm ref="formRef" :model="formData" :rules="formRule" :disabled="!ready || disabled" style="width: 100%">
      <NGrid :cols="24" :x-gap="24">
        <NFormItemGi :span="24" path="version" label="Model Version">
          <NInput v-model:value="formData.version" @keydown.enter.prevent />
        </NFormItemGi>
        <NFormItemGi :span="12" path="baseModel" label="Base Model">
          <NSelect
            v-model:value="formData.baseModel"
            :options="baseModelItems"
            label-field="label"
            value-field="val"
            placeholder="Please select..."
          />
        </NFormItemGi>
        <NFormItemGi :span="12" path="baseModelType" label="Base Model Type">
          <NSelect
            v-model:value="formData.baseModelType"
            :options="baseModelTypeItems"
            label-field="label"
            value-field="val"
            placeholder="Please select..."
          />
        </NFormItemGi>
        <NFormItemGi :span="24" path="triggerWords" label="Trigger Words">
          <NSelect v-model:value="formData.triggerWords" filterable multiple tag>
            <template #empty>
              <span>Please input...</span>
            </template>
          </NSelect>
        </NFormItemGi>
        <NFormItemGi :span="24" path="description" label="Version Description">
          <NInput type="textarea" v-model:value="formData.description" show-count maxlength="1000" />
        </NFormItemGi>
        <NFormItemGi :span="24" path="images" label="Preview Images">
          <NUpload
            v-model:file-list="formData.images"
            multiple
            directory-dnd
            action=""
            :max="6"
            list-type="image-card"
            :custom-request="handleUploadImage"
            @remove="handleUploadRemove"
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
        </NFormItemGi>
      </NGrid>
      <template v-if="!disabled">
        <NSpace justify="end" :size="[16, 0]">
          <NButton type="default" strong :disabled="!ready || formSubmitting" @click.stop.prevent="onPressPrev"
            >Prev</NButton
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
            <NButton
              type="primary"
              strong
              :disabled="!ready || formSubmitting"
              :loading="formSubmitting"
              @click.stop.prevent="onPressSubmit"
              >Save & Done</NButton
            >
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
    </NForm>
  </NSpace>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, watch } from 'vue';
import {
  NForm,
  NGrid,
  NSpin,
  NFormItemGi,
  NButton,
  NInput,
  NSpace,
  NSelect,
  FormInst,
  FormRules,
  FormItemRule,
  useMessage,
  NUpload,
  NUploadDragger,
  UploadCustomRequestOptions,
  NIcon,
  NText,
} from 'naive-ui';
import type { UploadFileInfo } from 'naive-ui';
import { Http } from '@/tools/http';
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5';
import { useUserStore } from '@/stores/user';
import { fileToSha256Hex } from '@/tools/file-sha256';
import { useMinio } from '@/composables/use-minio';
import * as StableDiffusionMetadata from '@/tools/stable-diffusion-metadata';
import { Utils } from '@/tools/utils';

type BasicOptionItem = {
  label: string;
  val: string;
};

type UploadFileParameter = {
  id: string;
  raw: string;
};

type FormData = {
  version: string;
  baseModel: string;
  baseModelType: string;
  triggerWords: string[];
  description: string;
  images: UploadFileInfo[];
  imagesParameters: UploadFileParameter[];
};

function defaultFormData() {
  return {
    version: '',
    baseModel: '',
    baseModelType: '',
    triggerWords: [],
    description: '',
    images: [],
    imagesParameters: [],
  };
}

type UploadRemoveOptions = { file: UploadFileInfo; fileList: Array<UploadFileInfo> };
type UploadFinishOptions = { file: UploadFileInfo; event?: ProgressEvent };

export default defineComponent({
  components: {
    NForm,
    NGrid,
    NSpin,
    NFormItemGi,
    NButton,
    NInput,
    NSpace,
    NSelect,
    NUpload,
    NUploadDragger,
    NIcon,
    NText,
    ArchiveIcon,
  },
  props: {
    mode: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    versionSn: { type: String, default: '-1' },
    modelSn: { type: String, default: '' },
  },
  emits: ['prev', 'submit', 'submitandreview'],
  setup(props, ctx) {
    const ready = ref(false);
    const http = Http.getInstance();
    const baseModelItems = ref<BasicOptionItem[]>([]);
    const baseModelTypeItems = ref<BasicOptionItem[]>([]);
    const formRef = ref<FormInst | null>(null);
    const formData = ref<FormData>(defaultFormData());
    const userStore = useUserStore();
    const uploadValidator = (rule: FormItemRule, value: UploadFileInfo[]) => {
      if (!value || !value.length) {
        return new Error('Can not be empty');
      } else {
        const errors = value.filter((item) => !item.url);
        if (errors.length > 0) {
          return new Error('Wait upload...');
        }
      }
      return true;
    };
    const formRule: FormRules = {
      version: [{ required: true, message: 'Can not be empty', trigger: ['input', 'blur'] }],
      baseModel: [{ required: true, message: 'Can not be empty', trigger: ['input', 'blur'] }],
      baseModelType: [{ required: true, message: 'Can not be empty', trigger: ['input', 'blur'] }],
      triggerWords: [{ required: false, type: 'array', message: 'Can not be empty', trigger: ['input', 'blur'] }],
      description: [{ required: false, validator: Utils.validatorStrLength(0, 1000), trigger: ['input', 'blur'] }],
      images: [{ required: true, type: 'array', validator: uploadValidator, trigger: ['input', 'blur'] }],
    };
    const formSubmitting = ref(false);
    const message = useMessage();
    const { upload, presignedHttp } = useMinio();

    const handleUploadImage = async (params: UploadCustomRequestOptions) => {
      const { file, headers, withCredentials, onFinish, onError, onProgress } = params;
      const fileHash = await fileToSha256Hex(file.file as File);
      if (!fileHash) {
        onError();
        message.error('file hash error');
        return;
      }
      //media=0
      const policyData = await presignedHttp({
        fileName: file.name,
        fileType: file.type || '',
        fileHash,
        fileSize: file.file?.size || 0,
        signType: 0,
        userId: userStore.user.id,
      });
      if (!policyData) {
        onError();
        message.error('presign error');
        return;
      }
      const resp = await upload({
        file,
        policyData,
        onProgress: ({ progress }) => onProgress({ percent: (progress || 0) * 100 }),
      });
      if (resp._result !== 0) {
        onError();
        message.error(resp._desc || '');
        return;
      }
      const url = resp.url || '';
      file.url = url;
      const [parameters, isParameters] = await StableDiffusionMetadata.extract(file.file as File);
      formData.value.imagesParameters.push({ id: file.id, raw: parameters });
      onFinish();
    };

    const handleUploadRemove = ({ file, fileList }: UploadRemoveOptions) => {
      const list: any[] = [];
      fileList.forEach((item) => {
        if (item.id === file.id) return;
        list.push(item.url);
      });
      formData.value.images = list;
    };

    const handleSubmit = async () => {
      let modelSn = props.modelSn;
      let versionSn = props.versionSn;
      let version = formData.value.version;
      let baseModel = formData.value.baseModel;
      let baseModelType = formData.value.baseModelType;
      let triggerWords = JSON.stringify(formData.value.triggerWords);
      let description = formData.value.description;
      let formattedImages: any[] = [];
      formData.value.images.forEach((item) => {
        formattedImages.push({ id: item.id, name: item.name, url: item.url });
      });
      let images = JSON.stringify(formattedImages);
      let imagesParameters: string = JSON.stringify(formData.value.imagesParameters);

      let url = '/emchub/api/client/modelVersion/saveOne';
      let params: any = {
        modelSn,
        modelVersion: version,
        baseModel,
        baseModelType,
        triggerArr: triggerWords,
        updateDescription: description,
        previewPicturesUrl: images,
        previewPicturesGenParams: imagesParameters,
      };
      if (versionSn !== '-1') {
        url = '/emchub/api/client/modelVersion/updateOne';
        params.versionSn = versionSn;
      }
      formSubmitting.value = true;
      const resp = await http.postJSON({ url: url, data: params });
      formSubmitting.value = false;
      return resp;
    };

    const handleReview = (versionSn: string) => {
      return http.post({
        url: '/emchub/api/client/modelVersion/submitAudit',
        data: { versionSn: versionSn },
      });
    };

    const initItems = (() => {
      let promise: Promise<void>;
      return () => {
        if (!promise) {
          promise = new Promise((resolve) => {
            baseModelItems.value = [
              { label: 'SD 1.4', val: 'SD 1.4' },
              { label: 'SD 1.5', val: 'SD 1.5' },
              { label: 'SD 2.0', val: 'SD 2.0' },
              { label: 'SD 2.0 768', val: 'SD 2.0 768' },
              { label: 'SD 2.1', val: 'SD 2.1' },
              { label: 'SD 2.1 768', val: 'SD 2.1 768' },
              { label: 'SD 2.1 Unclip', val: 'SD 2.1 Unclip' },
              { label: 'SDXL 0.9', val: 'SDXL 0.9' },
              { label: 'SDXL 1.0', val: 'SDXL 1.0' },
              { label: 'Other', val: 'Other' },
            ];
            baseModelTypeItems.value = [
              { label: 'Standard', val: 'Standard' },
              { label: 'Inpainting', val: 'Inpainting' },
              { label: 'Refiner', val: 'Refiner' },
              { label: 'Pix2Pix', val: 'Pix2Pix' },
            ];
            resolve();
          });
        }
        return promise;
      };
    })();

    const initFormData = async (versionSn: string) => {
      const resp = await http.get({
        url: '/emchub/api/client/modelVersion/queryOne',
        data: { versionSn },
      });
      if (resp._result !== 0 || !resp.data) {
        message.error('invalid model version sn');
        return;
      }
      const {
        modelVersion = '',
        baseModel = '',
        baseModelType = '',
        triggerArr = '[]',
        updateDescription = '',
        previewPicturesUrl = '[]',
        previewPicturesGenParams = '[]',
      } = resp.data || {};

      const images = Utils.parseJSON(previewPicturesUrl) || [];

      images.forEach((item: any) => {
        const urls = item.url.split('/');
        const fileName = urls[urls.length - 1];
        if (!item.id) {
          item.id = fileName;
        }
        if (!item.name) {
          item.name = fileName;
        }
        if (!item.status) {
          item.status = 'finished';
        }
      });

      const imagesParameters = Utils.parseJSON(previewPicturesGenParams) || [];

      formData.value = {
        version: modelVersion,
        baseModel: baseModel,
        baseModelType: baseModelType,
        triggerWords: Utils.parseJSON(triggerArr) || [],
        description: updateDescription,
        images,
        imagesParameters,
      };
    };

    const init = async (versionSn?: string) => {
      ready.value = false;
      await initItems();
      if (versionSn && versionSn !== '-1') {
        await initFormData(versionSn);
      }
      ready.value = true;
    };

    watch(
      () => props.versionSn,
      (val) => {
        init(val);
      },
      { immediate: true }
    );

    return {
      ready,
      formRef,
      baseModelItems,
      baseModelTypeItems,
      formData,
      formRule,
      formSubmitting,
      handleUploadImage,
      handleUploadRemove,
      onPressPrev() {
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
          const versionSn = resp.data?.versionSn;
          if (resp._result !== 0) {
            message.error(resp._desc);
            return;
          }
          if (!versionSn) {
            message.error('Not found version sn');
            return;
          }
          formSubmitting.value = true;
          const resp2 = await handleReview(versionSn);
          formSubmitting.value = false;
          if (resp2._result !== 0) {
            message.error(resp2._desc);
            return;
          }
          ctx.emit('submitandreview');
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
          const versionSn = resp.data?.versionSn;
          if (resp._result !== 0) {
            message.error(resp._desc);
            return;
          }
          if (resp._result !== 0) {
            message.warning(resp._desc);
            return;
          }
          if (!versionSn) {
            message.warning('Not found version sn');
            return;
          }
          ctx.emit('submit', { versionSn: versionSn as string });
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
