<template>
  <NLayout
    position="absolute"
    style="background-color: blueviolet"
    content-style="display:flex;align-items:center;justify-content:center;"
  >
    <div class="content" :style="{ 'background-color': bgColor }">
      <NGrid cols="5" item-responsive>
        <NGridItem span="0 720:3">
          <div class="bg">
            <transition name="auth-fade">
              <template v-if="action === 'signup'">
                <img class="bg-img-overlay" src="@/assets/login-img1.png" key="signupimg" />
              </template>
              <template v-else>
                <img class="bg-img-overlay" src="@/assets/login-img.png" key="signinimg" />
              </template>
            </transition>
          </div>
        </NGridItem>
        <NGridItem span="5 720:2">
          <div class="form" :bordered="false" size="huge" :style="{ height: formHeight }">
            <template v-if="action === 'signin'">
              <div class="sign-header">
                <NSpace :wrap-item="false" justify="space-between" align="center">
                  <div class="sign-title">Edge Matrix Hub</div>
                  <NA class="sign-signup" @click="onPressSignUpToggle">Sign Up</NA>
                </NSpace>
                <div class="sign-subtitle">Welcome #AI</div>
              </div>

              <SignIn
                ref="signinRef"
                @signin="onSignInSuccess"
                @signinbefore="signinLoading = true"
                @signinafter="signinLoading = false"
              />
            </template>
            <template v-else-if="action === 'signup'">
              <div class="sign-header">
                <NSpace :wrap-item="false" justify="space-between" align="center">
                  <div class="sign-title">Edge Matrix Hub</div>
                  <NA class="sign-signup" @click="onPressSignUpToggle">Sign In</NA>
                </NSpace>
              </div>
              <SignUp
                @signup="onSignUpSuccess"
                @signupbefore="signupLoading = true"
                @signupafter="signupLoading = false"
              />
            </template>
          </div>
        </NGridItem>
      </NGrid>
    </div>
  </NLayout>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';
import { NLayout, NLayoutContent, NCard, NH1, NH3, NA, NSpace, NGrid, NGridItem } from 'naive-ui';
import SignUp from './signup.vue';
import SignIn from './signin.vue';

const bgImg1 = require('@/assets/login-img.png');
const bgImg2 = require('@/assets/login-img1.png');

export default defineComponent({
  name: 'auth',
  components: {
    NLayout,
    NLayoutContent,
    NCard,
    NH1,
    NH3,
    NA,
    NSpace,
    NGrid,
    NGridItem,
    SignUp,
    SignIn,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const action = ref('signin');
    const signinRef = ref<InstanceType<typeof SignIn>>();
    const signinLoading = ref(false);
    const signupLoading = ref(false);

    return {
      action,
      signinRef,
      signinLoading,
      signupLoading,
      formHeight: computed(() => {
        if (action.value === 'signup') {
          return '510px';
        } else {
          return '520px';
        }
      }),
      bgColor: computed(() => {
        if (action.value === 'signup') {
          return 'rgb(228, 216, 232)';
        } else {
          return 'rgb(228, 216, 232)';
        }
      }),
      bgImg: computed(() => {
        if (action.value === 'signup') {
          return bgImg2;
        } else {
          return bgImg1;
        }
      }),
      onPressSignUpToggle() {
        if (signinLoading.value || signupLoading.value) return;
        action.value = action.value === 'signup' ? 'signin' : 'signup';
      },
      onSignInSuccess() {
        const { query } = route;
        if (query.redirect) {
          router.replace({ name: query.redirect } as RouteLocationRaw);
        } else {
          router.replace({ name: 'home' });
        }
      },
      async onSignUpSuccess({ account, password }: { account: string; password: string }) {
        action.value = 'signin';
        await nextTick();
        signinRef.value?.postLogin({ account, password });
      },
    };
  },
});
</script>

<style scoped>
.content {
  max-width: 1000px;
  width: 100%;
  padding: 32px;
  border-radius: 16px;
  transition: all 0.2s;
}

.bg {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.bg-img-overlay {
  width: 70%;
  object-fit: cover;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.2s;
}
.form {
  width: 100%;
  border-radius: 16px;
  padding: 32px;
  background-color: #ffffff;
  transition: all 0.2s;
  box-sizing: border-box;
}

.sign-header {
  margin-bottom: 24px;
}
.sign-title {
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 8px;
}
.sign-subtitle {
  font-weight: 700;
  font-size: 20px;
}
.sign-signup {
  font-weight: 700;
  text-decoration: underline;
}
</style>
