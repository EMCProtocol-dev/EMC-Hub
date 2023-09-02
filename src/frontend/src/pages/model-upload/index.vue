<template>
  <div class="page">
    <NCard :title="title">
      <template v-if="!hideSteps">
        <NSpace justify="center" :wrap-item="false" :size="[0, 24]" style="margin: 24px 0">
          <NSteps :current="(current as number)" :status="currentStatus" style="width: 1200px">
            <NStep title="Edit Info" description="Set the basic information of the model" />
            <NStep title="Edit Version" description="Set the version information for the model" />
            <NStep title="Upload files" description="Set and uploading model files" />
            <NStep title="Complete" description="" />
          </NSteps>
        </NSpace>
      </template>
      <template v-if="current === 1">
        <Form1
          :mode="mode"
          :model-sn="modelSn"
          @prev="onFormPrev1"
          @submit="onFormSubmit1"
          @submitandreview="onFormReview1"
        />
      </template>
      <template v-if="current === 2">
        <Form2
          :mode="mode"
          :model-sn="modelSn"
          :version-sn="versionSn"
          @prev="onFormPrev2"
          @submit="onFormSubmit2"
          @submitandreview="onFormReview2"
        />
      </template>
      <template v-if="current === 3">
        <Form3
          :mode="mode"
          :model-sn="modelSn"
          :version-sn="versionSn"
          @prev="onFormPrev3"
          @submit="onFormSubmit3"
          @submitandreview="onFormReview3"
        />
      </template>
      <template v-if="current === 4">
        <NSpace vertical align="center" :wrap-item="false" :size="[0, 24]" style="height: 60vh">
          <NIconWrapper :size="64" :border-radius="64">
            <NIcon :size="40">
              <IconSuccess />
            </NIcon>
          </NIconWrapper>
          <NH1>Complete</NH1>
          <div style="width: 60%">
            <NText
              >The model has been successfully uploaded. Once submitted, it will be reviewed by the community and can be
              displayed on EMCHUB for everyone to use. You can also choose to not submit for now and submit it for
              review after further information is improved.</NText
            >
          </div>
          <NSpace justify="center" align="center" :size="[24, 24]">
            <NButton type="primary" ghost size="large" strong @click="onPressDone" style="width: 144px">Done</NButton>
          </NSpace>
        </NSpace>
      </template>
    </NCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import {
  useMessage,
  NSpace,
  NButton,
  NCard,
  NSteps,
  NStep,
  NIconWrapper,
  NIcon,
  NH1,
  NText,
  StepsProps,
} from 'naive-ui';
import { CheckmarkSharp as IconSuccess } from '@vicons/ionicons5';
import { useRoute, useRouter } from 'vue-router';
import { Http } from '@/tools/http';
import Form1 from './info/form1.vue';
import Form2 from './version/form2.vue';
import Form3 from './file/form3.vue';

export default defineComponent({
  name: 'model-upload',
  components: {
    NSpace,
    NButton,
    NCard,
    NSteps,
    NStep,
    NIconWrapper,
    NIcon,
    IconSuccess,
    NH1,
    NText,
    Form1,
    Form2,
    Form3,
  },
  setup() {
    const message = useMessage();
    const router = useRouter();
    const route = useRoute();
    const modelSn = ref('');
    const versionSn = ref('');
    const mode = ref('');

    const current = ref(1);
    const currentStatus = ref<StepsProps['status']>('process');
    const title = ref('Upload Model');
    const hideSteps = ref(false);
    const completeVisible = ref(false);
    const completeTitle = ref('');

    onMounted(() => {
      const queryModelSn = (route.params.modelSn as string) || '-1';
      const queryVersionSn = (route.params.versionSn as string) || '-1';
      if (queryModelSn === '-1' && queryVersionSn === '-1') {
        mode.value = 'add';
      } else if (queryModelSn !== '-1' && queryVersionSn === '-1') {
        mode.value = 'modify-info';
      } else {
        mode.value = 'modify-version';
      }
      modelSn.value = queryModelSn;
      versionSn.value = queryVersionSn;
    });

    return {
      modelSn,
      versionSn,
      mode,
      current,
      currentStatus,
      title,
      hideSteps,
      completeVisible,
      completeTitle,
      //Form1 Events
      onFormPrev1() {
        console.info(`window.opener?.postMessage({ type: 'emchub-upload-cancel' }, '*')`);
        window.opener?.postMessage({ type: 'emchub-upload-cancel' }, '*');
      },
      onFormSubmit1({ modelSn: _modelSn }: { modelSn: string }) {
        modelSn.value = _modelSn;
        if (mode.value === 'add') {
          current.value = 2;
        } else {
          current.value = 4;
        }
      },
      onFormReview1({ modelSn: _modelSn }: { modelSn: string }) {
        current.value = 4;
      },
      //Form2 Events
      onFormPrev2() {
        current.value = 1;
      },
      onFormSubmit2({ versionSn: _versionSn }: { versionSn: string }) {
        versionSn.value = _versionSn;
        current.value = 3;
      },
      onFormReview2({ modelSn: _modelSn }: { modelSn: string }) {
        current.value = 4;
      },
      //Form3 Events
      onFormPrev3() {
        current.value = 2;
      },
      onFormSubmit3() {
        current.value = 4;
      },
      onFormReview3() {
        current.value = 4;
      },
      onPressDone() {
        console.info(`window.opener?.postMessage({ type: 'emchub-upload-done' }, '*')`);
        window.opener?.postMessage({ type: 'emchub-upload-done' }, '*');
      },
    };
  },
});
</script>

<style scoped>
.page {
}
</style>
