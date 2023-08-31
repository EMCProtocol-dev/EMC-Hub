<template>
  <NLayout
    position="absolute"
    style="background-color: blueviolet"
    content-style="display:flex;align-items:center;justify-content:center;"
  >
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 8b84a8c (~)
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
<<<<<<< HEAD
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
=======
    <NSpace class="content" :wrap-item="false" :size="[0, 0]" :style="{ 'background-color': bgColor }">
      <div class="bg" style="width: 600px">
        <transition name="auth-fade">
          <template v-if="action === 'signup'">
            <img class="bg-img-overlay" src="@/assets/login-img1.jpg" key="signupimg" />
          </template>
          <template v-else>
            <img class="bg-img-overlay" src="@/assets/login-img.jpg" key="signinimg" />
          </template>
        </transition>
      </div>
      <div class="form" :bordered="false" size="huge" :style="{ height: formHeight }">
        <template v-if="action === 'signin'">
          <div class="sign-header">
            <NSpace :wrap-item="false" justify="space-between" align="center">
              <div class="sign-title">Edge Matrix Hub</div>
              <NA class="sign-signup" @click="onPressSignUpToggle">SignUp</NA>
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
              <NA class="sign-signup" @click="onPressSignUpToggle">SignIn</NA>
            </NSpace>
          </div>
          <SignUp @signup="onSignUpSuccess" @signupbefore="signupLoading = true" @signupafter="signupLoading = false" />
        </template>
      </div>
    </NSpace>
>>>>>>> 4a3626c (~)
=======
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
              <SignInAccount
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
>>>>>>> 8b84a8c (~)
  </NLayout>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';
<<<<<<< HEAD
<<<<<<< HEAD
import { NLayout, NLayoutContent, NCard, NH1, NH3, NA, NSpace, NGrid, NGridItem } from 'naive-ui';
import SignUp from './signup.vue';
<<<<<<< HEAD
import SignIn from './signin.vue';
=======
import SignInAccount from './signin-account.vue';
>>>>>>> 13fe58d (~)

const bgImg1 = require('@/assets/login-img.png');
const bgImg2 = require('@/assets/login-img1.png');
=======
import { NLayout, NLayoutContent, NCard, NH1, NH3, NA, NSpace, NTag, NSpin, NButton, NModal } from 'naive-ui';
=======
import { NLayout, NLayoutContent, NCard, NH1, NH3, NA, NSpace, NGrid, NGridItem } from 'naive-ui';
>>>>>>> 8b84a8c (~)
import SignIn from './signin.vue';
import SignUp from './signup.vue';

const bgImg1 = require('@/assets/login-img.jpg');
const bgImg2 = require('@/assets/login-img1.jpg');
>>>>>>> 4a3626c (~)

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
<<<<<<< HEAD
<<<<<<< HEAD
    NGrid,
    NGridItem,
<<<<<<< HEAD
    SignUp,
    SignIn,
=======
=======
    NGrid,
    NGridItem,
>>>>>>> 8b84a8c (~)
    SignIn,
    SignUp,
>>>>>>> 4a3626c (~)
=======
    SignUp,
    SignInAccount,
>>>>>>> 13fe58d (~)
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const action = ref('signin');
    const signinRef = ref<InstanceType<typeof SignInAccount>>();
    const signinLoading = ref(false);
    const signupLoading = ref(false);

    return {
      action,
      signinRef,
      signinLoading,
      signupLoading,
      formHeight: computed(() => {
        if (action.value === 'signup') {
<<<<<<< HEAD
          return '510px';
        } else {
          return '520px';
=======
          return '610px';
        } else {
          return '454px';
>>>>>>> 4a3626c (~)
        }
      }),
      bgColor: computed(() => {
        if (action.value === 'signup') {
<<<<<<< HEAD
          return 'rgb(228, 216, 232)';
=======
          return '#9d95d0';
>>>>>>> 4a3626c (~)
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
<<<<<<< HEAD
<<<<<<< HEAD
      async onSignUpSuccess({ account, password }: { account: string; password: string }) {
        action.value = 'signin';
        await nextTick();
        signinRef.value?.postLogin({ account, password });
=======
      async onSignUpSuccess({
        account,
        password,
        principal,
      }: {
        account: string;
        password: string;
        principal: string;
      }) {
=======
      async onSignUpSuccess({ account, password }: { account: string; password: string }) {
>>>>>>> 13fe58d (~)
        action.value = 'signin';
        await nextTick();
        signinRef.value?.postLogin({ account, password });
        console.info('sss');
>>>>>>> 4a3626c (~)
      },
    };
  },
});
</script>

<style scoped>
.content {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 8b84a8c (~)
  max-width: 1000px;
  width: 100%;
  padding: 32px;
  border-radius: 16px;
<<<<<<< HEAD
=======
  width: 1000px;
  padding: 40px 64px;
  border-radius: 40px;
>>>>>>> 4a3626c (~)
=======
>>>>>>> 8b84a8c (~)
  transition: all 0.2s;
}

.bg {
  position: relative;
<<<<<<< HEAD
<<<<<<< HEAD
  overflow: hidden;
  width: 100%;
  height: 100%;
=======

  overflow: hidden;
>>>>>>> 4a3626c (~)
=======
  overflow: hidden;
  width: 100%;
  height: 100%;
>>>>>>> 8b84a8c (~)
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
<<<<<<< HEAD
<<<<<<< HEAD
  width: 100%;
  border-radius: 16px;
  padding: 32px;
  background-color: #ffffff;
  transition: all 0.2s;
=======
  width: 400px;
  border-radius: 40px;
  padding: 40px;
  background-color: #ffffff;
  transition: all 0.2s;
  flex: 1;
>>>>>>> 4a3626c (~)
=======
  width: 100%;
  border-radius: 16px;
  padding: 32px;
  background-color: #ffffff;
  transition: all 0.2s;
>>>>>>> 8b84a8c (~)
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
