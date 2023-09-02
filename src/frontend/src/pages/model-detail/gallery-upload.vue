<template>
  <NModal v-model:show="isVisible" :block-scroll="false" :on-mask-click="onPressMask">
    <!-- <NSpace class="form" vertical align="center" :wrap-item="false" :size="[0, 0]">
      <NH3>Release “XXXX” Model Relaterd Images</NH3>
    </NSpace> -->

    <NCard closable @close="handleClose" style="max-width: 960px">
      <template #header>
        <NSpace justify="center" :wrap-item="false" :size="[4, 0]">
          <div style="text-align: center">
            <!-- flex: 0.5; -->
            Release <NEllipsis style="max-width: 160px">{{ modelName }}</NEllipsis
            >Model Relaterd Images
          </div>
        </NSpace>
      </template>
      <NForm ref="formRef" :model="formData" style="width: 100%" :rules="formRule">
        <NSpace :wrap="false" :wrap-item="false" :size="[48, 0]">
          <NGrid cols="1 800:2" item-responsive x-gap="24">
            <NGridItem>
              <NSpace vertical style="flex: 1">
                <NUpload
                  class="upload"
                  multiple
                  directory-dnd
                  action="https://api.emchub.ai/mrchaiemc/fileUpload.do"
                  :max="1"
                  list-type="image-card"
                  :custom-request="handleUploadImage"
                  @remove="onRemove"
                  file-list-style="grid-template-columns:none; "
                  trigger-style="width:100%;height:100%;flex-wrap:wrap"
                >
                  <NUploadDragger style="height: 282px; flex-direction: column; justify-content: space-evenly">
                    <img src="@/assets/icon_upload.png" width="96" height="96" />
                    <NText style="font-size: 16px">
                      Drag the image here or
                      <span style="color: #a45eff; text-decoration: underline">Click Upload</span>
                    </NText>
                    <NP depth="3" style="margin: 8px 0 0 0; padding: 0 24px"
                      >Directly upload the picture of the AI generation background, and the relevant creation
                      information will be automatically read
                    </NP>
                  </NUploadDragger>
                </NUpload>
                <input
                  type="password"
                  name="password"
                  style="position: fixed; left: -9999px; top: -9999px; z-index: -9999"
                />
                <NFormItem path="title" label="Image title" show-require-mark>
                  <NInput
                    class="form-input"
                    v-model:value="formData.title"
                    size="large"
                    placeholder=""
                    @keydown.enter.prevent
                  />
                </NFormItem>
                <NFormItem path="" label="About your image" :show-feedback="false">
                  <NInput
                    class="form-input"
                    v-model:value="formData.description"
                    type="textarea"
                    :autosize="{
                      minRows: 1,
                      maxRows: 2,
                    }"
                    :maxlength="300"
                    show-count
                    size="large"
                    placeholder=""
                    @keydown.enter.prevent
                  />
                </NFormItem>
              </NSpace>
            </NGridItem>
            <NGridItem>
              <NSpace vertical style="flex: 1; overflow-y: auto">
                <NFormItem path="" label="Model Name">
                  <NInput
                    class="form-input"
                    v-model:value="formData.name"
                    disabled
                    placeholder=""
                    size="large"
                    @keydown.enter.prevent
                  />
                </NFormItem>

                <NFormItem path="" label="Prompt">
                  <NInput
                    class="form-input"
                    v-model:value="formData.prompt"
                    type="textarea"
                    disabled
                    placeholder=""
                    :autosize="{
                      minRows: 1,
                      maxRows: 3,
                    }"
                    size="large"
                    @keydown.enter.prevent
                  />
                </NFormItem>
                <NFormItem path="" label="Negative Prompt">
                  <NInput
                    class="form-input"
                    v-model:value="formData.negativePrompt"
                    type="textarea"
                    disabled
                    placeholder=""
                    :autosize="{
                      minRows: 1,
                      maxRows: 3,
                    }"
                    size="large"
                    @keydown.enter.prevent
                  />
                </NFormItem>

                <NGrid :cols="2" :x-gap="24" :y-gap="0">
                  <NGridItem :span="2">
                    <NSpace :wrap="false" :wrap-item="false" justify="space-between">
                      <NFormItem class="form-input-short" path="" label="Sampler">
                        <NInput
                          class="form-input"
                          v-model:value="formData.sampler"
                          disabled
                          size="large"
                          placeholder=""
                          @keydown.enter.prevent
                        />
                      </NFormItem>
                      <NFormItem class="form-input-short" path="" label="Steps">
                        <NInput
                          class="form-input"
                          v-model:value="formData.steps"
                          disabled
                          size="large"
                          placeholder=""
                          @keydown.enter.prevent
                        />
                      </NFormItem>
                    </NSpace>
                  </NGridItem>
                  <NGridItem :span="2">
                    <NSpace :wrap="false" :wrap-item="false" justify="space-between">
                      <NFormItem class="form-input-short" path="" label="Guidance scale" :show-feedback="false">
                        <NInput
                          class="form-input"
                          v-model:value="formData.cfgScale"
                          disabled
                          size="large"
                          placeholder=""
                          @keydown.enter.prevent
                        />
                      </NFormItem>
                      <NFormItem class="form-input-short" path="" label="Seed" :show-feedback="false">
                        <NInput
                          class="form-input"
                          v-model:value="formData.seed"
                          disabled
                          size="large"
                          placeholder=""
                          @keydown.enter.prevent
                        />
                      </NFormItem>
                    </NSpace>
                  </NGridItem>
                </NGrid>
              </NSpace>
            </NGridItem>
          </NGrid>
        </NSpace>
      </NForm>
      <template #footer>
        <NSpace justify="space-around" :wrap-item="false" style="width: 100%">
          <NButton
            class="form-btn"
            type="primary"
            color="#A45EFF"
            size="large"
            :loading="submitting"
            @click.stop.prevent="onPressSubmit"
            >Upload</NButton
          >
          <NButton
            class="form-btn"
            type="primary"
            color="#A45EFF"
            ghost
            size="large"
            :loading="submitting"
            @click.stop.prevent="onPressCopy"
            >Copy Generation Data</NButton
          >
        </NSpace>
      </template>
    </NCard>
  </NModal>
