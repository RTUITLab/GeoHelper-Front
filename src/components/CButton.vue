<template>
  <button
    :type="type || 'button'"
    :class="'button__' + (variant || 'primary')"
  ><slot></slot></button>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

enum ButtonVariants {
  primary = 'primary',
}

@Options({
  props: {
    type: String,
    filled: Boolean,
    outlined: Boolean,
    variant: ButtonVariants,
  },
})
export default class CButton extends Vue { }
</script>

<style lang="scss" scoped>
button {
  width: 100%;
  padding: 8px 12px;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  outline: none;

  transition: .2s;

  &.button__primary {
    background-color: var(--deep-blue);
    color: var(--white);

    &:hover, &:focus-visible {
      box-shadow: 0 0 6px 0 var(--deep-blue);
    }
    &:active {
      box-shadow: 0 0 10px 0 var(--deep-blue)
    }
  }
}
</style>
