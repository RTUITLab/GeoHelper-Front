<template>
  <div id="main" :theme="theme">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { THEME_GET, THEME_SET } from '@/store/types';

export default class App extends Vue {
  private theme = localStorage.getItem('THEME') || 'light';

  created(): void {
    if (!this.theme) {
      this.$store.commit(THEME_SET, this.theme);
    }

    this.$store.subscribe((mutation: any) => {
      if (mutation.type === THEME_SET) {
        this.theme = this.$store.getters[THEME_GET];
      }
    });
  }
}
</script>

<style lang="scss">
@import 'src/assets/styles/general';

#main {
  position: absolute;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
}
</style>
