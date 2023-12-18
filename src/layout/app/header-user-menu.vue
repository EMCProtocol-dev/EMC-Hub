<template>
  <template v-if="disabled">
    <slot></slot>
  </template>
  <template v-else>
    <NDropdown :options="userMenus" size="large" @select="onSelect">
      <slot></slot>
    </NDropdown>
  </template>
</template>
<script lang="ts">
/**
 * @deprecated
 */
import { defineComponent, h } from 'vue';
import type { Component } from 'vue';
import { NSpace, NText, NIcon, NDropdown } from 'naive-ui';
import { LogOutSharp as IconSignOut } from '@vicons/ionicons5';

const renderLabel = (label: string) => h(NText, null, { default: () => label });

const renderIcon = (icon: Component) => h(NIcon, { size: 28 }, { default: () => h(icon) });

const renderMenuItem = (label: string, icon: Component) => {
  return () =>
    h(
      NSpace,
      { align: 'center', wrapItem: false, style: 'line-height:1.6;height:40px;' },
      { default: () => [renderIcon(icon), renderLabel(label)] }
    );
};
const userMenus = [{ key: 'signout', label: renderMenuItem('Sign out', IconSignOut) }];

export default defineComponent({
  components: { NSpace, NDropdown, NIcon, NText },
  props: { disabled: { type: Boolean, default: false } },
  emits: ['select'],
  setup(props, context) {
    return {
      userMenus,
      onSelect(key: string) {
        context.emit('select', key);
      },
    };
  },
});
</script>
