<template>
  <NSpace class="page" vertical :wrap-item="false" align="center" :size="[0, 56]">
    <!-- <NH2 style="width: 100%; text-align: left">Your profile</NH2> -->
    <NForm ref="formRef" :model="formData">
      <NSpace class="form" vertical>
        <NUpload style="margin: 0 auto; width: 124px" :custom-request="handleUploadImage" :show-file-list="false">
          <div style="position: relative; cursor: pointer">
            <NAvatar :src="formData.avatar" round :size="124" object-fit="cover" />
            <div class="form-upload-icon">
              <img src="@/assets/icon_avatar_upload.png" />
            </div>
          </div>
        </NUpload>
        <NFormItem path="" label="Nick name" label-style="font-size:12px;">
          <NInput v-model:value="formData.nickname" maxlength="20" show-count placeholder="" :style="inputStyle" @keydown.enter.prevent />
        </NFormItem>
        <NFormItem path="" label="Description" label-style="font-size:12px;">
          <NInput
            v-model:value="formData.description"
            type="textarea"
            :autosize="{
              minRows: 1,
              maxRows: 3,
            }"
            :maxlength="200"
            show-count
            placeholder=""
            :style="inputStyle"
            @keydown.enter.prevent
          />
        </NFormItem>
        <NSpace :size="[24, 0]" justify="end" style="margin-top: 20px">
          <!-- <NButton class="form-btn" color="#A45EFF" ghost size="large">Cannel</NButton> -->
          <NButton class="form-btn" type="primary" color="#A45EFF" size="large" :loading="submitting" @click.stop.prevent="onPressSubmit">Update</NButton>
        </NSpace>
      </NSpace>
    </NForm>
  </NSpace>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { NButton, NSpace, NUpload, NAvatar, NForm, NFormItem, NInput, UploadCustomRequestOptions, useMessage } from 'naive-ui';
import { Http } from '@/tools/http';
import { fileToSha256Hex } from '@/tools/file-sha256';
import { useMinio } from '@/composables/use-minio';
import { useUserStore } from '@/stores/user';

type TypeUser = {
  id: string;
  nickname: string;
  avatar: string;
  description: string;
};

type PresignOptions = {
  fileName: string;
  fileType: string;
  fileHash: string;
  fileSize: number;
  signType: number;
  userId: string | number;
};
const STORAGE_KEY = 'emchub.user';
const http = Http.getInstance();
const userStore = useUserStore();
const { upload, presignedHttp } = useMinio();
const message = useMessage();
const submitting = ref(false);
const formData = ref<TypeUser>({
  id: userStore.user.id as string,
  nickname: '',
  avatar: '',
  description: '',
});

onMounted(() => {
  init();
});
const init = async () => {
  const userInfo = userStore.user;
  formData.value.nickname = userInfo.nickname || '-';
  formData.value.avatar = userInfo.avatar;
  formData.value.description = userInfo.description || '~';
};

const handleUploadImage = async (params: UploadCustomRequestOptions) => {
  const { file, headers, withCredentials, onFinish, onError, onProgress } = params;
  const fileHash = await fileToSha256Hex(file.file as File);
  if (!fileHash) {
    onError();
    message.error('file hash error');
    return;
  }
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
  formData.value.avatar = url;
  onFinish();
};

const onPressSubmit = async () => {
  const { id, nickname, avatar, description } = formData.value;
  submitting.value = true;
  const resp = await http.post({
    url: 'emchub/api/client/user/updateUserInfo',
    data: { username: nickname, userImage: avatar, description: description },
  });
  submitting.value = false;
  if (resp._result !== 0) return;
  const user = {
    id,
    nickname,
    avatar,
    description,
  };
  userStore.setUser(user);

  message.success('Update success');
};

const inputStyle = computed(() => {
  return {
    backgroundColor: '#f5f5f5',
  };
});
</script>
<style scoped>
.page {
  width: 100%;
  padding: 24px;
  border-radius: 20px;
  background-color: #fff;
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
