<template lang="html">
  <div class="c-notification">
    <div :class="`title ${theme === 'warning' ? 'warning' : 'info'}`">
      <slot name="title"></slot>
    </div>

    <slot name="message"></slot>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    theme: String,
  },
})
export default class Notification extends Vue {}
</script>

<style lang="scss" scoped>
.c-notification {
  position: absolute;
  width: 300px;
  height: 86px;
  padding: 16px 24px;
  border-radius: 4px;
  background-color: var(--white);
  top: -100px;

  box-shadow: 2px 4px 8px 1px #6b6e8329;
  box-sizing: border-box;

  cursor: pointer;

  transition: .2s all;

  .title {
    font-weight: 600;
    margin-bottom: 4px;

    &.info {
      color: var(--deep-blue);
    }

    &.warning {
      color: var(--fire);
    }
  }
}
</style>
