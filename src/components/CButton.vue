<template>
  <button
    :type="type || 'button'"
    :class="'not-selectable button__' + (variant || 'primary') + (outlined ? ' outlined' : '')"
  ><slot></slot></button>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

enum ButtonVariants {
  primary = 'primary',
  danger = 'danger',
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
  cursor: pointer;

  transition: .2s;

  &.button__primary {
    background-color: var(--deep-blue);
    color: var(--white);

    &:hover, &:focus-visible {
      box-shadow: 0 0 6px 0 var(--deep-blue);
    }

    &:active {
      box-shadow: 0 0 10px 0 var(--deep-blue);
    }

    &.outlined {
      background: none;
      color: var(--deep-blue);
      border: 1px solid var(--deep-blue);
    }
  }

  &.button__danger {
    background-color: var(--fire);
    color: var(--fire);

    &:hover, &:focus-visible {
      box-shadow: 0 0 6px 0 var(--fire);
    }
    &:active {
      box-shadow: 0 0 10px 0 var(--fire);
    }

    &.outlined {
      background: none;
      color: var(--fire);
      border: 1px solid var(--fire);
    }
  }
}
</style>
