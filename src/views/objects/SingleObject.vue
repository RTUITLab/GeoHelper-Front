<template>
  <v-card>
    <v-toolbar
      flat
    >
      <v-toolbar-title>Редактировать объект</v-toolbar-title>
    </v-toolbar>

    <v-divider></v-divider>

    <v-card-text>
      <v-form>
        <v-text-field
          v-model="item.name"
          label="Название"
          type="text"
          :rules="[v => !!v || 'Поле не заполнено']"
        ></v-text-field>
        <v-select
          :items="[
            {
              value: ENTITY_TYPES.TEXT,
              text: 'Текст'
            },
            {
              value: ENTITY_TYPES.AUDIO,
              text: 'Аудио'
            },
            {
              value: ENTITY_TYPES.OBJECT,
              text: 'Модель'
            },
            {
              value: ENTITY_TYPES.EXCURSION,
              text: 'Экскурсионный'
            }
          ]"
          v-model="item.type"
          label="Тип"
        ></v-select>

        <template v-if="item.type">
          <v-divider></v-divider>

          <p></p>

          <template v-if="ENTITY_TYPES.TEXT === item.type">
            <v-text-field
              v-model="item.description"
              label="Описание"
              :rules="[v => !!v || 'Поле не заполнено']"
            ></v-text-field>
          </template>
        </template>

        <template v-if="item.type === ENTITY_TYPES.AUDIO || item.type === ENTITY_TYPES.EXCURSION">
          <v-file-input
            label="Аудиофайл"
            accept="audio/*"
            v-model="audioFile"
            @change="loadAudio"
            :rules="[v => !!v || 'Поле не заполнено', v => !!v && v.size < 52428000 || 'Файл более 50 Мб']"
          ></v-file-input>

          <audio :src="item.audioFile ? item.audioFile.url : ''" controls></audio>
        </template>

        <v-divider></v-divider>

        <div class="map-input">
          <map-input v-model="item.map"></map-input>
        </div>
      </v-form>
    </v-card-text>

    <v-card-actions style="padding: 16px">
      <v-btn
        outlined
        color="error"
      >Отменить</v-btn>

      <v-spacer></v-spacer>

      <v-btn
        :loading="!!loadingQueue"
        color="primary"
      >Сохранить</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { FETCH_OBJECTS, GET_OBJECT_ONE, ENTITY_TYPES, UPLOAD_FILE } from '../../assets/globals'
import MapInput from '../../components/maps/MapInput'

export default {
  name: 'SingleObject',
  components: { MapInput },
  data: () => {
    return {
      item: {},
      ENTITY_TYPES: ENTITY_TYPES,
      audioFile: {},
      modelFile: {},
      loadingQueue: 0
    }
  },
  async created () {
    if (this.$route.params.id) {
      await this.$store.dispatch(FETCH_OBJECTS)
      this.item = this.$store.getters[GET_OBJECT_ONE](this.$route.params.id)
      this.item.map = {
        position: this.item.position,
        areas: this.item.areas,
        route: this.item.route
      }

      if (this.item.audioFile) {
        this.audioFile = new File([], this.item.audioFile.fileName, { type: 'audio/*' })
        console.log(this.audioFile)
      }
    } else {
      this.item.map = {}
    }
  },
  methods: {
    async loadAudio (e) {
      this.loadingQueue++

      this.item.audioFile = {
        type: 'audio',
        url: URL.createObjectURL(e),
        fileName: e.fileName
      }

      await this.$store.dispatch(UPLOAD_FILE, e)

      this.loadingQueue--
    }
  }
}
</script>

<style lang="sass" scoped>
.map-input
  padding-top: 14px
</style>
