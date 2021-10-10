<template>
  <div class="checkbox">
    <label :class="value ? 'checked' : ''">
      <input
        type="checkbox"
        v-model="value"
        @input="(e) => $emit('update', e.target.checked)"
      />
      <slot></slot>
    </label>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    modelValue: Boolean,
  },
})
export default class Checkbox extends Vue {
  private value = false;

  created(): void {
    // @ts-ignore
    this.value = this.modelValue;
  }

  get getValue() {
    return this.value;
  }
}
</script>

<style lang="scss" scoped>
.checkbox {
  margin: 12px 0 0;

  input {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }

  label {
    font-size: 14px;
    user-select: none;

    &::before {
      content: '';
      display: inline-flex;
      width: 10px;
      height: 10px;
      background: #FFFFFF;
      border: 1px solid #D2D2D2;
      border-radius: 4px;
      margin: 0 8px 0 0;
      vertical-align: baseline;
      transition: 0.3s;
      will-change: border, box-shadow;
    }

    &.checked::before {
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23438EFF' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
    }
  }
}
</style>
