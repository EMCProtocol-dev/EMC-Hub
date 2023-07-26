<template>
  <NLayout position="absolute" style="background-color: blueviolet" content-style="display:flex;align-items:center;justify-content:center;">
    <NSpace class="content" :wrap-item="false" :size="[0, 0]" :style="{ 'background-color': bgColor }">
      <div class="bg" style="width: 600px">
        <transition name="auth-fade">
          <template v-if="action === 'signup'">
            <img class="bg-img-overlay" src="@/assets/login-img1.png" key="signupimg" />
          </template>
          <template v-else>
            <img class="bg-img-overlay" src="@/assets/login-img.png" key="signinimg" />
          </template>
        </transition>
      </div>
      <div class="form" :bordered="false" size="huge" :style="{ height: formHeight }">
        <template v-if="action === 'signin'">
          <div class="sign-header">
            <NSpace :wrap-item="false" justify="space-between" align="center">
              <div class="sign-title">Edge Matrix Hub</div>
              <NA class="sign-signup" @click="onPressSignUpToggle">Sign Up</NA>
            </NSpace>
            <div class="sign-subtitle">Welcome #AI</div>
          </div>
          <SignIn ref="signinRef" @signin="onSignInSuccess" @signinbefore="signinLoading = true" @signinafter="signinLoading = false" />
        </template>
        <template v-else-if="action === 'signup'">
          <div class="sign-header">
            <NSpace :wrap-item="false" justify="space-between" align="center">
              <div class="sign-title">Edge Matrix Hub</div>
              <NA class="sign-signup" @click="onPressSignUpToggle">Log in</NA>
            </NSpace>
          </div>
          <SignUp @signup="onSignUpSuccess" @signupbefore="signupLoading = true" @signupafter="signupLoading = false" />
        </template>
      </div>
    </NSpace>
  </NLayout>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';
import { NLayout, NLayoutContent, NCard, NH1, NH3, NA, NSpace, NTag, NSpin, NButton, NModal } from 'naive-ui';
import SignIn from './signin.vue';
import SignUp from './signup.vue';

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
    SignIn,
    SignUp,
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
          return '610px';
        } else {
          return '454px';
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
      async onSignUpSuccess({ account, password, principal }: { account: string; password: string; principal: string }) {
        action.value = 'signin';
        await nextTick();
        signinRef.value?.postLogin({ account, password, principal });
        console.info('sss');
      },
    };
  },
});
</script>

<style scoped>
.content {
  width: 1000px;
  padding: 40px 64px;
  border-radius: 40px;
  transition: all 0.2s;
}

.bg {
  position: relative;

  overflow: hidden;
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
  width: 400px;
  border-radius: 40px;
  padding: 40px;
  background-color: #ffffff;
  transition: all 0.2s;
  flex: 1;
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
