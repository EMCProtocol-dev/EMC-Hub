<template>
	<div class="tabs-nav" vertical :wrap-item="false">
		<NCollapse :trigger-areas="['main']" :accordion="true" arrow-placement="right" :expanded-names="currentName">
			<template v-for="item in tabs">
				<NCollapseItem :name="item.name" style="margin: 0">
					<template #header>
						<div :class="['tabs-nav-item', currentKey === item.path ? 'tabs-nav-item__active' : '']"
							@click="onPressItem(item)">
							<img class="tabs-nav-item-icon" :src="item.icon" />
							<span>{{ item.label }} </span>
						</div>
					</template>
					<template #arrow>
						<NIcon>
							<template v-if="item.children && item.children.length > 0">
								<IconArrowRight />
							</template>
						</NIcon>
					</template>
					<template v-for="sub in item.children">
						<div :class="['tabs-nav-children', currentKey === sub.path ? 'tabs-nav-item__active' : '']"
							@click="onPressItem(sub)">
							<span>{{ sub.label }} </span>
						</div>
					</template>
				</NCollapseItem>
			</template>
		</NCollapse>
	</div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { NCollapse, NCollapseItem, NIcon } from 'naive-ui';
import { ChevronForwardSharp as IconArrowRight } from '@vicons/ionicons5';
import { useRoute, useRouter } from 'vue-router';
import tabIcon1 from '@/assets/icon_profile.png';
import tabIcon3 from '@/assets/icon_upload.png';
import tabIcon4 from '@/assets/icon_wallet.png';
import tabIcon5 from '@/assets/icon_apikeys.png';

type Tab = {
	name: string;
	label: string;
	path: string;
	icon?: any;
	children?: Array<Tab>;
};

const route = useRoute();
const router = useRouter();

const currentName = ref('');
const currentKey = ref('');

const tabs = ref<Tab[]>([
	{ path: '/user/profile', name: 'profile', icon: tabIcon1, label: 'Profile' },
	{ path: '/user/post', name: 'post', icon: tabIcon3, label: 'Post' },
	{ path: '/user/wallet', name: 'wallet', icon: tabIcon4, label: 'Wallet' },
	// {
	// 	name: 'wallet',
	// 	label: 'Wallet',
	// 	path: '',
	// 	icon: tabIcon4,
	// 	children: [
	// 		{ path: '/user/balance', name: 'wallet', label: 'Balance' },
	// 		{ path: '/user/upgrade', name: 'wallet', label: 'Upgrade' }
	// 	],
	// },
	{
		name: 'apiKeys',
		label: 'API Keys',
		path: '',
		icon: tabIcon5,
		children: [
			{ path: '/user/usage', name: 'apiKeys', label: 'Usage' },
			{ path: '/user/key', name: 'apiKeys', label: 'key' }
		]
	},
]);

function findTab(tabs: Tab[], path: string) {
	console.log('findTab', tabs, path)
	for (let i = 0; i < tabs.length; i++) {
		const item = tabs[i];
		console.log(item, item.children && item.children.length > 0)
		if (item.children && item.children.length > 0) {
			return findTab(item.children, path);
		} else if (item.path === path) {
			return item;
		}
	}
}

watch(
	() => route.path,
	(path, oldVal) => {
		const item = findTab(tabs.value, path);
		currentKey.value = item?.path || '';
		if (item?.name === 'wallet' || item?.name === 'apiKeys') {
			currentName.value = item?.name;
		} else {
			currentName.value = '';
		}
	},
	{ immediate: true }
);

const onPressItem = (item: Tab) => {
	if (!item.children || !item.children.length) {
		router.push({ path: item.path });
	} else {
		router.push({ path: item.children[0].path });
	}
};
</script>
<style scoped>
.tabs-nav {
	width: 200px;
	height: 100%;
	border-radius: 20px;
	box-sizing: border-box;
	background-color: #fff;
	padding: 12px;
}

.tabs-nav-item {
	width: 100%;
	height: 44px;
	line-height: 44px;
	padding: 0 12px;
	border-radius: 10px;

	display: flex;
	align-items: center;

	cursor: pointer;
	box-sizing: border-box;
}

.tabs-nav-children {
	width: 100%;
	height: 44px;
	line-height: 44px;
	border-radius: 10px;
	cursor: pointer;
	box-sizing: border-box;
	padding-left: 46px;
}

.tabs-nav-item-icon {
	width: 20px;
	height: 20px;
	margin-right: 12px;
}

.tabs-nav-item__active {
	background-color: #faf8ff;
}

.tabs-nav:deep(.n-collapse .n-collapse-item) {
	border-top: none;
}</style>
