<template>
  <div>
    <template v-if="ENTITY_TYPES.TEXT === type || type === ENTITY_TYPES.EXCURSION">
      <v-textarea
        v-model="description"
        label="Описание"
        auto-grow
        :rules="[v => !!v || 'Поле не заполнено']"
      ></v-textarea>
    </template>

    <template v-if="type === ENTITY_TYPES.AUDIO || type === ENTITY_TYPES.EXCURSION">
      <file-input audio :file-name="audio.fileName" @change="(e) => { audio = e }"></file-input>

      <audio :src="audio.localUrl || audio.url || ''" controls></audio>
    </template>
  </div>
</template>

<script>
import { ENTITY_TYPES } from '../../../assets/globals'
import FileInput from './FileInput'

export default {
  name: 'DataSection',
  components: { FileInput },
  props: ['type', 'itemData'],
  data: () => {
    return {
      description: '',
      audio: {},
      model: {},
      ENTITY_TYPES: ENTITY_TYPES
    }
  },
  created () {
    this.description = this.itemData.description
    this.audio = this.itemData.audio
  }
}
</script>

<style scoped>

</style>
