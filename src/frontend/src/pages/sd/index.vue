<template>
  <div class="page">
    <div class="page-forms">
      <NCard title="Generate image" content-style="padding:0;" footer-style="padding-top:24px;">
        <NScrollbar trigger="none" :style="scrollBarStyle">
          <div class="scroll-body">
            <NForm ref="formRef" :model="formData">
              <NGrid :cols="24" :x-gap="24">
                <NFormItemGi :span="24" path="modelHash" label="Checkpoint">
                  <NSelect
                    v-model:value="formData.modelHash"
                    :options="modelHashItems"
                    :loading="modelHashItemsLoading"
                    filterable
                    label-field="label"
                    value-field="val"
                  >
                  </NSelect>
                </NFormItemGi>
                <NFormItemGi :span="24" label="LoRA">
                  <template v-if="modelHashItemsLoading">
                    <NSpace
                      align="center"
                      justify="center"
                      :wrap-item="false"
                      :wrap="false"
                      style="height: 200px; width: 100%"
                    >
                      <NSpin />
                    </NSpace>
                  </template>
                  <template v-else>
                    <NScrollbar x-scrollable>
                      <NSpace :wrap-item="false" :wrap="false" style="padding-bottom: 24px; padding-right: 8px">
                        <template v-for="item in loraItems">
                          <div style="width: 160px">
                            <LoraItem :item="item" @press="onPressLoraItem" />
                          </div>
                        </template>
                      </NSpace>
                    </NScrollbar>
                  </template>
                </NFormItemGi>
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
          </div>
        </NScrollbar>
        <template #footer>
          <NSpace :wrap-item="false" :wrap="false" align="center" justify="center" :size="[24, 0]">
            <NButton :block="true" :disabled="result.status === 1" @click="onPressReset" style="flex: 1">Reset</NButton>
            <NButton
              type="primary"
              :block="true"
              :loading="result.status === 1"
              @click="onPressGenerate"
              style="flex: 1"
              >Generate image</NButton
            >
          </NSpace>
        </template>
      </NCard>
    </div>
    <div class="page-results">
      <NCard title="Result" content-style="padding:0;">
        <NScrollbar trigger="none" :style="scrollBarStyle2">
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
import * as StableDiffusionMetadata from 'stable-diffusion-image-metadata';
import { sign } from '@/tools/open-api';
import OpenEmcHubConfig from '@/credentials.emchub.json';
import { shortHashCodeSha256 } from '../model-detail/utils';
import LoraItem from './lora-item.vue';
import type { LoraItem as AsLoraItem, LoraItemCover as AsLoraItemCover } from './lora-item';
interface FormDataType {
  modelHash: string;

  prompt: string;
  negativePrompt: string;

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

type SelectItem = {
  label: string;
  val: string;
  raw: string;
};

const defaultFormData = (data?: any) => {
  const defaultData = {
    modelHash: '',
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
  if (!data) {
    return defaultData;
  }
  Object.entries(defaultData).forEach(([k, v]) => {
    const value = data[k];
    if (typeof v === 'string') {
      defaultData[k] = String(value);
    } else if (typeof v === 'number') {
      defaultData[k] = parseFloat(value as string);
    }
  });
  return defaultData;
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
    LoraItem,
  },
  setup(props, ctx) {
    const message = useMessage();
    const route = useRoute();
    const scrollBarStyle = ref({
      'max-height': 'calc(100vh - var(--layout-header-height) - 198px)',
      padding: '0 24px',
      'box-sizing': 'border-box',
    });
    const scrollBarStyle2 = ref({
      'max-height': 'calc(100vh - var(--layout-header-height) - 120px)',
      padding: '0 24px',
      'box-sizing': 'border-box',
    });
    const ready = ref(false);
    const modelHashItemsLoading = ref(true);
    const modelHashItems = ref<SelectItem[]>([]);
    const loraItems = ref<AsLoraItem[]>([]);
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
            const maxIntervalTime = 3000;
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
        formData.value.prompt = data.prompt;
        formData.value.negativePrompt = data.negativePrompt;
        formData.value.sampler = data.sampler;
        formData.value.steps = data.steps;
        formData.value.width = data.width;
        formData.value.height = data.height;
        formData.value.cfgScale = data.cfgScale;
        formData.value.seed = data.seed;
        formData.value.clipSkip = data.clipSkip;
      }
    };

    const queryImageStatus = async (url: string) => {
      const handle = async () => {
        const now = new Date().getTime();
        const { status, data: resp } = await http.client.get(url);
        const executeTime = new Date().getTime() - now;
        const diff = 5000 - executeTime;
        if (!ready.value) {
          return false;
        } else if (status === 200) {
          return true;
        } else {
          return new Promise((resolve) => setTimeout(() => handle().then(resolve), Math.max(1, diff)));
        }
      };
      return handle();
    };

