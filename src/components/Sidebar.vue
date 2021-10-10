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
        @click="$store.commit('LOGOUT', () => $router.push('/login'))"
      >Выйти</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { watch } from 'vue';
import Logo from '@/assets/svg/Logo.vue';

@Options({
  components: { Logo },
})
export default class Sidebar extends Vue {
  private menu = [
    [
      { title: 'Новый объект', path: '/objects/new', name: 'NewObject' },
      { title: 'Объекты', path: '/objects', name: 'Objects' },
      // { title: '', path: '' },
      { title: 'Карта', path: '/map', name: 'Map' },
    ],
    [
      { title: 'Настройки', path: '/settings', name: 'Settings' },
    ],
  ];

  get route(): string {
    return this.$route.name as string;
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  position: fixed;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 240px;
  padding: 24px 0 24px 24px;
  background-color: var(--white);
  box-sizing: border-box;

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
