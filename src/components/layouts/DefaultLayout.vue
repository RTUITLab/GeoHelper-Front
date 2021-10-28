<template>
  <div class="default-layout">
    <sidebar />
    <top-menu />
    <div class="content">
      <router-view style="padding: 24px" />
    </div>
  </div>
</template>

<script>
import { Options, Vue } from 'vue-class-component';
import Sidebar from '@/components/Sidebar.vue';
import TopMenu from '@/components/TopMenu.vue';

@Options({
  components: { TopMenu, Sidebar },
})
export default class DefaultLayout extends Vue { }
</script>

<style lang="scss" scoped>
@import 'src/assets/styles/mixins';

.default-layout {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;

  background: linear-gradient(to bottom, var(--cloudy_light), var(--cloudy_dark));

  .content {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    width: 100%;
    height: 100%;

    @include desktop {
      padding-left: 220px;
      padding-top: 0;
    }
  }
}
</style>
