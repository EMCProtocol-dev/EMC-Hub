<template>
    <div class="header-user">
        <template v-if="user.id">
            <NPopover trigger="click" :show-arrow="false">
                <template #trigger>
                    <NSpace class="user" align="center" :wrap-item="false" :wrap="false">
                        <template v-if="!user.avatar">
                            <NIconWrapper :size="40" :border-radius="8" color="#f1f1f1" icon-color="#666666">
                                <NIcon size="24" style="cursor: pointer">
                                    <IconPerson />
                                </NIcon>
                            </NIconWrapper>
                        </template>
                        <template v-else>
                            <img class="avatar" :src="user.avatar" />
                        </template>
                        <div class="user-body">
                            <div class="user-body-row">
                                <NText class="nickname" strong>Hi, {{ user.nickname }}</NText>
                                <!-- <NDivider vertical /> -->
                                <!-- secondary  -->
                                <!-- <NButton type="default" circle strong quaternary @click="onPressSignOut">
                                <template #icon>
                                    <NIcon style="margin-right: -2px"><IconExit /></NIcon>
                                </template>
                                </NButton> -->
                            </div>
                        </div>
                    </NSpace>
                </template>
                <div class="user-info">
                    <div class="user-info-top">
                        <template v-if="!user.avatar">
                            <NIconWrapper :size="40" :border-radius="8" color="#f1f1f1" icon-color="#666666">
                                <NIcon size="24">
                                    <IconPerson />
                                </NIcon>
                            </NIconWrapper>
                        </template>
                        <template v-else>
                            <img class="avatar" :src="user.avatar" @click="onPressUser" />
                        </template>
                        <div class="user-info-nickname">
                            <span>{{ user.nickname }}</span>
                        </div>
                        <NIcon size="24" color="#999" style="cursor: pointer" @click="onPressUser">
                            <ChevronForwardCircle />
                        </NIcon>
                    </div>
                    <div class="user-info-balance">
                        <p class="balance-title">EMC Balance</p>
                        <p class="balance-value">0</p>
                    </div>
                    <p class="user-info-quick">Quick entry</p>
                    <div class="user-info-entry">
                        <div class="entry-list">
                            <n-icon size="20" color="#333">
                                <CubeOutline />
                            </n-icon>
                        </div>
                        <div class="entry-list">
                            <img src="../../assets/image-upload.svg" alt="" />
                        </div>
                        <div class="entry-list">
                            <img src="../../assets/gift-box.svg" alt="" />
                        </div>
                    </div>
                    <div class="user-info-footer">
                        <div class="user-info-btn" @click="onPressSignOut">
                            <n-icon size="20" color="#333">
                                <IconExit />
                            </n-icon>
                            <span>Logout</span>
                        </div>
                    </div>
                </div>
            </NPopover>
        </template>
        <template v-else>
            <SignInGoogle />
            <!-- <NButton class="btn-sign" type="default" size="large" strong @click="onPressSignIn">Sign In</NButton> -->
        </template>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { NButton, NSpace, NIconWrapper, NText, NDivider, NIcon, NPopover } from 'naive-ui';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { PersonSharp as IconPerson, ExitOutline as IconExit, ChevronForwardCircle, CubeOutline } from '@vicons/ionicons5';
import SignInGoogle from '@/pages/auth/signin-google.vue';

const router = useRouter();
const userStore = useUserStore();
const user = computed(() => userStore.user)
const onPressSignIn = () => {
    router.push({ name: 'auth' });
}
const onPressUser = () => {
    router.push({ name: 'user', params: { sign: 'profile' } });
}
const onPressSignOut = () => {
    userStore.signOut();
    router.push({ name: 'home' });
}
</script>

<style lang="less" scoped>
.header-user {
    max-width: 240px;
}

.nickname {
    max-width: 8em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    cursor: pointer;
    object-fit: cover;
}

.user-body-row {
    display: flex;
    align-items: center;
}

.user-body-row:not(:last-child) {
    margin-bottom: 4px;
}

.btn-sign {
    width: 160px;
}

.user-info {
    width: 372px;
    padding: 5px 6px 12px;

    .user-info-top {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .user-info-nickname {
            flex-grow: 1;

            span {
                padding: 6px 12px;
                margin: 0 16px;
                border-radius: 36px;
                background-color: #F5F5F5;
            }
        }
    }

    .user-info-balance {
        margin-top: 20px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        border-radius: 16px;
        background: linear-gradient(96deg, #A57CFE 0%, #D6A1FF 98.18%);

        .balance-title {
            margin: 0;
            padding: 0;
            color: #333;
            font-size: 16px;
            line-height: 16px;
        }

        .balance-value {
            margin: 18px 0 0 0;
            padding: 0;
            color: #333;
            font-size: 22px;
            font-weight: 500;
            line-height: 22px;
        }
    }

    .user-info-quick {
        margin: 20px 0;
        color: #333;
        font-size: 14px;
        line-height: 14px;
    }

    .user-info-entry {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .entry-list {
            width: 80px;
            height: 44px;
            flex-shrink: 0;
            border-radius: 8px;
            border: 1px solid #E8E8E8;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .user-info-footer {
        // flex justify-center items-center pt-[13px] mt-[20px] border-t border-dashed border-[#E4DFF0]
        padding-top: 13px;
        margin-top: 20px;
        border-top: 1px dashed #E4DFF0;
        display: flex;
        justify-content: center;
        align-items: center;

        .user-info-btn {
            // flex justify-center items-center h-[34px] px-[14px] rounded-[3px] cursor-pointer hover:bg-[rgba(46,51,56,.09)]
            height: 34px;
            padding: 0 14px;
            border-radius: 3px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;

            &:hover {
                background-color: rgba(46, 51, 56, .09);
            }

            span {
                // ml-[12px] text-[14px] text-[#333]
                margin-left: 12px;
                font-size: 14px;
                color: #333;
            }
        }
    }
}
</style>
