<template>
  <text-input v-model="value" title="Поиск" type="text"></text-input>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { watch } from 'vue';
import TextInput from '@/components/inputs/TextInput.vue';

@Options({
  props: {
    modelValue: String,
  },
  components: {
    TextInput,
  },
})
export default class Search extends Vue {
  private value = '';

  created(): void {
    // @ts-ignore
    this.value = this.modelValue;
    watch(() => this.value, (val) => {
      this.$emit('update:modelValue', val);
    });
  }
}
</script>

<style lang="scss" scoped>
.search {
  margin: 0;
  max-width: 300px;
  background: transparent;
}
</style>
