<template>
  <NPopover>
    <template #trigger>
      <NButton :text="true">
        <NIcon>
          <EyeOutline />
        </NIcon>
      </NButton>
    </template>
    <span>{{props.name}}</span>
  </NPopover>
</template>
<script setup lang="ts">

import { EyeOutline } from '@vicons/ionicons5'
import {
  NButton,
  NDivider,
  NH2,
  NSpace,
  DataTableColumns,
  useMessage,
  NDataTable,
  NIcon,
  NPopover
} from 'naive-ui';
import { StringDecoder } from 'string_decoder';

const props = defineProps({
  name: {
    type: String,
    default: ''
  }
})
console.log(props.name)
</script>