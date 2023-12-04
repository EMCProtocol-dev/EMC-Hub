<template>
  <div class="header-user">
    <template v-if="user.id">
      <NSpace class="user" align="center" :wrap-item="false" :wrap="false">
        <template v-if="!user.avatar">
          <NIconWrapper :size="48" :border-radius="16" color="#f1f1f1" icon-color="#666666">
            <NIcon size="24" @click="onPressUser" style="cursor: pointer">
              <IconPerson />
            </NIcon>
          </NIconWrapper>
        </template>
        <template v-else>
          <img class="avatar" :src="user.avatar" @click="onPressUser" />
        </template>
        <div class="user-body">
          <div class="user-body-row">
            <NText class="nickname" strong>Hi, {{ user.nickname }}</NText>
            <NDivider vertical />
            <!-- secondary  -->
            <NButton type="default" circle strong quaternary @click="onPressSignOut">
              <template #icon>
                <NIcon style="margin-right: -2px"><IconExit /></NIcon>
              </template>
            </NButton>
          </div>
        </div>
      </NSpace>
    </template>
    <template v-else>
      <NButton class="btn-sign" type="default" size="large" strong @click="onPressSignIn">Sign In</NButton>
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { NButton, NSpace, NIconWrapper, NText, NDivider, NIcon } from 'naive-ui';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { PersonSharp as IconPerson, ExitOutline as IconExit } from '@vicons/ionicons5';
import { Http } from '@/tools/http';

export default defineComponent({
  components: { NButton, NSpace, NIconWrapper, NText, NDivider, NIcon, IconPerson, IconExit },
  setup(props, context) {
    const router = useRouter();
    const userStore = useUserStore();
    const http = Http.getInstance();

    onMounted(async () => {
      const resp = await http.get({
        url: 'emchub/api/client/user/selectByUser',
      });
      if (resp._result === -1) {
        userStore.signOut();
      }
    });
    return {
      user: computed(() => userStore.user),
      onPressSignIn() {
        router.push({ name: 'auth' });
      },
      onPressUser() {
        router.push({ name: 'user', params: { sign: 'profile' } });
      },
      onPressSignOut() {
        userStore.signOut();
        router.push({ name: 'home' });
      },
    };
  },
});
</script>
<style scoped>
.header-user {
  max-width: 240px;
}
.nickname {
  max-width: 8em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 16px;
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
</style>
