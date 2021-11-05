<template lang="html">
  <label class="c-file-input"> {{ file.fileName || 'Выберите файл' }}
    <input type="file" :accept="accept" @input="loadFile" onclick="this.value = null">
  </label>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    fileName: String,
    accept: String,
  },
})
export default class FileInput extends Vue {
  public file = {
    fileName: '',
    file: new File([], ''),
  };

  created(): void {
    // @ts-ignore
    this.file.fileName = this.fileName;
  }

  public loadFile(e: InputEvent): void {
    const target = (e.target as HTMLInputElement);

    if (target.files && target.files.length) {
      this.file = {
        fileName: target.files[0].name,
        file: target.files[0],
      };

      this.$emit('input', this.file);
    }
  }
}
</script>

<style lang="scss" scoped>
input {
  display: none;
}

.c-file-input {
  height: 37.2px;
  width: 100%;
  margin-top: 20px;
  padding: 8px 12px;
  border: 1px solid #D2D2D2;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px !important;
  color: var(--black) !important;
  outline: none;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  background-color: #FFFFFF;

  transition: 0.2s border, 0.2s box-shadow;
  will-change: border, box-shadow;

  &:focus {
    border: 1px solid var(--deep-blue);
    box-shadow: 0 0 4px 0 var(--deep-blue);
  }
}
</style>