</template>

<script lang="ts">
import { ref, watch, onMounted, computed, defineComponent } from 'vue';
import {
  NForm,
  NGrid,
  NGridItem,
  NFormItem,
  NInput,
  FormInst,
  FormItemRule,
  FormRules,
  NEllipsis,
  NSpace,
  NModal,
  NButton,
  NH3,
  NH5,
  NCard,
  useMessage,
  NUpload,
  NUploadDragger,
  NText,
  NP,
  UploadFileInfo,
  UploadCustomRequestOptions,
} from 'naive-ui';
import copy from 'copy-to-clipboard';
import * as SDParams from '@/tools/exif';
import { useMinio } from '@/composables/use-minio';
import { Http } from '@/tools/http';
import { useUserStore } from '@/stores/user';
import { sign } from '@/tools/open-api';
import { fileToMD5, fileToSha256Hex } from '@/tools/file-sha256';

type FormType = {
  title: string;
  name: string;
  description: string;
  prompt: string;
  negativePrompt: string;
  sampler: string;
  steps: string;
  cfgScale: string;
  seed: string;
  modelHash: string;
  width: string;
  height: string;
  images: string;
};

type PresignOptions = {
  fileName: string;
  fileType: string;
  fileHash: string;
  fileSize: number;
  signType: number;
  userId: string | number;
};

