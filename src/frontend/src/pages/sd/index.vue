<template>
  <div class="page">
    <div class="page-forms">
      <NCard title="Generate image" content-style="padding:0;">
        <NScrollbar :style="scrollBarStyle">
          <div class="scroll-body">
            <NForm ref="formRef" :model="formData">
              <NGrid :cols="24" :x-gap="24">
                <NFormItemGi :span="24" path="prompt" label="Prompt">
                  <NInput
                    type="textarea"
                    v-model:value="formData.prompt"
                    placeholder="List the things you want in the image (e.g. bubbles,tank)"
                    :autosize="true"
                    style="min-height: 140px"
                  />
                </NFormItemGi>
                <NFormItemGi :span="24" path="negativePrompt" label="Negative Prompt">
                  <NInput
                    type="textarea"
                    v-model:value="formData.negativePrompt"
                    placeholder="List the things to remove from the image (e.g. fog, fingers)"
                    :autosize="true"
                    style="min-height: 80px"
                  />
                </NFormItemGi>
                <NFormItemGi :span="24" path="sampler" label="Sampler">
                  <NSelect
                    v-model:value="formData.sampler"
                    label-field="label"
                    value-field="val"
                    placeholder="Select"
                    :options="samplerOptions"
                  />
                </NFormItemGi>
                <NFormItemGi :span="24" path="steps" label="Steps">
                  <NSpace vertical style="width: 100%">
                    <NSlider v-model:value="formData.steps" :min="1" :max="150" :step="1" />
                    <NInputNumber v-model:value="formData.steps" size="small" :min="1" :max="150" :step="1" />
                  </NSpace>
                </NFormItemGi>
                <NFormItemGi :span="12" path="width" label="Width">
                  <NSpace vertical style="width: 100%">
                    <NSlider v-model:value="formData.width" :min="128" :max="1024" :step="128" />
                    <NInputNumber v-model:value="formData.width" size="small" :min="128" :max="1024" :step="128" />
                  </NSpace>
                </NFormItemGi>
                <NFormItemGi :span="12" path="height" label="Height">
                  <NSpace vertical style="width: 100%">
                    <NSlider v-model:value="formData.height" :min="128" :max="1024" :step="128" />
                    <NInputNumber v-model:value="formData.height" size="small" :min="128" :max="1024" :step="128" />
                  </NSpace>
                </NFormItemGi>
                <NFormItemGi :span="24" path="seed" label="Seed">
                  <NInputNumber
                    v-model:value="formData.seed"
                    size="small"
                    :min="-1"
                    :max="99999999999"
                    :step="1"
                    style="width: 100%"
                  />
                </NFormItemGi>
                <NFormItemGi :span="12" path="cfgScale" label="CFG Scale">
                  <NSpace vertical style="width: 100%">
                    <NSlider v-model:value="formData.cfgScale" :min="1" :max="30" :step="0.5" />
                    <NInputNumber v-model:value="formData.cfgScale" size="small" :min="1" :max="30" :step="0.5" />
                  </NSpace>
                </NFormItemGi>
                <NFormItemGi :span="12" path="clipSkip" label="Clip Skip">
                  <NSpace vertical style="width: 100%">
                    <NSlider v-model:value="formData.clipSkip" :min="0" :max="10" :step="1" />
                    <NInputNumber v-model:value="formData.clipSkip" size="small" :min="0" :max="10" :step="1" />
                  </NSpace>
                </NFormItemGi>
              </NGrid>
            </NForm>
            <NSpace :wrap-item="false" :wrap="false" align="center" justify="center" :size="[24, 0]">
              <NButton :block="true" :disabled="result.status === 1" @click="onPressReset" style="flex: 1"
                >Reset</NButton
              >
              <NButton
                type="primary"
                :block="true"
                :loading="result.status === 1"
                @click="onPressGenerate"
                style="flex: 1"
                >Generate image</NButton
              >
            </NSpace>
          </div>
        </NScrollbar>
      </NCard>
    </div>
    <div class="page-results">
      <NCard title="Result" content-style="padding:0;">
        <NScrollbar :style="scrollBarStyle">
          <div class="scroll-body">
            <template v-if="result.status === 0">
              <div class="result-empty">
                <span class="text-color-3">
                  Please enter some content in the form and click the "Generate image" button to generate an image
                </span>
              </div>
            </template>
            <template v-else-if="result.status === 1">
              <div class="result-empty">
                <NSpin size="large" />
              </div>
            </template>
            <template v-else-if="result.status === 2">
              <div class="result-img-wrapper">
                <img class="result-img" :src="result.image" />
                <div class="result-img-tools">
                  <NButton tertiary circle @click="onPressDownload">
                    <template #icon>
                      <NIcon size="14">
                        <CloudDownloadOutlineIcon />
                      </NIcon>
                    </template>
                  </NButton>
                </div>
              </div>
              <NDescriptions label-placement="top" :column="1">
                <NDescriptionsItem>
                  <template #label>
                    <span>Image Parameters</span>
                  </template>
                  <span style="display: inline-block; white-space: pre-wrap">{{ result.imageParameters }}</span>
                </NDescriptionsItem>
              </NDescriptions>
            </template>
            <template v-else-if="result.status === 3">
              <NAlert :title="'Execution Failure'" type="error"> {{ result.errorMessage }} </NAlert>
            </template>
          </div>
        </NScrollbar>
      </NCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch, computed } from 'vue';
