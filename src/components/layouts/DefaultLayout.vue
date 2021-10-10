<template>
  <div class="default-layout">
    <sidebar />
    <router-view />
  </div>
</template>

<script>
import { Options, Vue } from 'vue-class-component';
import Sidebar from '@/components/Sidebar.vue';

@Options({
  components: { Sidebar },
})
export default class DefaultLayout extends Vue { }
</script>

<style scoped>
.default-layout {
  position: absolute;
  display: flex;
  width: 100vw;
  height: 100vh;

  background: linear-gradient(to bottom, var(--cloudy_light), var(--cloudy_dark));
}
</style>
