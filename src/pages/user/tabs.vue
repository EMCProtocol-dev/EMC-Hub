<template>
    <div class="tabs-nav" vertical :wrap-item="false">
        <NCollapse :trigger-areas="['main']" :accordion="true" arrow-placement="right" :expanded-names="currentName">
            <template v-for="item in tabs" :key="item.name">
                <NCollapseItem class="tabs-collapse-item"
                    :class="{ 'tabs-collapse-item__active': currentKey === item.path }" :name="item.name"
                    @click="onPressItem(item)">
                    <template #header>
                        <n-icon size="20" class="tabs-nav-item-icon" v-html="item.icon"></n-icon>
                        <span>{{ item.label }} </span>
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
                            @click.stop="onPressItem(sub)">
                            <span>{{ sub.label }} </span>
                        </div>
                    </template>
                </NCollapseItem>
            </template>
        </NCollapse>

        <div class="user-logout" @click="onPressSignOut">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path d="M9.99654 2.5H4.5C3.39543 2.5 2.5 3.39543 2.5 4.5V15.5C2.5 16.6046 3.39543 17.5 4.5 17.5H10"
					stroke="#333333" stroke-linecap="round" stroke-linejoin="round" />
				<path d="M13.75 13.75L17.5 10L13.75 6.25" stroke="#333333" stroke-linecap="round" stroke-linejoin="round" />
				<path d="M6.66699 9.99658H17.5003" stroke="#333333" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
			<span>Logout</span>
		</div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { NCollapse, NCollapseItem, NIcon } from 'naive-ui';
import { ChevronForwardSharp as IconArrowRight } from '@vicons/ionicons5';
import { useRoute, useRouter } from 'vue-router';

type Tab = {
    name: string;
    label: string;
    path: string;
    icon?: string;
    children?: Array<Tab>;
};

const route = useRoute();
const router = useRouter();

const currentName = ref('');
const currentKey = ref('');

const tabs = ref<Tab[]>([
    { path: '/user/profile', name: 'profile', icon: "<svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'><g><path d='M10.0003 8.33317C11.8413 8.33317 13.3337 6.84079 13.3337 4.99984C13.3337 3.15889 11.8413 1.6665 10.0003 1.6665C8.15938 1.6665 6.66699 3.15889 6.66699 4.99984C6.66699 6.84079 8.15938 8.33317 10.0003 8.33317Z' stroke='#333' stroke-linecap='round' stroke-linejoin='round'/><path d='M17.5 18.3335C17.5 14.1914 14.1421 10.8335 10 10.8335C5.85787 10.8335 2.5 14.1914 2.5 18.3335' stroke='#333' stroke-linecap='round' stroke-linejoin='round'/></g></svg>", label: 'Profile' },
    { path: '/user/post', name: 'post', icon: "<svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'><g><path d='M10 2H4C2.89543 2 2 2.89543 2 4V16C2 17.1046 2.89543 18 4 18H16C17.1046 18 18 17.1046 18 16V10' stroke='#333' stroke-linecap='round'/><path d='M2.5 14.5835L6.95546 10.4993C7.26621 10.2144 7.74079 10.2065 8.06087 10.4809L13.3333 15.0002' stroke='#333' stroke-width='0.833333' stroke-linecap='round' stroke-linejoin='round'/><path d='M11.667 12.9166L13.6559 10.9277C13.9492 10.6344 14.4134 10.6014 14.7452 10.8503L17.5003 12.9166' stroke='#333' stroke-width='0.833333' stroke-linecap='round' stroke-linejoin='round'/><path d='M15.417 7.5V2.5' stroke='#333' stroke-width='0.833333' stroke-linecap='round' stroke-linejoin='round'/><path d='M13.333 4.58333L15.4163 2.5L17.4997 4.58333' stroke='#333' stroke-width='0.833333' stroke-linecap='round' stroke-linejoin='round'/></g></svg>", label: 'Post' },
    { path: '/user/wallet', name: 'wallet', icon: "<svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/sv'><g><path d='M14.6875 12.8868H18.3333V8.57129H14.6875C13.4794 8.57129 12.5 9.53735 12.5 10.729C12.5 11.9207 13.4794 12.8868 14.6875 12.8868Z' stroke='#333' stroke-linejoin='round'/><path d='M15 10.6472C15 10.7322 14.9839 10.8164 14.9525 10.895C14.9211 10.9735 14.875 11.0449 14.817 11.105C14.7589 11.1651 14.69 11.2128 14.6142 11.2454C14.5384 11.2779 14.4571 11.2946 14.375 11.2946C14.2929 11.2946 14.2116 11.2779 14.1358 11.2454C14.06 11.2128 13.9911 11.1651 13.933 11.105C13.875 11.0449 13.8289 10.9735 13.7975 10.895C13.7661 10.8164 13.75 10.7322 13.75 10.6472C13.75 10.4755 13.8159 10.3109 13.9331 10.1896C14.0503 10.0682 14.2093 10 14.375 10C14.5407 10 14.6997 10.0682 14.8169 10.1896C14.9341 10.3109 15 10.4755 15 10.6472Z' fill='#333'/><rect x='1.42871' y='4.28564' width='17.1429' height='12.8571' rx='2' stroke='#333'/><path d='M3.57129 7.14307H7.857' stroke='#333' stroke-linecap='round'/></g></svg>", label: 'Wallet' },
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
        icon: "<svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'><g><path d='M16.6667 9.1665H3.33333C2.8731 9.1665 2.5 9.5396 2.5 9.99984V17.4998C2.5 17.9601 2.8731 18.3332 3.33333 18.3332H16.6667C17.1269 18.3332 17.5 17.9601 17.5 17.4998V9.99984C17.5 9.5396 17.1269 9.1665 16.6667 9.1665Z' stroke='#333'/><path d='M5.83301 9.1665V5.83317C5.83301 3.53198 7.69851 1.6665 9.99967 1.6665C12.3008 1.6665 14.1663 3.53198 14.1663 5.83317V9.1665' stroke='#333'/><path d='M10 12.5V15' stroke='#333'/></g></svg>",
        children: [
            { path: '/user/usage', name: 'apiKeys', label: 'Usage' },
            { path: '/user/key', name: 'apiKeys', label: 'key' }
        ]
    },
]);

