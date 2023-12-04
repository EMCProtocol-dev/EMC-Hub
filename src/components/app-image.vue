<template>
  <NImage v-bind="$props" :src="ssrc" />
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import type { PropType } from 'vue';
import { NImage } from 'naive-ui';
export default defineComponent({
  name: 'app-image',
  components: { NImage },
  props: {
    src: { type: String, default: '' },
    externalBasePath: { type: String, default: '' },
    width: [String, Number],
    height: [String, Number],
    objectFit: { type: String as PropType<'fill' | 'none' | 'contain' | 'cover' | 'scale-down'>, default: 'fill' },
    alt: String,
    fallbackSrc: String,
    imgProps: Object,
    lazy: Boolean,
    intersectionObserverOptions: Object,
    previewSrc: String,
    previewDisabled: Boolean,
    previewedImgProps: Object,
    showToolbar: { type: Boolean, default: true },
    showToolbarTooltip: Boolean,
    onError: Function as PropType<(e: Event) => void>,
    onLoad: Function as PropType<(e: Event) => void>,
  },
  setup(props) {
    const appendExternalBasePath = (url: string) => !url.startsWith('http') && !url.startsWith('//');
    return {
      ssrc: computed(() => (appendExternalBasePath(props.src) ? `${props.externalBasePath}${props.src}` : props.src)),
    };
  },
});
</script>
