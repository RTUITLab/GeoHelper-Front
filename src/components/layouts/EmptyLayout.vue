<template>
  <div class="empty-layout">
    <router-view />
  </div>
</template>

<script>
import { Vue } from 'vue-class-component';

export default class EmptyLayout extends Vue { }
</script>

<style scoped>
.empty-layout {
  position: absolute;
  display: flex;
  height: 100vh;
  width: 100vw;

  background: linear-gradient(to bottom, var(--cloudy_light), var(--cloudy_dark));
}
</style>
