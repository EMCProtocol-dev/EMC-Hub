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
          :custom-request="handleUploadImage"
          @remove="(options:any) => handleUploadRemove(options, 'images')"
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
      <!--    @finish="(options:any) => handleUploadFinish(options, 'archive')" -->
      <NFormItem path="archive" label="Model Package">
        <NUpload
          multiple
          directory-dnd
          action="https://api.emchub.ai/mrchaiemc/fileUpload.do"
          :max="1"
          style="max-width: 320px"
          @before-upload="handleUploadBeforeArchive"
          :custom-request="handleUploadArchive"
          @remove="(options:any) => handleUploadRemove(options, 'archive')"
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
        <template v-if="uploadLoadingArchive">
          <NSpace class="upload-loading" vertical :wrap-item="false" align="center" justify="center">
            <NSpin size="large" />
          </NSpace>
        </template>
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
      <NFormItem path="positivePromts" label="Positive Promts">
        <NInput
          v-model:value="formData.positivePromts"
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
      <NFormItem path="enhancePromt" label="Enhance Promts">
        <NInput v-model:value="formData.enhancePromt" placeholder="Please enter something..." @keydown.enter.prevent />
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
  NSpin,
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
<<<<<<< HEAD
=======
import { useUserStore } from '@/stores/user';
import { fileToMD5, fileToSha256Hex, fileToSha256Hex2 } from '@/tools/file-sha256';
import { useMinio } from '@/composables/use-minio';
import { parametersWith } from '@/tools/exif';
import { sign } from '@/tools/open-api';

type ImageItem = {
  url: string;
  parameters: string;
};

type ArchiveItem = {
  url: string;
  sn: string;
};
>>>>>>> 8b84a8c (~)

type FormData = {
  images: ImageItem[];
  archive: ArchiveItem[];
  version: string;
  modelHashCode: string;
  guideLink: string;
  paramsGuideLink: string;
  sampleCodeLink: string;
  invokeGuide: string;
  positivePromts: string;
  negativePrompt: string;
  enhancePromt: string;
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
    positivePromts: '',
    negativePrompt: '',
    enhancePromt: '',
    numInferenceSteps: '',
    seed: '-1',
  };
}