import {
  NIcon,
  NCard,
  NGrid,
  NForm,
  NFormItemGi,
  NInput,
  NButton,
  NSpace,
  FormInst,
  NSlider,
  NSelect,
  NScrollbar,
  NInputNumber,
  NSpin,
  NDescriptions,
  NDescriptionsItem,
  useMessage,
  NAlert,
} from 'naive-ui';
import { CloudDownloadOutline as CloudDownloadOutlineIcon } from '@vicons/ionicons5';
import { Utils } from '@/tools/utils';
import { Http } from '@/tools/http';
import { downloadBase64 } from '@/tools/download';
import { getImageMime } from 'base64-image-mime';
import { useRoute } from 'vue-router';
import { sampler as samplerOptions } from './options';
import { config as formConfigs } from './formConfigs';
import * as StableDiffusionMetadata from '@/tools/stable-diffusion-metadata';
import { sign } from '@/tools/open-api';
import OpenEmcHubConfig from '@/credentials.emchub.json';

interface FormDataType {
  prompt: string | null;
  negativePrompt: string | null;

  sampler: string; //sampler_index
  steps: number; //steps

  width: number;
  height: number;
  cfgScale: number; //cfg_scale

  seed: number; //seed
  clipSkip: number; //clip_skip
  // modelHash:string;
  [k: string]: any;
}

interface PostMessageRequest {
  type: string;
  data: any;
}

interface Result {
  errorCode: number;
  errorMessage: string;
  image: string;
  imageParameters: string;
  status: number; // 0:none 1:running 2:success 3:failure
}

const defaultFormData = () => {
  return {
    prompt: '',
    negativePrompt: '',
    sampler: samplerOptions[0].val,
    steps: 20,
    width: 512,
    height: 512,
    cfgScale: 7,
    seed: -1,
    clipSkip: 0,
  };
};

