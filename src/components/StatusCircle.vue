<template lang="html">
  <div class="ring-container">
    <div class="circle with-tooltip" :style="!isReady ? 'background: var(--deep-blue);' : ''">
      <span class="tooltip">{{ isReady ? 'Готов' : 'Обрабатывается' }}</span>
    </div>
    <div class="ringring" :style="isReady ? 'display: none;' : ''"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    isReady: Boolean,
  },
})
export default class StatusCircle extends Vue {}
</script>

<style lang="scss" scoped>
//Pulsating ring
.ring-container {
  position: relative;
  width: 12px;
  height: 12px;
  padding-left: 24px;
}

.circle {
  width: 12px;
  height: 12px;
  background-color: var(--grass);
  border-radius: 50%;
  position: absolute;
  z-index: 501;
}

.ringring {
  border: 3px solid var(--deep-blue);
  border-radius: 30px;
  height: 12px;
  width: 12px;
  position: relative;
  animation: pulsate 1s ease-out;
  animation-iteration-count: infinite;
  opacity: 0.0;
  top: -3px;
  left: -3px;
  z-index: 500;
}
@keyframes pulsate {
  0% {transform: scale(0.1, 0.1); opacity: 0.0;}
  50% {opacity: 1.0;}
  100% {transform: scale(1.0, 1.0); opacity: 0.0;}
}
</style>