type PresignOptions = {
  fileName: string;
  fileType: string;
  fileHash: string;
  fileSize: number;
  signType: number;
  userId: string | number;
};
type UploadFinishOptions = { file: UploadFileInfo; event?: ProgressEvent };
type UploadRemoveOptions = { file: UploadFileInfo; fileList: Array<UploadFileInfo> };
type UploadProperties = 'images' | 'archive';
type UploadFileInfoArchive = UploadFileInfo & { hash?: string };
type UploadBeforeOptionsArchive = { file: UploadFileInfoArchive; fileList: UploadFileInfo[] };
export default defineComponent({
  components: {
    NForm,
    NFormItem,
    NButton,
    NInput,
    NSpace,
    NRadioGroup,
    NRadio,
    NSpin,
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

    const formRule: FormRules = {
      images: [{ required: true, type: 'array', message: 'Can not be empty', trigger: ['input', 'blur'] }],
      archive: [{ required: true, type: 'array', message: 'Can not be empty', trigger: ['input', 'blur'] }],
      version: [{ required: true, message: 'Can not be empty', trigger: ['input', 'blur'] }],
    };
    const formSubmitting = ref(false);
    const message = useMessage();
    const uploadLoadingArchive = ref(false);
    const { upload } = useMinio();

    // const handleUploadFinish = ({ file, event }: UploadFinishOptions, property: UploadProperties) => {
    //   const resp = Utils.parseJSON((event?.target as XMLHttpRequest).response) || {};
    //   const url = resp?.bussData?.file_link as string;
    //   file.url = url;
    //   formData.value[property].push({url});
    //   return file;
    // };

    const handlePresignUpload = async (params: PresignOptions) => {
      const appid = 'emc-hub-a63123cf';
      const secret = '9c4283f0-3509-11ee-8d81-06c27dd31a5a';
      const nonce = new Date().getTime();
      const action = 'sign';
      const { fileName, fileType, fileHash, fileSize, signType, userId } = params;
      const body = {
        fileName: fileName,
        userId: userId,
        fileContentType: fileType,
        fileHash: fileHash,
        size: fileSize,
        type: signType,
      };
      const signParams: any = { appid, nonce, action, requestBody: JSON.stringify(body) };
      signParams.sign = sign(signParams, secret);
      const { _result, data } = await http.postJSON({
        url: `https://upload.emchub.ai/emc/api/client/userUpload/${action}`,
        data: signParams,
      });
      if (_result !== 0) {
        return null;
      }
      return {
        postURL: data.postURL,
        postFormData: data.postFormData,
        doneURL: data.doneURL,
        doneBody: data.doneBody,
      };
    };

    const handleUploadImage = async (params: UploadCustomRequestOptions) => {
      const { file, headers, withCredentials, onFinish, onError, onProgress } = params;
      const fileHash = await fileToMD5(file.file as File);
      if (!fileHash) {
        onError();
        message.error('file hash error');
        return;
      }
      //media=0
      const policyData = await handlePresignUpload({
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
      onFinish();
      const url = resp.url || '';
      const parameters: string = await parametersWith(file.file as File);
      formData.value.images.push({ url, parameters });
    };

    const handleUploadBeforeArchive = async ({ file }: UploadBeforeOptionsArchive) => {
      if (uploadLoadingArchive.value) {
        return false;
      }
      uploadLoadingArchive.value = true;
<<<<<<< HEAD
      //const fileHash = '123';
=======
>>>>>>> 6eef811 (~)
      const fileHash = await fileToSha256Hex(file.file as File);
      uploadLoadingArchive.value = false;
      console.info('file hash ', fileHash);
      if (!fileHash) {
        message.error('file hash error');
        return false;
      }
      file.id = `${file.id}-${fileHash}`;
      return true;
    };

    const handleUploadArchive = async (params: UploadCustomRequestOptions) => {
      const { headers, withCredentials, onFinish, onError, onProgress } = params;
      const file = params.file as UploadFileInfoArchive;
      const fileHash = file.id.split('-')[1];
      if (!fileHash) {
        onError();
        message.error('hash is empty');
        return;
      }
      const policyData = await handlePresignUpload({
        fileName: file.name,
        fileType: file.type || '',
        fileHash: fileHash || '',
        fileSize: file.file?.size || 0,
        signType: 1,
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
        console.error(resp._desc || '');
        message.error(resp._desc || '');
        return;
      }
      onFinish();
      const url = resp.url || '';
      const sn = resp.sn || '';
      formData.value.archive.push({ url, sn });
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
      let modelId = props.modelId;

      let modelHashCode = formData.value.modelHashCode;
<<<<<<< HEAD
      let guideLink = formData.value.guideLink;
      let paramsGuideLink = formData.value.paramsGuideLink;
      let sampleCodeLink = formData.value.sampleCodeLink;
      let invokeGuide = formData.value.invokeGuide;
      let positivePromts = formData.value.positivePromts;
      let negativePrompt = formData.value.negativePrompt;
      let enhancePromt = formData.value.enhancePromt;
      let numInferenceSteps = formData.value.numInferenceSteps;

      let seed = formData.value.seed;
      let version = formData.value.version;

      let modelFileLinks = formData.value.archive.join(',');
      let sampleImgFileLinks = formData.value.images.join(',');

=======
      let modelFileLinks = formData.value.archive.map((item: ArchiveItem) => item.url).join(',');
      let sampleImgFileLinks = formData.value.images.map((item: ImageItem) => item.url).join(',');
      let images = JSON.stringify(formData.value.images);
      let archive = formData.value.archive.length > 0 ? JSON.stringify(formData.value.archive[0]) : '';
>>>>>>> 8b84a8c (~)
      let url = '/mrchaiemc/modModelDetailInfo.do';
      let params = {
        custId: '1690226134332',
        bussData: {
          modelId,
          modelHashCode,
          guideLink,
          paramsGuideLink,
          sampleCodeLink,
          invokeGuide,
          positivePromts,
          negativePrompt,
          enhancePromt,
          numInferenceSteps,
          seed,
          version,
          modelFileLinks,
          sampleImgFileLinks,
          images,
          archive,
        },
      };

      formSubmitting.value = true;
      const resp = await http.postJSON({ url: url, data: params });
      formSubmitting.value = false;
      if (resp.resultCode !== 'SUCCESS') {
        message.warning('Failure');
        return;
      }
      // temp
      formSubmitting.value = true;
      const resp2 = await http.postJSON({
        url: '/mrchaiemc/submitModel.do',
        data: { custId: userStore.user.id, bussData: { modelId } },
      });
      formSubmitting.value = false;
      if (resp2.resultCode !== 'SUCCESS') {
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
      uploadLoadingArchive,
      handleUploadImage,
      handleUploadBeforeArchive,
      handleUploadArchive,
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
<style scoped>
.upload-loading {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 320px;
  background-color: rgba(255, 255, 255, 0.6);
}
</style>
