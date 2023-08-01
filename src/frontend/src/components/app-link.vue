<template>
  <a
    :href="path"
    :target="target"
    :rel="rel"
    :class="[
      linkClass,
      {
        [activeClass]: isActive,
        [exactActiveClass]: isExactActive,
      },
    ]"
    @click="onClick"
  >
    <slot></slot>
  </a>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue';
import { useLink } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';

export interface Props {
  link: RouteLocationRaw;
  external?: boolean;
  internal?: boolean;
  disabled?: boolean;
  rel?: string;
  target?: string;
  openInNewTab?: boolean;
  replace?: boolean;
  activeClass?: string;
  exactActiveClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  external: false,
  internal: false,
  replace: false,
  append: false,
  openInNewTab: false,
  disabled: false,
  activeClass: 'router-link-active',
  exactActiveClass: 'router-link-exact-active',
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const target = computed(() => {
  if (props.target) return props.target;
  if (props.openInNewTab) return '_blank';
  return null;
});

// TODO: Correct styling is currently missing.
const linkClass = computed(() => {
  if (props.disabled) {
    return 'pointer-events-none';
  }
  return '';
});

const { href, route, navigate, isActive, isExactActive } = useLink({
  to: toRef(props, 'link'),
  replace: toRef(props, 'replace'),
});

const isInternalLink = computed(() => {
  if (props.external) return false;
  if (props.internal) return true;
  if (route.value.fullPath.startsWith('/#')) return false;
  return route.value.matched.length > 0 && route.value.name !== 'Error';
});

const path = computed(() => {
  if (isInternalLink.value) {
    return href.value;
  }

  return props.link as string;
});

const onClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    return;
  }
  emit('click', event);

  if (isInternalLink.value) {
    navigate(event);
  }

  // Stop the scroll-to-top behavior or navigation on regular links when href is just '#'.
  if (!isInternalLink.value && props.link === '#') {
    event.preventDefault();
  }
};
</script>