export default defineComponent({
  name: 'Txt2Img',
  components: {
    NIcon,
    NCard,
    NGrid,
    NForm,
    NFormItemGi,
    NInput,
    NSlider,
    NSelect,
    NScrollbar,
    NInputNumber,
    NSpin,
    NButton,
    NSpace,
    NDescriptions,
    NDescriptionsItem,
    NAlert,
    CloudDownloadOutlineIcon,
  },
  setup() {
    const message = useMessage();
    const route = useRoute();
    const scrollBarStyle = ref({
      'max-height': 'calc(100vh - var(--layout-header-height) - 120px)',
      padding: '0 24px',
      'box-sizing': 'border-box',
    });
    const formRef = ref<FormInst | null>(null);
    const formData = ref<FormDataType>(defaultFormData());
    const result = ref<Result>({ errorCode: 0, errorMessage: '', image: '', imageParameters: '', status: 0 });
    const http = Http.getInstance();

    const queryTask = async (sn: string): Promise<Resp365> => {
      return new Promise((resolve) => {
        const appid = OpenEmcHubConfig.appid;
        const secret = OpenEmcHubConfig.secret;
        const nonce = new Date().getTime();
        const action = 'queryTaskBySn';
        const signParams: any = { appid, nonce, action, requestBody: JSON.stringify({ taskSn: sn }) };
        signParams.sign = sign(signParams, secret);
        const handler = async () => {
          const beforeTime = new Date().getTime();
          const resp = await http.postJSON({
            url: 'https://openapi.emchub.ai/emchub/api/client/open/queryTaskBySn',
            data: signParams,
          });
          if (resp._result !== 0) {
            resolve({ _result: 10 + resp._result, _desc: resp.desc });
            return;
          }
          const { status, fileUrl, failReason } = resp.data || {};
          if (status === 0 || status === 1) {
            const maxIntervalTime = 10000;
            const executeTime = Math.round(new Date().getTime() - beforeTime);
            const diffTime = maxIntervalTime - executeTime;
            setTimeout(() => handler(), Math.max(1, diffTime));
            return;
          }
          let _result: number;
          let _desc: string;
          let data: any = null;
          if (status === 2) {
            _result = 0;
            data = fileUrl;
            _desc = '';
          } else {
            // >20 is status error
            _result = 20 + status;
            if (status === 3) {
              _desc = `${failReason}`;
            } else if (status === 4) {
              _desc = `timeout`;
            } else if (status === 5) {
              _desc = `has bean removed`;
            } else {
              _desc = `status ${status}`;
            }
          }
          resolve({ _result, _desc, data });
        };
        handler();
      });
    };

    const handleWindowMessage = (event: MessageEvent) => {
      const request: PostMessageRequest = event.data as PostMessageRequest;
      if (request.type === 'emchub-txt2img-parameters' && request.data) {
        const data: { [k: string]: any } = StableDiffusionMetadata.parse(request.data);
        Object.entries(data).forEach(([k, v]) => {
          if (v) {
            formData.value[k] = v;
          }
        });
      }
    };

    onMounted(async () => {
      if (window.opener) {
        window.opener.postMessage({ type: 'emchub-txt2img-ready' }, '*');
      }
      window.addEventListener('message', handleWindowMessage);
    });

    onUnmounted(() => {
      window.removeEventListener('message', handleWindowMessage);
    });

    return {
      scrollBarStyle,
      samplerOptions,
      formRef,
      formData,
      result,
      onPressReset() {
        formData.value = defaultFormData();
      },
      onPressDownload() {
        downloadBase64(result.value.image);
      },
      async onPressGenerate() {
        const errors: string[] = [];
        const insideBody = {};
        const body = {
          modelHash: route.params.modelHashCode,
          generativeParameters: '',
        };
        formConfigs.forEach((item) => {
          let value = formData.value[item.key];
          //set default value
          if (!value && typeof item.defaultValue !== 'undefined') {
            value = item.defaultValue;
          }
          //is required
          if (item.required && !value) {
            errors.push(`${item.key} can not be empty`);
          }
          let exposeKey = item.exposeKey;
          if (item.exposeRequired && !exposeKey) {
            errors.push(`expose key '${item.exposeKey}' is empty`);
          }
          insideBody[exposeKey] = value;
        });

        if (errors.length > 0) {
          message.error(errors.join(', '));
          return;
        }
        body.generativeParameters = JSON.stringify(insideBody);
        const appid = OpenEmcHubConfig.appid;
        const secret = OpenEmcHubConfig.secret;
        const nonce = new Date().getTime();
        const action = 'textForImage';
        const signParams: any = { appid, nonce, action, requestBody: JSON.stringify(body) };
        signParams.sign = sign(signParams, secret);

        result.value.status = 1;
        result.value.errorCode = 0;
        result.value.errorMessage = '';
        const resp = await http.postJSON({
          url: 'https://openapi.emchub.ai/emchub/api/client/open/textForImage',
          data: signParams,
        });
        if (resp._result !== 0) {
          result.value.status = 3;
          result.value.errorCode = resp._result;
          result.value.errorMessage = resp._desc;
          return;
        }
        const { taskSn = '' } = resp.data || {};
        const resp2 = await queryTask(taskSn);
        if (resp2._result !== 0) {
          result.value.status = 3;
          result.value.errorCode = resp2._result;
          result.value.errorMessage = resp2._desc || '';
          return;
        }
        const image = (resp2.data as string) || '';
        const url = `data:${getImageMime(image) || 'image/png'};base64,${image}`;
        result.value.status = 2;
        result.value.image = url;
        const [parameters, isParameters] = await StableDiffusionMetadata.extract(url);
        result.value.imageParameters = parameters;
      },
    };
  },
});
</script>

<style scoped>
.page {
  min-height: 80vh;
  display: flex;
}
.page-forms {
  width: 32vw;
  min-width: 400px;
  margin-right: 24px;
}
.page-results {
  flex: 1;
}
.scroll-body {
  padding: 24px 0;
  min-height: calc(100vh - var(--layout-header-height) - 168px);
}

.result-empty {
  min-height: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}
.result-img-wrapper {
  width: 60%;
  min-width: 300px;
  position: relative;
}
.result-img {
  width: 100%;
  min-width: 300px;
}

.result-img-tools {
  position: absolute;
  z-index: 1;
  right: 0;
  top: 0;
  padding: 4px;
  display: none;
}
.result-img-wrapper:hover .result-img-tools {
  display: inline-block;
}
</style>