    const updatePrompt = () => {
      //  /\s\<lora:(.*):\d+\>/.test('asdsa <lora:asdxzcxzc123123:11> <asdsad>asdsad')
      const loraList: string[] = [];
      loraList.join(' ');
    };

    onMounted(async () => {
      ready.value = false;
      modelHashItemsLoading.value = true;
      const resp = await http.get({
        url: '/emchub/api/client/modelInfo/queryList',
        data: { pageNo: 1, pageSize: 999 },
      });
      modelHashItemsLoading.value = false;
      const list: any[] = resp.pageInfo?.list || [];
      list.sort((a, b) => {
        if (b.modelName < a.modelName) {
          return 1;
        }
        if (a.modelName < b.modelName) {
          return -1;
        }
        return 0;
      });
      const _modeHashItems: SelectItem[] = [];
      const _loraItems: AsLoraItem[] = [];
      const queryModelHash = (route.params.modelHashCode as string) || '';

      list.forEach(({ type, modelName, modelVersions }) => {
        modelVersions.forEach(({ modelVersion, hashCodeSha256, alias, previewPicturesUrl }) => {
          const shortHash = shortHashCodeSha256(hashCodeSha256);
          if (type === 'CHECKPOINT') {
            _modeHashItems.push({
              label: `${modelName}:${modelVersion}`,
              val: shortHash,
              raw: hashCodeSha256,
            });
            if (queryModelHash === shortHash) {
              formData.value.modelHash = shortHash;
            }
          } else if (type === 'LORA') {
            const images: AsLoraItemCover[] = Utils.parseJSON(previewPicturesUrl) || [];
            _loraItems.push({
              label: `${modelName}:${modelVersion}`,
              modelName,
              modelVersion,
              covers: images,
              alias: alias,
              hashCodeSha256: hashCodeSha256,
              shortHashCodeSha256: shortHash,
            });
          }
        });
      });
      modelHashItems.value = _modeHashItems;
      loraItems.value = _loraItems;
      //set default model
      if (!formData.value.modelHash) {
        formData.value.modelHash = _modeHashItems[0].val;
      }

      window.addEventListener('message', handleWindowMessage);

      if (window.opener) {
        window.opener.postMessage({ type: 'emchub-txt2img-ready' }, '*');
      }
      ready.value = true;
    });

    onUnmounted(() => {
      //Important!!
      ready.value = false;
      window.removeEventListener('message', handleWindowMessage);
    });

    return {
      scrollBarStyle,
      scrollBarStyle2,
      samplerOptions,
      modelHashItemsLoading,
      modelHashItems,
      loraItems,
      formRef,
      formData,
      result,
      onPressReset() {
        formData.value = defaultFormData();
      },
      onPressDownload() {
        downloadBase64(result.value.image);
      },
      onPressLoraItem(item: AsLoraItem) {
        const reg = new RegExp(`\\s\\<lora:${item.alias}:\\d+\\>`);
        if (reg.test(formData.value.prompt)) {
          formData.value.prompt = formData.value.prompt.replace(reg, '');
        } else {
          formData.value.prompt += ` <lora:${item.alias}:1>`;
        }
      },
      async onPressGenerate() {
        const errors: string[] = [];
        const insideBody = {};
        const modelHashItem = modelHashItems.value.find((item) => item.val === formData.value.modelHash);
        const modelHash = modelHashItem?.raw;
        const body = {
          modelHash: modelHash,
          generativeParameters: '',
        };
        if (!modelHash) {
          errors.push(`'Model' can not be empty`);
        }
        formConfigs.forEach((item, index) => {
          let exposeKey = item.exposeKey;
          let value = formData.value[item.key];
          if (!exposeKey) {
            errors.push(`Config error, [${index}] expose key is empty`);
          }
          //set default value
          if (!value && typeof item.defaultValue !== 'undefined') {
            value = item.defaultValue;
          }
          //is required
          if (item.required && !value) {
            errors.push(`'${item.label}' can not be empty`);
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
        // const image = (resp2.data as string) || '';
        // const url = `data:${getImageMime(image) || 'image/png'};base64,${image}`;
        const url = (resp2.data as string) || '';
        if (!url) {
          result.value.status = 3;
          result.value.errorCode = resp2._result;
          result.value.errorMessage = 'Not found url';
          return;
        }
        const isGenerated = await queryImageStatus(url);
        if (!isGenerated) {
          result.value.status = 3;
          result.value.errorCode = resp2._result;
          result.value.errorMessage = 'Generate failure, unknow error';
          return;
        }
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