export default defineComponent({
  components: {
    NForm,
    NGrid,
    NGridItem,
    NFormItem,
    NInput,
    NSpace,
    NModal,
    NButton,
    NEllipsis,
    NH3,
    NH5,
    NCard,
    NUpload,
    NUploadDragger,
    NText,
    NP,
  },

  props: {
    showModal: { type: Boolean, default: false },
    userInfo: { type: Object, default: {} },
    modelsnapshot: { type: String, default: '' },
    modelHashCode: { type: String, default: '' },
    modelName: { type: String, default: '' },
  },
  emits: ['cancel', 'info'],
  setup(props, context) {
    const submitting = ref(false);
    const isVisible = ref(props.showModal);
    const message = useMessage();
    const http = Http.getInstance();
    const userStore = useUserStore();
    const { upload } = useMinio();
    const formData = ref<FormType>({
      title: '',
      name: '',
      description: '',
      prompt: '',
      negativePrompt: '',
      sampler: '',
      steps: '',
      cfgScale: '',
      seed: '',
      modelHash: '',
      width: '',
      height: '',
      images: '',
    });
    const parametersValue = ref('');
    const isModel = ref(false);

    const formRef = ref<FormInst | null>(null);
    const formRule: FormRules = {
      title: [{ required: true, message: 'Can not be empty', trigger: ['input', 'blur'] }],
    };

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
      try {
        const { file, onFinish, onError, onProgress } = params;
        const fileHash = await fileToMD5(file.file as File);
        if (!fileHash) {
          onError();
          message.error('file hash error');
          return;
        }
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
        const [parameters, isParameters] = await SDParams.extract(file.file as File);
        formData.value.images = url;
        parametersValue.value = parameters;
        const pf = SDParams.parse(parameters);

        const modelsHash = props.modelHashCode.toLowerCase();
        const imageModelsHash = pf.modelHash.toLowerCase();
        const isModelImage = modelsHash.startsWith(imageModelsHash);
        isModel.value = isModelImage;

        if (!isModel.value) {
          return message.error('Model the hash, please upload again');
        } else {
          formData.value.name = props.modelName || '';
        }

        const { prompt, negativePrompt, seed, sampler, steps, cfgScale, modelHash, width, height } = pf;

        formData.value = {
          ...formData.value,
          prompt,
          negativePrompt,
          sampler,
          steps: steps ? steps.toString() : '',
          cfgScale: cfgScale ? cfgScale.toString() : '',
          seed: seed ? seed.toString() : '',
          modelHash: modelHash,
          width: width,
          height: height,
        };
      } catch {
        message.error('Failed to upload');
      }
    };

    const onRemove = () => {
      formData.value = {
        title: '',
        name: '',
        description: '',
        prompt: '',
        negativePrompt: '',
        sampler: '',
        steps: '',
        cfgScale: '',
        seed: '',
        modelHash: '',
        width: '',
        height: '',
        images: '',
      };
    };
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
      submitting,
      formData,
      handleUploadImage,
      formRef,
      formRule,
      handleClose() {
        onRemove();
        message.info('Card Close');
        context.emit('cancel');
      },
      async onPressSubmit() {
        try {
          if (formData.value.modelHash === '' || formData.value.title === '' || formData.value.name === '') {
            return message.error('Can not be empty');
          } else if (!isModel.value) {
            return message.error('Model the hash, please upload again');
          } else {
            const {
              name,
              title,
              width,
              height,
              description,
              prompt,
              negativePrompt,
              images,
              sampler,
              steps,
              cfgScale,
              seed,
            } = formData.value;

            const insertData = {
              modelSn: props.modelsnapshot,
              modelName: name,
              imageTitle: title,
              resolution: `${width}*${height}`,
              description: description,
              prompt: prompt,
              negativePrompt: negativePrompt,
              url: images,
              sampler: sampler,
              steps: steps,
              scale: cfgScale,
              seed: seed,
              raw: parametersValue.value,
            };
            submitting.value = true;
            const resp = await http.postJSON({
              url: 'https://client.emchub.ai/emchub/api/client/modelImage/insert',
              data: insertData,
            });
            if (resp._result !== 0) {
              message.error(resp._desc || '');
              return;
            }
            message.success('Successfully uploaded!');
            onRemove();
            submitting.value = false;
          }
          context.emit('cancel');
        } catch (error) {
          submitting.value = false;
        }
      },
      onPressCopy() {
        copy(parametersValue.value);
        message.success('Copied!');
      },
      onRemove,
    };
  },
});
</script>

<style scoped>
.form-btn {
  width: 300px;
  border-radius: 10px;
}
.form-input-short {
  flex: 0.45;
}

.upload /deep/ .n-upload-file--image-card-type {
  width: 100%;
  height: 316px;
}
.upload /deep/ .n-image img {
  object-fit: contain !important;
}
</style>
