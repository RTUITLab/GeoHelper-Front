<template>
  <div class="sidebar">
    <logo />
    <div v-for="(section, index) in menu" :key="index" class="menu-section">
      <router-link
        v-for="item in section"
        :key="item.name"
        :class="'menu-item' + (item.name === route ? ' active' : '')"
        :to="item.path"
      >{{ item.title }}</router-link>
    </div>

    <div class="menu-section" style="margin: auto 0 0">
      <div
        class="menu-item"
        style="margin-top: auto"
        @click="$store.commit('LOGOUT', () => $router.push({ path: '/login', params: { name: 'asdasd' }}))"
      >Выйти</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Logo from '@/assets/svg/Logo.vue';
import { MENU_GET } from '@/store/types';

@Options({
  components: { Logo },
})
export default class Sidebar extends Vue {
  private menu = [];

  created(): void {
    this.menu = this.$store.getters[MENU_GET];
  }

  get route(): string {
    return this.$route.name as string;
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/styles/mixins';

.sidebar {
  position: fixed;
  display: none;
  flex-direction: column;
  height: 100vh;
  width: 220px;
  padding: 24px 0 24px 24px;
  background-color: var(--white);
  box-sizing: border-box;

  @include desktop {
    display: flex;
  }

  * {
    color: var(--grafit);
  }

  .menu-section {
    display: flex;
    flex-direction: column;
    margin: 20px 0 auto;

    .menu-item {
      display: flex;
      justify-content: space-between;
      align-items: center;

      height: 36px;
      box-sizing: border-box;
      cursor: pointer;
      text-decoration: none;
      user-select: none;

      transition: .3s;

      &:hover {
        color: var(--black);

        &::after {
          content: '';
          height: 100%;
        }
      }

      &.active {
        color: var(--deep-blue);
        font-weight: 500;

        &::after {
          content: '';
          height: 100%;
          border-right: 3px solid var(--deep-blue);
        }
      }
    }
  }
}
</style>
