<template>
 <n-modal
    v-model:show="props.active"
    title="Create new secret key"
    positive-text="Create secret key"
    negative-text="Cancel"
    @positive-click="submitCallback"
    @negative-click="cancelCallback"
  >
  <n-form ref="formRef" :model="model">
    <n-form-item path="name" label="NAME">
      <n-input v-model:value="model.name" @keydown.enter.prevent />
    </n-form-item>
    </n-form>
  </n-modal>
</template>
<script setup lang="ts">
import {ref,toRefs} from 'vue'
import {NModal,NForm,NFormItem,NInput,FormItemRule,FormRules} from 'naive-ui'
const rules: FormRules = {
  name: [{
    message: 'please input name'
}]
}


const props = defineProps({
  active: {
        type: Boolean,
        default: false
    }
})

const model = ref({name:null})
const submitCallback = () => {

}

const cancelCallback = () => {
  
}

</script>