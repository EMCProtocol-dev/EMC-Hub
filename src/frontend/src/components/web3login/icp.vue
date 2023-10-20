<template>
    <div class="content">
        <p class="title">Connect Web3 Identity</p>
        <em class="tip">You need to connect an Identity</em>
        <div class="login-way" :class="loginLoading ? 'loading' : ''">
            <div class="loading-box">
                <i @click="loginLoading = false">Cancel</i>
                <img src="@/assets/icon_loading.svg" alt="">
                loading...
            </div>
            <div class="login-item" @click="login('ii')">
                <div>
                    <img src="@/assets/icon_ic.svg" alt="">
                </div>
                <p>INTERNET IDENTITY</p>
            </div>
            <div class="login-item" @click="login('astrox')">
                <div>
                    <img src="@/assets/icon_me.svg" alt="">
                </div>
                <p>Astro ME</p>
            </div>
            <div class="login-item" @click="login('plug')">
                <div class="plug">
                    <img src="@/assets/icon_plug.png" alt="">
                </div>
                <p>Plug</p>
            </div>
        </div>
        <div class="desc">
            If you don't have a wallet, you can select a provider and create one now.
        </div>
    </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import { Client, createClient } from '@connect2ic/core';
import { AstroX, ICX, InfinityWallet } from '@connect2ic/core/providers';
import { CustomInternetIdentity, getIIFrame } from './providers/ii';
import { handleIdentityAgent, handlePlugAgent } from "./fc"
import { Agent } from '@dfinity/agent';
import { MetamaskAuthIC } from './providers/metamask';

export default defineComponent({
    name: 'icp',
    components: {},
    emits: ['onSuccess'],
    setup(props, context) {
        const loginLoading = ref<boolean>(false)
        // 身份
        const agent = ref<Agent | undefined>(undefined)

        const astroXProvider = (window as any).icx
            ? new ICX({
                delegationModes: ['domain', 'global'],
                dev: false,
            })
            : new AstroX({
                delegationModes: ['domain', 'global'],
                dev: false,
            });
        const infinityProvider = new InfinityWallet();
        const iiProvider = new CustomInternetIdentity({
            windowOpenerFeatures: window.innerWidth < 768 ? undefined : getIIFrame(),
        });
        const metamaskProvider = new MetamaskAuthIC();
        const globalProviderConfig = {
            appName: 'EMC-Hub',
            dev: false,
            autoConnect: false,
            host: location.origin,
            customDomain: '',
            whitelist: ['ryjl3-tyaaa-aaaaa-aaaba-cai', 'aanaa-xaaaa-aaaah-aaeiq-cai'],
        };

        const client: Client = createClient({
            providers: [
                astroXProvider as any,
                metamaskProvider,
                infinityProvider,
                iiProvider,
            ],
            globalProviderConfig,
        });

        // 初始化成功
        client.on('init', async (e) => {
            client.disconnect()
        });

        // 监听登录成功
        client.on('connect', async (e) => {
            setTimeout(() => {
                loginLoading.value = false
                let identity;
                if (e.activeProvider.meta.id === 'astrox') {
                    identity = window.ic.astrox.identity;
                } else if (e.activeProvider.meta.id === 'icx') {
                    identity = window.icx._identity;
                } else {
                    identity = e.activeProvider.identity;
                }
                agent.value = handleIdentityAgent(identity)
                afterLogin()
            }, 1000)
        });

        const login = async (way: 'ii' | 'astrox' | 'plug') => {
            loginLoading.value = true

            if (way === 'plug') {
                let res = await handlePlugAgent(['ryjl3-tyaaa-aaaaa-aaaba-cai', 'aanaa-xaaaa-aaaah-aaeiq-cai'], "manual");
                if (agent) {
                    agent.value = res
                    afterLogin()
                }
            } else {
                if (!client) {
                    window.$message.error('Failed to initialize the login component')
                    return
                }
                await client.disconnect()

                setTimeout(() => {
                    if (way === 'astrox' && !!window.icx) {
                        client.connect('icx');
                    } else {
                        client.connect(way);
                    }
                }, 1000)
            }
        }

        // 登录成功后
        const afterLogin = () => {
            context.emit('onSuccess', agent.value)
            loginLoading.value = false
        }

        return {
            loginLoading,
            login
        };
    },
});
</script>

<style scoped>
.content {
    margin-top: 32px;
    display: flex;
    flex-direction: column;
}

.title {
    margin: 0;
    color: #333;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
}

.tip {
    color: #999;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    margin-top: 16px;
    margin-bottom: 0;
}

.login-way {
    display: flex;
    border-radius: 6px;
    border: 1px solid #E5E4E9;
    height: 120px;
    margin-top: 24px;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}


.login-way .loading-box {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(255, 255, 255, .8);
    display: none;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.login-way .loading-box img {
    width: 20px;
    height: 20px;
    margin-bottom: 5px;
}

.login-way.loading .loading-box {
    display: flex;
    color: #333;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 14px;
}

.login-way.loading .loading-box i {
    position: absolute;
    right: 0;
    top: 0;
    border-radius: 0 0 0 15px;
    border: 1px solid #e8e8e8;
    padding: 3px 10px;
    color: #333;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 12px;
    cursor: pointer;
}

.login-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 100%;
    flex-direction: column;
    cursor: pointer;
    border-right: 1px solid #e8e8e8;
}

.login-item:last-child {
    border-right: none;
}

.login-item div {
    width: 56px;
    height: 56px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-item div img {
    width: 52px;
}

.login-item div.plug img {
    width: 32px;
}

.login-item p {
    color: #333;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 14px;
    margin: 0;
}

.desc {
    color: #999;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 12px;
    margin-top: 32px;
    text-align: center;
}
</style>
