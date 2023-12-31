<template>
  <NSpace align="center" justify="center" :wrap-item="false">
    <template v-if="!ready">
      <NSpace class="loading" align="center" justify="center" :wrap-item="false">
        <NSpin size="large" />
      </NSpace>
    </template>
    <NForm ref="formRef" :model="formData" :rules="formRule" :disabled="!ready || disabled" style="width: 100%">
      <NGrid :cols="24" :x-gap="24">
        <NFormItemGi :span="24" path="modelType" label="Model Type">
          <NInput v-model:value="formData.modelType" disabled @keydown.enter.prevent />
        </NFormItemGi>
        <template v-if="formData.modelType === 'CHECKPOINT'">
          <NFormItemGi :span="12" path="floatingPoint" label="Floating Point">
            <NSelect
              v-model:value="formData.floatingPoint"
              :options="floatingPointItems"
              label-field="label"
              value-field="val"
            >
            </NSelect>
          </NFormItemGi>
          <NFormItemGi :span="12" path="modelSize" label="Model Size">
            <NSelect v-model:value="formData.modelSize" :options="modelSizeItems" label-field="label" value-field="val">
            </NSelect>
          </NFormItemGi>
        </template>
        <template v-else-if="formData.modelType === 'LORA'">
          <NFormItemGi :span="24" path="alias" label="Alias">
            <NInput v-model:value="formData.alias" @keydown.enter.prevent />
          </NFormItemGi>
        </template>
        <NFormItemGi :span="24" path="archive" label="Model Package">
          <NUpload
            v-model:file-list="formData.archive"
            multiple
            directory-dnd
            action=""
            :max="1"
            @before-upload="handleUploadBeforeArchive"
            :custom-request="handleUploadArchive"
            @remove="handleUploadRemove"
          >
            <NUploadDragger>
              <NSpace vertical :wrap-item="false" align="center" justify="center">
                <NIcon size="48" :depth="3">
                  <ArchiveIcon />
                </NIcon>
                <NText style="font-size: 14px">Click or drag model file</NText>
              </NSpace>
            </NUploadDragger>
          </NUpload>
          <template v-if="uploadLoadingArchive">
            <NSpace class="loading" vertical :wrap-item="false" align="center" justify="center">
              <NSpin size="large" />
            </NSpace>
          </template>
        </NFormItemGi>
        <NFormItemGi :span="12" path="hashCode" label="Hash Code(SHA256)">
          <NInput v-model:value="formData.hashCode" placeholder="-" disabled @keydown.enter.prevent />
        </NFormItemGi>
        <NFormItemGi :span="12" path="fileSize" label="File Size(KB)">
          <NInput v-model:value="formData.fileSize" placeholder="-" disabled @keydown.enter.prevent />
        </NFormItemGi>
      </NGrid>
      <template v-if="!disabled">
        <NSpace justify="end" :size="[16, 0]">
          <NButton
            type="default"
            strong
            :disabled="!ready || formSubmitting || uploadLoadingArchive"
            @click.stop.prevent="onPressPrev"
            >Prev</NButton
          >
          <!-- <NButton
            type="primary"
            strong
            :disabled="!ready || formSubmitting || uploadLoadingArchive"
            :loading="formSubmitting"
            @click.stop.prevent="onPressSubmit"
            >Save & Done</NButton
          > -->
          <NButton
            type="primary"
            strong
            :disabled="!ready || formSubmitting || uploadLoadingArchive"
            :loading="formSubmitting"
            @click.stop.prevent="onPressSubmitAndReview"
            >Save & Review</NButton
          >
        </NSpace>
      </template>
    </NForm>
  </NSpace>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, onUnmounted, watch } from 'vue';
