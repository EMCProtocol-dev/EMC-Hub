<template>
  <div class="page">
    <div class="page-forms">
      <n-card title="Generate image" content-style="padding:0;">
        <NScrollbar :style="scrollBarStyle">
          <div class="scroll-body">
            <n-form ref="formRef" :model="formData">
              <n-grid :cols="24" :x-gap="24">
                <n-form-item-gi :span="24" path="prompt" label="Prompt">
                  <n-input
                    type="textarea"
                    v-model:value="formData.prompt"
                    placeholder="List the things you want in the image (e.g. bubbles,tank)"
                    :autosize="true"
                    style="min-height: 140px"
                  />
                </n-form-item-gi>
                <n-form-item-gi :span="24" path="negativePrompt" label="Negative Prompt">
                  <n-input
                    type="textarea"
                    v-model:value="formData.negativePrompt"
                    placeholder="List the things to remove from the image (e.g. fog, fingers)"
                    :autosize="true"
                    style="min-height: 80px"
                  />
                </n-form-item-gi>
                <n-form-item-gi :span="24" path="sampler" label="Sampler">
                  <n-select
                    v-model:value="formData.sampler"
                    label-field="label"
                    value-field="val"
                    placeholder="Select"
                    :options="samplerOptions"
                  />
                </n-form-item-gi>
                <n-form-item-gi :span="24" path="steps" label="Steps">
                  <n-space vertical style="width: 100%">
                    <n-slider v-model:value="formData.steps" :min="1" :max="150" :step="1" />
                    <n-input-number v-model:value="formData.steps" size="small" :min="1" :max="150" :step="1" />
                  </n-space>
                </n-form-item-gi>
                <n-form-item-gi :span="12" path="width" label="Width">
                  <n-space vertical style="width: 100%">
                    <n-slider v-model:value="formData.width" :min="128" :max="1024" :step="128" />
                    <n-input-number v-model:value="formData.width" size="small" :min="128" :max="1024" :step="128" />
                  </n-space>
                </n-form-item-gi>
                <n-form-item-gi :span="12" path="height" label="Height">
                  <n-space vertical style="width: 100%">
                    <n-slider v-model:value="formData.height" :min="128" :max="1024" :step="128" />
                    <n-input-number v-model:value="formData.height" size="small" :min="128" :max="1024" :step="128" />
                  </n-space>
                </n-form-item-gi>
                <n-form-item-gi :span="24" path="seed" label="Seed">
                  <n-input-number
                    v-model:value="formData.seed"
                    size="small"
                    :min="-1"
                    :max="99999999999"
                    :step="1"
                    style="width: 100%"
                  />
                </n-form-item-gi>
                <n-form-item-gi :span="12" path="cfgScale" label="CFG Scale">
                  <n-space vertical style="width: 100%">
                    <n-slider v-model:value="formData.cfgScale" :min="1" :max="30" :step="0.5" />
                    <n-input-number v-model:value="formData.cfgScale" size="small" :min="1" :max="30" :step="0.5" />
                  </n-space>
                </n-form-item-gi>
                <n-form-item-gi :span="12" path="clipSkip" label="Clip Skip">
                  <n-space vertical style="width: 100%">
                    <n-slider v-model:value="formData.clipSkip" :min="0" :max="10" :step="1" />
                    <n-input-number v-model:value="formData.clipSkip" size="small" :min="0" :max="10" :step="1" />
                  </n-space>
                </n-form-item-gi>
              </n-grid>
            </n-form>
            <n-space :wrap-item="false" :wrap="false" align="center" justify="center" :size="[24, 0]">
              <n-button :block="true" :disabled="isExeuting" @click="onPressReset" style="flex: 1">Reset</n-button>
              <n-button type="primary" :block="true" :loading="isExeuting" @click="onPressGenerate" style="flex: 1"
                >Generate image</n-button
              >
            </n-space>
          </div>
        </NScrollbar>
      </n-card>
    </div>
    <div class="page-results">
      <n-card title="Result" content-style="padding:0;">
        <NScrollbar :style="scrollBarStyle">
          <div class="scroll-body">
            <template v-if="isExeuting">
              <div class="result-empty">
                <n-spin size="large" />
              </div>
            </template>
            <template v-else-if="result.status === 2">
              <div class="result-img-wrapper">
                <img class="result-img" :src="result.image" />
                <div class="result-img-tools">
                  <n-button tertiary circle @click="onPressDownload">
                    <template #icon>
                      <n-icon size="14">
                        <CloudDownloadOutlineIcon />
                      </n-icon>
                    </template>
                  </n-button>
                </div>
              </div>
              <n-descriptions label-placement="top" :column="1">
                <n-descriptions-item>
                  <template #label>
                    <span>Response Information</span>
                  </template>
                  <span style="display: inline-block; white-space: pre-wrap">{{ insideResponseInfo }}</span>
                </n-descriptions-item>
              </n-descriptions>
            </template>
            <template v-else-if="insideResponseError">
              <n-alert :title="insideResponseError.title" type="error"> {{ insideResponseError.content }} </n-alert>
            </template>
            <template v-else>
              <div class="result-empty">
                <span class="text-color-3">
                  Please enter some content in the form and click the "Generate image" button to generate an image
                </span>
              </div>
            </template>
          </div>
        </NScrollbar>
      </n-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch, computed } from 'vue';
