<template>
  <v-file-input
    :label="getSettings().label"
    :accept="getSettings().accept"
    v-model="file"
    :loading="!!isLoading"
    :disabled="!!isLoading"
    @change="uploadFile"
    :rules="[v => !!v || 'Поле не заполнено', v => !!v && v.size < 52428000 || 'Файл более 50 Мб']"
  ></v-file-input>
</template>

<script>
import { UPLOAD_FILE } from '../../../assets/globals'

export default {
  name: 'FileInput',
  props: {
    audio: Boolean,
    model: Boolean,
    fileName: String
  },
  data: () => {
    return {
      value: {},
      file: {},
      isLoading: false
    }
  },
  created () {
    if (this.fileName) {
      this.file = new File([], this.fileName, { type: this.getSettings().accept })
    }
  },
  methods: {
    async uploadFile (e) {
      if (!e) {
        return
      }

      this.isLoading = true

      this.value = {
        type: this.getSettings().type,
        localUrl: URL.createObjectURL(e),
        fileName: e.name
      }
      this.$emit('change', this.value)

      const name = await this.$store.dispatch(UPLOAD_FILE, e)

      this.value.url = process.env.VUE_APP_API.split('/api')[0] + '/uploads/' + name
      this.$emit('change', this.value)

      this.isLoading = false
    },
    getSettings () {
      if (this.audio) {
        return {
          label: 'Аудиофайл',
          accept: 'audio/*',
          type: 'audio'
        }
      } else if (this.model) {
        return {
          label: 'Модель',
          accept: 'application/zip',
          type: 'model'
        }
      } else {
        return {
          label: '',
          accept: '*/*',
          type: 'none'
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
