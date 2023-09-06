<template>
  <NSpace class="page" vertical :wrap-item="false" align="center" :size="[0, 56]">
    <NH2 style="width: 100%; text-align: left">Your profile</NH2>
    <NForm>
      <NSpace class="form" vertical>
        <NUpload style="margin: 0 auto; width: 124px" action="">
          <div style="position: relative; cursor: pointer">
            <NAvatar round :size="124">User</NAvatar>
            <div class="form-upload-icon">
              <img src="@/assets/icon_avatar_upload.png" />
            </div>
          </div>
        </NUpload>
        <NFormItem path="account" label="name" label-style="font-size:12px;">
          <NInput v-model:value="formData.name" maxlength="20" show-count placeholder="" :style="inputStyle" @keydown.enter.prevent />
        </NFormItem>
        <NFormItem path="password" label="description" label-style="font-size:12px;">
          <NInput
            v-model:value="formData.description"
            type="textarea"
            :autosize="{
              minRows: 3,
              maxRows: 5,
            }"
            maxlength="100"
            show-count
            placeholder=""
            :style="inputStyle"
            @keydown.enter.prevent
          />
        </NFormItem>
        <NSpace :size="[24, 0]" justify="end" style="margin-top: 20px">
          <NButton class="form-btn" color="#A45EFF" ghost size="large">Cannel</NButton>
          <NButton class="form-btn" type="primary" color="#A45EFF" size="large" :loading="submitting" @click.stop.prevent="onPressSubmit">Upload</NButton>
        </NSpace>
      </NSpace>
    </NForm>
  </NSpace>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, watch, nextTick, computed } from 'vue';
import { NButton, NH2, NSpace, NCard, NUpload, NModal, NAvatar, NForm, NFormItem, NInput, NGrid, NGridItem, NIcon, NUl, NLi, useMessage } from 'naive-ui';

type TypeUser = {
  name: string;
  description: string;
};
export default defineComponent({
  name: 'user-profile',
  components: {
    NButton,
    NH2,
    NSpace,
    NCard,
    NModal,
    NGrid,
    NGridItem,
    NAvatar,
    NForm,
    NFormItem,
    NInput,
    NUpload,
    NIcon,
    NUl,
    NLi,
  },
  setup(props, context) {
    onMounted(() => {});
    const submitting = ref(false);
    const formData = ref<TypeUser>({
      name: '',
      description: '',
    });
    const inputStyle = computed(() => {
      return {
        backgroundColor: '#f5f5f5',
      };
    });
    return {
      formData,
      submitting,
      inputStyle,
      onPressSubmit() {},
    };
  },
});
</script>
<style scoped>
.page {
  width: 100%;
}
.form {
  width: 400px;
}
.form-upload-icon {
  position: absolute;
  right: 0;
  bottom: 4px;
  padding: 6px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0px 0px 6px 1px rgba(23, 47, 0, 0.2);

  box-sizing: border-box;
}
.form-btn {
  border-radius: 10px;
}
</style>
