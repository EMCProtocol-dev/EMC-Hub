<template>
    <NButton :text="true" class="ml-8px" @click="copyKey">
        <NIcon color="#A45EFF">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <g clip-path="url(#clip0_1579_3269)">
                    <path
                        d="M3.79199 3.62605V2.27881C3.79199 1.82576 4.15926 1.4585 4.6123 1.4585H11.7217C12.1747 1.4585 12.542 1.82576 12.542 2.27881V9.38818C12.542 9.84123 12.1747 10.2085 11.7217 10.2085H10.3592"
                        stroke="#A45EFF" />
                    <path
                        d="M9.3877 3.7915H2.27832C1.82527 3.7915 1.45801 4.15877 1.45801 4.61182V11.7212C1.45801 12.1742 1.82527 12.5415 2.27832 12.5415H9.3877C9.84074 12.5415 10.208 12.1742 10.208 11.7212V4.61182C10.208 4.15877 9.84074 3.7915 9.3877 3.7915Z"
                        stroke="#A45EFF" />
                </g>
                <defs>
                    <clipPath id="clip0_1579_3269">
                        <rect width="14" height="14" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        </NIcon>
    </NButton>
    <NPopover>
        <template #trigger>
            <NButton :text="true" class="ml-8px">
                <NIcon color="#A45EFF">
                    <EyeOutline />
                </NIcon>
            </NButton>
        </template>
        <span>{{ props.name }}</span>
    </NPopover>
</template>

<script lang="ts" setup>
import { EyeOutline } from '@vicons/ionicons5';
import { NButton, NIcon, NPopover, useMessage } from 'naive-ui';
import { Utils } from '@/tools/utils';

const props = defineProps({
    name: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    }
})

const message = useMessage()

const copyKey = async () => {
    await Utils.handleCopy(props.name)
    message.info(`COPY ${props.title} SUCCESSFUL !`)
}
</script>

<style lang="less" scoped>
.ml-8px {
    margin-left: 8px;
}</style>
