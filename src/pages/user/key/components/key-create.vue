<template>
    <n-modal v-model:show="showModal" :on-mask-click="handleClose">
        <n-card style="width: 670px" title="Create new secret key" :bordered="false" size="huge" role="dialog" aria-modal="true">
            <n-spin :show="loading">
                <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
                    <n-form-item path="appName" label="Name">
                        <n-input v-model:value="model.appName" placeholder="My Test Key" @keydown.enter.prevent />
                    </n-form-item>
                </n-form>
                <div class="modal-footer">
                    <n-button color="#F5F5F5" size="large" class="cancle" @click="handleClose">Cancel</n-button>
                    <n-button color="#A45EFF" size="large" @click="handleSubmit">Create secret key</n-button>
                </div>
            </n-spin>
        </n-card>
    </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { NButton, NCard, NForm, NFormItem, NInput, NModal, NSpin, FormInst, FormRules, useMessage } from 'naive-ui';
import { Http } from '@/tools/http';

const http = Http.getInstance();
const message = useMessage()

interface modelType {
    appName: string
}

const showModal = ref(false)
const loading = ref(false)
const formRef = ref<FormInst | null>(null)
const model = ref<modelType>({
    appName: ''
})
const rules: FormRules = {
    appName: [{
        required: true,
        message: 'please input name',
        trigger: 'blur'
    }]
}

const emits = defineEmits(['ok']);

const handleClose = () => {
    loading.value = false
    showModal.value = false
}
const handleSubmit = (e: MouseEvent) => {
    e.preventDefault()
    loading.value = true
    formRef.value?.validate(async (errors) => {
        if (errors) {
            loading.value = false
            return
        }
        const res = await http.postJSON({
            url: '/emchub/api/client/userAppInfo/saveOne',
            data: { ...model.value }
        })
        loading.value = false
        if (res._result !== 0) {
            message.error(res._desc);
            return
        } else {
            emits('ok')
            message.success('success');
            handleClose()
        }
    })
}

/*
 * ==============================================
 * 组件间传参相关
 * ==============================================
 */
const handleShow = async () => {
    model.value = {
        appName: ''
    }
    loading.value = false
    showModal.value = true
}
defineExpose({
    handleShow
})
/* ============================================== */
</script>

<style lang="less" scoped>
.cursor-pointer {
    cursor: pointer;
}

.modal-footer {
    padding: 10px 0;
    display: flex;
    justify-content: flex-end;
}
.cancle {
    --n-text-color: #333!important;
    --n-text-color-hover: #333!important;
    --n-color-focus: #333!important;
    --n-text-color-focus: #333!important;
    --n-text-color-pressed: #333!important;
    --n-color-focus: #F5F5F5!important;
    margin-right: 12px
}
</style>
