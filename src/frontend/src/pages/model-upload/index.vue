<<<<<<< HEAD
=======
<template>
  <div class="page">
    <NCard title="Upload Model">
      <template v-if="current < 3">
        <NSteps vertical :current="(current as number)" :status="currentStatus">
          <NStep title="Edit Info" description="">
            <NCard style="margin-top: 24px">
              <Form1 :disabled="current !== 1" @submit="onForm1Submit" />
            </NCard>
          </NStep>
          <NStep title="Upload Package" description="">
            <NCard style="margin-top: 24px">
              <template v-if="modelId">
                <NSpace align="center" :wrap-item="false" style="margin-bottom: 16px">
                  <NTag round type="info" :bordered="false" style="height: 40px">
                    <div style="font-size: 18px">{{ modelId }}</div>
                    <template #avatar>
                      <NIcon size="32">
                        <IconModel />
                      </NIcon>
                    </template>
                  </NTag>
                  <NButton strong secondary circle @click.stop.prevent="onPressCopy(modelId)">
                    <template #icon>
                      <IconCopy />
                    </template>
                  </NButton>
                </NSpace>
              </template>
              <Form2 :disabled="current !== 2" :model-id="modelId" @submit="onForm2Submit" />
            </NCard>
          </NStep>
        </NSteps>
      </template>
      <template v-else>
        <NSpace vertical justify="center" align="center" :size="[0, 24]" style="height: 60vh">
          <NIconWrapper :size="64" :border-radius="64">
            <NIcon :size="40">
              <IconSuccess />
            </NIcon>
          </NIconWrapper>
          <NH1>Successfully publish the model</NH1>
          <NSpace justify="center" align="center" :size="[24, 24]">
            <NButton type="default" ghost size="large" strong @click="onPressBack" style="width: 144px"> Back </NButton>
            <NButton type="primary" size="large" strong @click="onPressViewModel" style="width: 144px">
              View Model
            </NButton>
          </NSpace>
        </NSpace>
      </template>
    </NCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch, onActivated, ComputedRef } from 'vue';
import {
  NPagination,
  NSpace,
  NButton,
  NCard,
  NSpin,
  NSteps,
  NStep,
  NTag,
  NIconWrapper,
  NIcon,
  NH1,
  NText,
  useMessage,
} from 'naive-ui';
import { StepsProps } from 'naive-ui';
import copy from 'copy-to-clipboard';
import { CopySharp as IconCopy, CubeSharp as IconModel, CheckmarkSharp as IconSuccess } from '@vicons/ionicons5';
import { useRouter } from 'vue-router';
import Form1 from './form1.vue';
import Form2 from './form2.vue';

export default defineComponent({
  name: 'model-upload',
  components: {
    NPagination,
    NSpace,
    NButton,
    NCard,
    NSpin,
    NSteps,
    NStep,
    Form1,
    Form2,
    IconCopy,
    NTag,
    NIconWrapper,
    NIcon,
    NH1,
    NText,
    IconModel,
    IconSuccess,
  },
  setup() {
    const current = ref(1);
    const currentStatus = ref<StepsProps['status']>('process');
    const modelId = ref('');
    const message = useMessage();
    const router = useRouter();
    return {
      current,
      currentStatus,
      modelId,
      onForm1Submit({ modelId: _modelId }: { modelId: string }) {
        current.value = 2;
        modelId.value = _modelId;
      },
      onPressCopy(val: string) {
        copy(val);
        message.success('Copied!');
      },
      onForm2Submit() {
        current.value = 3;
      },
      onPressBack() {
        router.back();
      },
      onPressViewModel() {
        router.back();
      },
    };
  },
});
</script>

<style scoped>
.page {
}
</style>
>>>>>>> 8b84a8c (~)