import {
  NForm,
  NSpin,
  NGrid,
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
import { Utils } from '@/tools/utils';
import { useUserStore } from '@/stores/user';
import { fileToMD5, fileToSha256Hex } from '@/tools/file-sha256';
import { useMinio } from '@/composables/use-minio';

type BasicOptionItem = {
  label: string;
  val: string;
};

type FormData = {
  modelType: string;
  archive: UploadFileInfo[];
  alias: string;
  hashCode: string;
  fileSize: string;
  modelSize: string;
  floatingPoint: string;
};

function defaultFormData() {
  return {
    modelType: '',
    archive: [],
    alias: '',
    hashCode: '',
    fileSize: '',
    modelSize: '',
    floatingPoint: '',
  };
}

type UploadRemoveOptions = { file: UploadFileInfo; fileList: Array<UploadFileInfo> };
type UploadFileInfoArchive = UploadFileInfo & { hash?: string };
type UploadBeforeOptionsArchive = { file: UploadFileInfoArchive; fileList: UploadFileInfo[] };

export default defineComponent({
  components: {
    NForm,
    NGrid,
    NFormItemGi,
    NButton,
    NInput,
    NSpace,
    NSelect,
    NSpin,
    NUpload,
    NUploadDragger,
    NIcon,
    NText,
    ArchiveIcon,
  },
  props: {
    mode: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    modelSn: { type: String, default: '' },
    versionSn: { type: String, default: '' },
  },
  emits: ['prev', 'submit', 'submitandreview'],
  setup(props, ctx) {
    const ready = ref(false);
    const http = Http.getInstance();
    const floatingPointItems = ref<BasicOptionItem[]>([]);
    const modelSizeItems = ref<BasicOptionItem[]>([]);
    const formRef = ref<FormInst | null>(null);
    const formData = ref<FormData>(defaultFormData());
    const userStore = useUserStore();

    let uploadArchiveAbort: AbortController | null = null;

    const notBeEmptyValidatorWithModelType = (rule: FormItemRule, value: string) => {
      if (formData.value.modelType === 'CHECKPOINT' && !value) {
        return new Error('Can not be empty');
      } else if (formData.value.modelType === 'LORA' && !value) {
        return new Error('Can not be empty');
      }
      return true;
    };

    const uploadValidator = (rule: FormItemRule, value: UploadFileInfo[]) => {
      if (!value || !value.length) {
        return new Error('Can not be empty');
      } else {
        const errors: number[] = [];
        value.forEach((item, index) => {
          if (!item.url) {
            errors.push(index + 1);
          }
        });
        if (errors.length > 0) {
          return new Error(`Waiting to upload (${errors.join(',')})...`);
        }
      }
      return true;
    };

    const formRule: FormRules = {
      modelType: [{ required: true, message: 'Can not be empty', trigger: ['input', 'blur'] }],
      archive: [{ required: true, type: 'array', validator: uploadValidator, trigger: ['input', 'blur'] }],
      alias: [{ required: true, validator: notBeEmptyValidatorWithModelType, trigger: ['input', 'blur'] }],
      hashCode: [{ required: true, message: 'Can not be empty', trigger: ['input', 'blur'] }],
      modelSize: [{ required: true, validator: notBeEmptyValidatorWithModelType, trigger: ['input', 'blur'] }],
      floatingPoint: [{ required: true, validator: notBeEmptyValidatorWithModelType, trigger: ['input', 'blur'] }],
      fileSize: [{ required: true, message: 'Can not be empty', trigger: ['input', 'blur'] }],
    };
    const formSubmitting = ref(false);
    const message = useMessage();
    const uploadLoadingArchive = ref(false);
    const { upload, presignedHttp } = useMinio();

    const handleUploadBeforeArchive = async ({ file }: UploadBeforeOptionsArchive) => {
      if (uploadLoadingArchive.value) {
        return false;
      }
      uploadLoadingArchive.value = true;
      formData.value.hashCode = '';
      formData.value.fileSize = '';
      const fileHash = await fileToSha256Hex(file.file as File);
      uploadLoadingArchive.value = false;
      console.info('file hash ', fileHash);
      if (!fileHash) {
        message.error('file hash error');
        return false;
      }
      formData.value.hashCode = fileHash;
      formData.value.fileSize = String(file.file?.size);
      return true;
    };

    const handleUploadArchive = async (params: UploadCustomRequestOptions) => {
      const { headers, withCredentials, onFinish, onError, onProgress } = params;
      const file = params.file as UploadFileInfoArchive;
      if (!formData.value.hashCode) {
        onError();
        message.error('hash is empty');
        return;
      }
      const policyData = await presignedHttp({
        fileName: file.name,
        fileType: file.type || '',
        fileHash: formData.value.hashCode,
        fileSize: file.file?.size || 0,
        signType: 1,
        userId: userStore.user.id,
      });
      if (!policyData) {
        onError();
        message.error('presign error');
        return;
      }
      if (uploadArchiveAbort) {
        uploadArchiveAbort.abort();
        uploadArchiveAbort = null;
      }
      uploadArchiveAbort = new AbortController();
      const resp = await upload({
        file,
        policyData,
        onProgress: ({ progress }) => onProgress({ percent: (progress || 0) * 100 }),
        abortSignal: uploadArchiveAbort.signal,
      });
      if (uploadArchiveAbort) {
        uploadArchiveAbort = null;
      }
      if (resp._result === 0) {
        file.url = resp.sn;
        onFinish();
      } else {
        if (resp._result > 0) {
          console.error(resp._desc || '');
          message.error(resp._desc || '');
        } else if (resp._result < 0) {
          console.warn(resp._desc);
        }
        onError();
      }
    };

    const handleUploadRemove = ({ file, fileList }: UploadRemoveOptions) => {
      const list: any[] = [];
      fileList.forEach((item) => {
        if (item.id === file.id) return;
        list.push(item.url);
      });
      formData.value.archive = list;
      formData.value.hashCode = '';
      formData.value.fileSize = '';
      if (uploadArchiveAbort) {
        uploadArchiveAbort.abort();
      }
    };

    const handleSubmit = async () => {
      let versionSn = props.versionSn;
      let alias = formData.value.alias;
      let modelSize = formData.value.modelSize;
      let floatingPoint = formData.value.floatingPoint;
      let hashCode = formData.value.hashCode;
      let uploadArchive = formData.value.archive[0];
      let archive = { id: uploadArchive.id, name: uploadArchive.name, url: uploadArchive.url };

      let url = '/emchub/api/client/modelVersion/updateOne';
      let params = {
        versionSn,
        alias,
        modelSize,
        floatingPoint,
        hashCodeSha256: hashCode,
        modelFileUrl: JSON.stringify(archive),
      };

      formSubmitting.value = true;
      const resp = await http.postJSON({ url: url, data: params });
      formSubmitting.value = false;
      return resp;
    };

    const handleReview = async () => {
      if (props.mode === 'add') {
        const [resp1, resp2] = await Promise.all([
          http.post({
            url: '/emchub/api/client/modelInfo/submitAudit',
            data: { modelSn: props.modelSn },
          }),
          http.post({
            url: '/emchub/api/client/modelVersion/submitAudit',
            data: { versionSn: props.versionSn },
          }),
        ]);
        if (resp1._result !== 0) {
          return resp1;
        }
        if (resp2._result !== 0) {
          return resp2;
        }
        return resp2;
      } else {
        return http.post({
          url: '/emchub/api/client/modelVersion/submitAudit',
          data: { versionSn: props.versionSn },
        });
      }
    };

    const initItems = (() => {
      let promise: Promise<void>;
      return () => {
        if (!promise) {
          promise = new Promise((resolve) => {
            floatingPointItems.value = [
              { label: 'fp16', val: 'fp16' },
              { label: 'fp32', val: 'fp32' },
            ];
            modelSizeItems.value = [
              { label: 'Full', val: 'Full' },
              { label: 'Pruned', val: 'Pruned' },
            ];
            resolve();
          });
        }
        return promise;
      };
    })();

    const initModel = async (modelSn: string) => {
      const resp = await http.get({
        url: '/emchub/api/client/modelInfo/queryOne',
        data: { modelSn },
      });
      if (resp._result !== 0) {
        message.error('invalid model sn');
        return;
      }
      const { type = '' } = resp.data || {};
      formData.value.modelType = type;
    };

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
        floatingPoint = '',
        alias = '',
        fileSize = 0,
        hashCodeSha256 = '',
        modelFileUrl = '{}',
        modelSize = '',
      } = resp.data || {};

      const archive = Utils.parseJSON(modelFileUrl) || null;

      formData.value = {
        modelType: formData.value.modelType,
        alias: alias,
        hashCode: hashCodeSha256,
        fileSize: !fileSize ? '' : String(fileSize),
        modelSize: modelSize,
        floatingPoint: floatingPoint,
        archive: archive ? [archive] : [],
      };
    };

    const init = async (modelSn: string, versionSn: string) => {
      ready.value = false;
      await initItems();
      await initModel(modelSn);
      await initFormData(versionSn);
      ready.value = true;
    };

    watch(
      () => [props.modelSn, props.versionSn],
      ([modelSn, versionSn]) => {
        init(modelSn, versionSn);
      },
      { immediate: true }
    );

    onUnmounted(() => {
      if (uploadArchiveAbort) {
        uploadArchiveAbort.abort();
        uploadArchiveAbort = null;
      }
    });

    return {
      ready,
      formRef,
      floatingPointItems,
      modelSizeItems,
      formData,
      formRule,
      formSubmitting,
      uploadLoadingArchive,
      handleUploadBeforeArchive,
      handleUploadArchive,
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
          const resp2 = await handleReview();
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
          if (resp._result !== 0) {
            message.error(resp._desc);
            return;
          }
          ctx.emit('submit');
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
