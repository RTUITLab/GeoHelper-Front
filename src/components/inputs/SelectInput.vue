<template lang="html">
  <select class="c-select">
    <option v-for="option in options" :key="option.value">{{ option.title }}</option>
  </select>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    options: Array,
  },
})
export default class SelectInput extends Vue { }
</script>

<style lang="scss" scoped>
.c-select {
  width: 100%;
  margin-top: 20px;
  padding: 8px 12px;
  border: 1px solid #D2D2D2;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
  color: var(--black);
  outline: none;
  transition: 0.2s;
  will-change: border, box-shadow;

  background-color: var(--white);

  &:focus-visible {
    border: 1px solid var(--deep-blue);
    box-shadow: 0 0 4px 0 var(--deep-blue);
  }
}
</style>