import {
  NA,
  NIcon,
  NCard,
  NGrid,
  NForm,
  NFormItem,
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
  NModal,
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
import * as SDParams from '@/tools/exif';
import { parse as parametersParse } from '@/tools/exif';
import { sign } from '@/tools/open-api';
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
  error: number;
  errorMessage: string;
  image: string;
  status: number;
}

export default defineComponent({
  name: 'Txt2Img',
  components: {
    NA,
    NIcon,
    NCard,
    NGrid,
    NForm,
    NFormItem,
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
    NModal,
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
    const formData = ref<FormDataType>({
      prompt: '',
      negativePrompt: '',
      sampler: samplerOptions[0].val,
      steps: 20,
      width: 512,
      height: 512,
      cfgScale: 7,
      seed: -1,
      clipSkip: 0,
    });
    const result = ref<Result>({ error: -1, errorMessage: '', image: '', status: 0 });
    // const formData = ref<FormDataType>({
    //   prompt:
    //     'deconstruction of self, Neon futurism, hyperrealistic surrealism, dreamscape, award winning masterpiece with incredible details, liminal space, highly detailed,Cleveland Ohio, cinematic ,rim lighting ,octane render, wvebg1, bganidusk',
    //   negativePrompt:
    //     '(low quality, worst quality:1.4), (bad anatomy), (inaccurate limb:1.2), bad composition, inaccurate eyes, extra digit, fewer digits, (extra arms:1.2)',
    //   sampler: 'DPM++ 2M Karras',
    //   steps: 30,
    //   width: 512,
    //   height: 682,
    //   cfgScale: 7,
    //   seed: 1674451477',
    //   clipSkip: 0,
    // });
    const insideResponseImage = ref('');
    const insideResponseError = ref<any>(null);
    const insideResponseInfo = ref('');
    const isExeuting = ref(false);
    const isVisibleSignIn = ref(false);
    const http = Http.getInstance();
    const handleWindowMessage = (event: MessageEvent) => {
      const request: PostMessageRequest = event.data as PostMessageRequest;
      if (request.type === 'emchub-txt2img-parameters' && request.data) {
        const data: { [k: string]: any } = SDParams.parse(request.data);
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

      const img =
        parametersParse(`masterpiece, best quality, 1girl, (colorful),(delicate eyes and face), volumatic light, ray tracing, bust shot ,extremely detailed CG unity 8k wallpaper,solo,smile,intricate skirt,((flying petal)),(Flowery meadow) sky, cloudy_sky, moonlight, moon, night, (dark theme:1.3), light, fantasy, windy, magic sparks, dark castle,white hair
Negative prompt: paintings, sketches, fingers, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, (outdoor:1.6), backlight,(ugly:1.331), (duplicate:1.331), (morbid:1.21), (mutilated:1.21), (tranny:1.331), mutated hands, (poorly drawn hands:1.5), blurry, (bad anatomy:1.21), (bad proportions:1.331), extra limbs, (disfigured:1.331), (more than 2 nipples:1.331), (missing arms:1.331), (extra legs:1.331), (fused fingers:1.61051), (too many fingers:1.61051), (unclear eyes:1.331), lowers, bad hands, missing fingers, extra digit, (futa:1.1),bad hands, missing fingers, bad-hands-5
Steps: 20, Sampler: DPM++ 2M Karras, CFG scale: 8, Seed: 1931785963, Size: 512x832, Model hash: cca17b08da, Model: MAADBD2fp16, Denoising strength: 0.5, Clip skip: 2, Wildcard negative prompt: "paintings, sketches, fingers, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, (outdoor:1.6), backlight,(ugly:1.331), (duplicate:1.331), (morbid:1.21), (mutilated:1.21), (tranny:1.331), mutated hands, (poorly drawn hands:1.5), blurry, (bad anatomy:1.21), (bad proportions:1.331), extra limbs, (disfigured:1.331), (more than 2 nipples:1.331), (missing arms:1.331), (extra legs:1.331), (fused fingers:1.61051), (too many fingers:1.61051), (unclear eyes:1.331), lowers, bad hands, missing fingers, extra digit, (futa:1.1),bad hands, missing fingers, bad-hands-5", Hires upscale: 2, Hires steps: 20, Hires upscaler: Latent, Version: v1.3.2`);
      console.info(img);
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
      insideResponseImage,
      insideResponseError,
      insideResponseInfo,
      isExeuting,
      isVisibleSignIn,
      onPressRefresh() {
        window.location.reload();
      },
      onPressReset() {
        formData.value.prompt = '';
        formData.value.negativePrompt = '';
        formData.value.width = 512;
        formData.value.height = 512;
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
        console.info(insideBody);
        body.generativeParameters = JSON.stringify(insideBody);
        const appid = 'emchub';
        const nonce = new Date().getTime();
        const action = 'textForImage';
        const secret = 'c3435389-4893-11ee-9b41-02dbe03faa96';
        const signParams: any = { appid, nonce, action, requestBody: JSON.stringify(body) };
        signParams.sign = sign(signParams, secret);

        isExeuting.value = true;
        result.value.error = -1;
        result.value.errorMessage = '';
        const resp = await http.postJSON({
          url: 'https://openapi.emchub.ai/emchub/api/client/open/textForImage',
          data: signParams,
        });
        isExeuting.value = false;
        if (resp._result !== 0) {
          result.value.error = resp._result;
          result.value.errorMessage = resp._desc;
          return;
        }
        result.value.error = 0;

        // const teleRespData = response.data || {};
        // console.info('/api response:', teleRespDataFormatted);
        // const insideResponse = teleRespDataFormatted?.result?.response;
        // if (insideResponse.error || insideResponse.errors) {
        //   const error = {
        //     title: insideResponse.error,
        //     content: insideResponse.errors,
        //   };
        //   insideResponseError.value = error;
        //   message.error(`${insideResponse.error}\n${insideResponse.errors}`);
        // } else if (!Array.isArray(insideResponse?.images) || !insideResponse?.images?.length) {
        //   const error = {
        //     title: 'Error',
        //     content: 'Invalid response data',
        //   };
        //   insideResponseError.value = error;
        //   message.error(`${error.content}`);
        // } else if (insideResponse?.images?.length > 0) {
        //   const mime = getImageMime(insideResponse.images[0]) || 'image/png';
        //   insideResponseImage.value = `data:${mime};base64,${insideResponse.images[0]}`;
        //   const _insideResponseInfo = Utils.parseJSON(insideResponse.info) || {};
        //   if (_insideResponseInfo.infotexts?.length > 0) {
        //     insideResponseInfo.value = _insideResponseInfo.infotexts[0];
        //   } else {
        //     insideResponseInfo.value = insideResponse.info;
        //   }
        // }
      },
      onPressDownload() {
        downloadBase64(insideResponseImage.value);
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
