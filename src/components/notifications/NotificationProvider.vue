<template lang="html">
  <div class="not-selectable c-notification-provider">
    <template v-for="(n, i) in $notifications.stack" :key="n.id">
      <notification :style="'top: ' + (i) * 92 + 'px'" :theme="n.type" @click="() => $notifications.remove(n.id)">
        <template v-slot:title>{{ n.title }}</template>
        <template v-slot:message>{{ n.message }}</template>
      </notification>
    </template>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Notification from '@/components/notifications/Notification.vue';

@Options({
  components: {
    Notification,
  },
})
export default class NotificationProvider extends Vue { }
</script>

<style scoped>
.c-notification-provider {
  position: absolute;
  display: flex;
  flex-direction: column-reverse;
  width: 300px;
  top: 16px;
  right: 16px;

  transition: .2s all;

  z-index: 9999;
}
</style>
