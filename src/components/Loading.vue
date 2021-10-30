<template lang="html">
  <div class="loading-container">
    <div class="loading-spinner">
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class Loading extends Vue { }
</script>

<style lang="scss">
.loading-container {
  text-align: center;
  padding: 64px 0;
}

.loading-spinner {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;

  div {
    position: absolute;
    border: 4px solid #438EFF;
    opacity: 1;
    border-radius: 50%;
    animation: loading-spinner 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;

    &:nth-child(2) {
      animation-delay: -0.5s;
    }
  }
}

@keyframes loading-spinner {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
</style>
