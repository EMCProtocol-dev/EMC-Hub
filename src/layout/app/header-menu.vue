<template>
  <NDropdown :options="options" size="large" @select="onSelect">
    <NButton type="default" circle strong quaternary size="large">
      <template #icon>
        <NIcon size="28"><IconMenu /></NIcon>
      </template>
    </NButton>
  </NDropdown>
</template>
<script lang="ts">
import { defineComponent, h } from 'vue';
import type { Component } from 'vue';
import { useRouter } from 'vue-router';
import { NSpace, NText, NIcon, NDropdown, NButton } from 'naive-ui';
import type { DropdownOption } from 'naive-ui';
import type { TabItem } from './header-tabs';
import HeaderUser from './header-user.vue';
import { MenuSharp as IconMenu } from '@vicons/ionicons5';

const renderLabel = (label: string) => h(NText, null, { default: () => label });

const renderIcon = (icon: Component) => h(NIcon, { size: 28 }, { default: () => h(icon) });

const renderMenuItem = (label: string) => {
  return () =>
    h(
      NSpace,
      { align: 'center', wrapItem: false, style: 'line-height:1.6;height:40px;' },
      { default: () => [renderLabel(label)] }
    );
};

const renderMenuHeader = () => {
  return h('div', { style: 'padding:8px;' }, { default: () => [h(HeaderUser)] });
};

export default defineComponent({
  components: { NSpace, NDropdown, NIcon, NText, NButton, HeaderUser, IconMenu },
  props: { config: { type: Array<TabItem>, default: (): TabItem[] => [] } },
  setup(props, context) {
    const router = useRouter();

    const options: DropdownOption[] = [
      { key: 'header', type: 'render', render: renderMenuHeader },
      { key: 'header-divider', type: 'divider' },
    ];

    props.config.forEach((item: TabItem) => {
      options.push({ key: item.path, label: renderMenuItem(item.name) });
    });

    return {
      options,
      onSelect(path: string) {
        if (path.startsWith('http')) {
          window.open(path);
        } else {
          router.push(path);
        }
      },
    };
  },
});
</script>
