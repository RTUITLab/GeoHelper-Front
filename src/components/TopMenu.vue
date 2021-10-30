<template>
  <div class="top-menu">
    <div class="first-line">
      <logo class="logo" />
      <hamburger style="height: 18px" @click="() => collapsed = !collapsed" />
    </div>
    <div class="items" :collapsed="collapsed" @click="() => collapsed = true">
      <router-link
        v-for="item in items"
        :key="item.name"
        class="item"
        :to="item.path"
      >{{ item.title }}</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Logo from '@/assets/svg/Logo.vue';
import Hamburger from '@/assets/svg/Hamburger.vue';
import { MENU_GET } from '@/store/types';

@Options({
  components: { Hamburger, Logo },
})
export default class TopMenu extends Vue {
  private collapsed = true;

  get items() {
    return [].concat(...this.$store.getters[MENU_GET]);
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/styles/mixins';

.top-menu {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  width: 100%;
  padding: 0 24px;
  background-color: var(--white);
  box-shadow: 0 -8px 12px 0px var(--grafit);

  z-index: 2000;

  @include desktop {
    display: none;
  }

  .first-line {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 52px;

    .logo {
      height: 24px;
      width: auto;
      margin: 0 auto 0 0;
    }
  }

  .items {
    display: flex;
    flex-direction: column;
    transition: .4s ease-in-out;
    overflow: hidden;
    max-height: 0;

    &[collapsed=false] {
      max-height: 300px;
    }

    .item {
      text-decoration: none;
      padding: 12px 0;
      color: var(--grafit);
    }
  }
}
</style>
