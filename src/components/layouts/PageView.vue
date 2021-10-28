<template>
  <div class="page">
    <router-link class="return" to="" v-if="back">
      <back /> Вернуться на {{  }}
    </router-link>
    <div v-else style="height: 24px"></div>

    <div class="header-line">
      <div class="header"><slot name="header"></slot></div>
      <slot name="action"></slot>
    </div>

    <slot name="content"></slot>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Back from '@/assets/svg/Back.vue';

@Options({
  components: { Back },
})
export default class PageView extends Vue {
  public back = false;
}
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .return {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 8px;
    color: var(--grafit);
    text-decoration: none;
    font-size: 14px;
  }

  .header-line {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    margin-bottom: 20px;

    .header {
      font-size: 20px;
    }
  }
}
</style>