function findTab(tabs: Tab[], path: string) {
    for (let i = 0; i < tabs.length; i++) {
        const item = tabs[i];
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
        if (item?.name === 'apiKeys') {
            currentName.value = item?.name;
        } else {
            currentName.value = '';
        }
    },
    { immediate: true }
);

const onPressItem = (item: Tab) => {
    console.log('onPressItem', item)
    if (!item.children || !item.children.length) {
        router.push({ path: item.path });
    } else {
        router.push({ path: item.children[0].path });
    }
};

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
const onPressSignOut = () => {
    userStore.signOut();
    router.push({ name: 'home' });
}
</script>

<style lang="less" scoped>
.tabs-nav {
    width: 200px;
    height: 100%;
    border-radius: 20px;
    box-sizing: border-box;
    background-color: #fff;
    padding: 12px;
    position: relative;
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

.tabs-collapse-item {
    margin: 0;
    min-height: 44px;
    line-height: 44px;

    // padding: 0 12px;
    :deep(.n-collapse-item__header-main) {
        padding: 0 12px;
        border-radius: 10px;

        span {
            width: 100%;
        }
    }
}

.tabs-collapse-item__active {
    margin: 0;

    :deep(.n-collapse-item__header-main) {
        background-color: #FAF8FF;

        span {
            color: #A45EFF;
        }

        svg {
            path {
                stroke: #A45EFF;
            }
            rect {
                stroke: #A45EFF;
            }
        }
    }
}

.tabs-nav-item__active {
    background-color: #FAF8FF;
    color: #A45EFF;
}

.tabs-nav:deep(.n-collapse .n-collapse-item) {
    border-top: none;
}

.user-logout {
	width: 100%;
	height: 68px;
    padding: 24px;
	flex-shrink: 0;
	border-radius: 20px;
	background: #FFF;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: absolute;
    bottom: -84px;
    left: 0;

	span {
        margin-left: 20px;
		color: #333;
		font-size: 14px;
		line-height: 14px;
	}

	&:hover {
		svg {
			path {
				stroke: #A45EFF;
			}

			rect {
				stroke: #A45EFF;
			}
		}

		span {
			color: #A45EFF;
		}
	}
}
</style>
