<template>
    <n-modal v-model:show="showModal" :on-mask-click="handleClose">
        <n-card style="width: 670px" title="Create new secret key" :bordered="false" size="huge" role="dialog" aria-modal="true">
            <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
                <n-form-item path="name" label="Name">
                    <n-input v-model:value="model.name" placeholder="My Test Key" @keydown.enter.prevent />
                </n-form-item>
            </n-form>
            <div class="modal-footer">
                <n-button color="#F5F5F5" size="large" class="cancle" @click="handleClose">Cancel</n-button>
                <n-button color="#A45EFF" size="large">Create secret key</n-button>
            </div>
        </n-card>
    </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { NButton, NCard, NForm, NFormItem, NInput, NModal, FormInst, FormRules } from 'naive-ui';

interface modelType {
    name: string
}

const showModal = ref(false)
const formRef = ref<FormInst | null>(null)
const model = ref<modelType>({
    name: ''
})
const rules: FormRules = {
    name: [{
        required: true,
        message: 'please input name',
        trigger: 'blur'
    }]
}

const emits = defineEmits(['ok']);

const handleClose = () => {
    showModal.value = false
}

/*
 * ==============================================
 * 组件间传参相关
 * ==============================================
 */
const handleShow = async () => {
    model.value = {
        name: ''
    }
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
