<template>
  <input
    :type="type || 'text'"
    :placeholder="title"
    v-model="value"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { watch } from 'vue';

@Options({
  props: {
    type: String,
    title: String,
    modelValue: String,
  },
})
export default class TextInput extends Vue {
  private value = '';

  created(): void {
    // @ts-ignore
    this.value = this.modelValue;
    watch(() => this.value, (val) => {
      this.$emit('update:modelValue', val);
    });
  }
}

enum InputTypes {
  Text = 'text',
  Password = 'password',
}
</script>

<style lang="scss" scoped>
input {
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

  &:focus-visible {
    border: 1px solid var(--deep-blue);
    box-shadow: 0 0 4px 0 var(--deep-blue);
  }
}
</style>
