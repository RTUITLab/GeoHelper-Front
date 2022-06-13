<template>
  <section>
    <v-row>
      <v-subheader>Данные</v-subheader>
    </v-row>

    <p></p>

    <template v-if="ENTITY_TYPES.TEXT === type || type === ENTITY_TYPES.EXCURSION">
      <v-textarea
        v-model="description"
        label="Описание"
        auto-grow
        :rules="[v => !!v || 'Поле не заполнено']"
        @change="emitChange"
      ></v-textarea>
    </template>

    <template v-if="type === ENTITY_TYPES.AUDIO || type === ENTITY_TYPES.EXCURSION">
      <file-input audio :file-name="audio.fileName" @change="(e) => { audio = e; emitChange() }"></file-input>

      <audio :src="audio.localUrl || audio.url || ''" controls></audio>
    </template>

    <template v-if="type === ENTITY_TYPES.OBJECT || type === ENTITY_TYPES.EXCURSION">
      <file-input model :file-name="model.fileName" @change="(e) => { model = e; emitChange() }"></file-input>

      <v-row style="margin-bottom: 16px">
        <v-col>
          <v-btn
            style="margin-right: 16px"
            color="primary"
            text
            @click="() => openLink('DOWNLOAD')"
          >Скачать</v-btn>

          <v-btn
            outlined
            color="primary"
            @click="() => openLink('OPEN')"
          >Открыть</v-btn>
        </v-col>
      </v-row>
    </template>
  </section>
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
    if (this.itemData) {
      this.description = this.itemData.description
      this.audio = this.itemData.audio
      this.model = this.itemData.model
    }
  },
  methods: {
    emitChange () {
      this.$emit('change', {
        description: this.description,
        audio: this.audio,
        model: this.model
      })
    },
    openLink (mode) {
      let src = ''
      if (mode === 'DOWNLOAD') {
        src = this.model.url
      }
      if (mode === 'OPEN') {
        src = location.origin + '/ModelViewer/index.html?=' + this.model.url.split('/').pop()
      }

      if (src) {
        window.open(src, '_blank')
      }
    }
  }
}
</script>

<style scoped>

</style>
