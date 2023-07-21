<template>
  <div class="page">model detail</div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { NDatePicker } from 'naive-ui';
import moment from 'moment';

export default defineComponent({
  components: {
    NDatePicker,
  },
  setup() {
    const router = useRouter();
    const nodeId = ref(router.currentRoute.value.params.id);

    return {};
  },
});
</script>

<style scoped></style>
