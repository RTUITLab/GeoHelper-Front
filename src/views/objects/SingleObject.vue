<template>
  <v-card>
    <v-toolbar
      flat
    >
      <v-toolbar-title>Редактировать объект</v-toolbar-title>
    </v-toolbar>

    <v-divider></v-divider>

    <v-card-text>
      <v-form ref="form">
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

          <template v-if="ENTITY_TYPES.TEXT === item.type || item.type === ENTITY_TYPES.EXCURSION">
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
            :loading="!!loadingQueue"
            :disabled="!!loadingQueue"
            @change="(e) => uploadFile(e, ENTITY_TYPES.AUDIO)"
            :rules="[v => !!v || 'Поле не заполнено', v => !!v && v.size < 52428000 || 'Файл более 50 Мб']"
          ></v-file-input>

          <audio :src="item.audioFile ? (item.audioFile.localUrl ? item.audioFile.localUrl : item.audioFile.url) : ''" controls></audio>
        </template>

        <template v-if="item.type === ENTITY_TYPES.OBJECT || item.type === ENTITY_TYPES.EXCURSION">
          <v-file-input
            label="Модель"
            accept="application/zip"
            v-model="modelFile"
            :loading="!!loadingQueue"
            :disabled="!!loadingQueue"
            @change="(e) => uploadFile(e, ENTITY_TYPES.OBJECT)"
            :rules="[v => !!v || 'Поле не заполнено', v => !!v && v.size < 52428000 || 'Файл более 50 Мб']"
          ></v-file-input>

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

        <v-divider></v-divider>

        <div class="map-input">
          <map-input v-model="mapData" ref="map"></map-input>
        </div>
      </v-form>
    </v-card-text>

    <v-card-actions style="padding: 16px">
      <v-btn
        outlined
        color="error"
        @click="() => $router.push('/objects')"
      >Отменить</v-btn>

      <v-spacer></v-spacer>

      <v-btn
        :loading="!!loadingQueue"
        color="primary"
        @click="saveData"
      >Сохранить</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {
  FETCH_OBJECTS,
  GET_OBJECT_ONE,
  ENTITY_TYPES,
  UPLOAD_FILE,
  UPDATE_OBJECT,
  CREATE_SNACHBAR
} from '../../assets/globals'
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
      loadingQueue: 0,
      mapData: ''
    }
  },
  async created () {
    if (this.$route.params.id) {
      await this.$store.dispatch(FETCH_OBJECTS)
      this.item = this.$store.getters[GET_OBJECT_ONE](this.$route.params.id)
      this.mapData = {
        markers: [{ position: this.item.position }],
        areas: this.item.areas || [],
        route: this.item.route || []
      }

      if (this.item.audioFile) {
        this.audioFile = new File([], this.item.audioFile.fileName, { type: 'audio/*' })
      }
      if (this.item.modelFile) {
        this.modelFile = new File([], this.item.modelFile.fileName, { type: 'application/zip' })
      }
    } else {
      this.mapData = {
        markers: [],
        areas: [],
        route: []
      }
    }
  },
  methods: {
    async uploadFile (e, type) {
      if (!e) {
        return
      }

      this.loadingQueue++

      if (type === ENTITY_TYPES.AUDIO) {
        this.item.audioFile = {
          type: 'audio',
          localUrl: URL.createObjectURL(e),
          fileName: e.name
        }
      } else if (type === ENTITY_TYPES.OBJECT) {
        this.item.modelFile = {
          type: 'model',
          url: URL.createObjectURL(e),
          fileName: e.name
        }
      }

      const name = await this.$store.dispatch(UPLOAD_FILE, e)

      const url = process.env.VUE_APP_API.split('/api')[0] + '/uploads/' + name
      if (type === ENTITY_TYPES.AUDIO) {
        this.item.audioFile.url = url
      }
      if (type === ENTITY_TYPES.OBJECT) {
        this.item.modelFile.url = url
      }

      this.loadingQueue--
    },

    openLink (mode) {
      let src = ''
      if (mode === 'DOWNLOAD') {
        src = this.item.modelFile.url
      }
      if (mode === 'OPEN') {
        src = location.origin + '/ModelViewer?=' + this.item.modelFile.url.split('/').pop()
      }

      if (src) {
        window.open(src, '_blank')
      }
    },

    saveData () {
      if (!this.$refs.map.validate()) {
        return
      }

      const data = {
        name: this.item.name,
        type: this.item.type,
        areas: this.mapData.areas,
        position: this.mapData.position
      }

      data.files = []
      if (this.item.type === ENTITY_TYPES.AUDIO || this.item.type === ENTITY_TYPES.EXCURSION) {
        data.files.push(this.item.audioFile)
      }
      if (this.item.type === ENTITY_TYPES.OBJECT || this.item.type === ENTITY_TYPES.EXCURSION) {
        data.files.push(this.item.modelFile)
      }

      // Type based data
      if (this.item.type === ENTITY_TYPES.TEXT || this.item.type === ENTITY_TYPES.EXCURSION) {
        data.description = this.item.description
      }
      if (this.item.type === ENTITY_TYPES.AUDIO || this.item.type === ENTITY_TYPES.OBJECT) {
        data.fileName = data.files[0].fileName
        data.url = data.files[0].url
      }

      if (this.item._id) {
        data._id = this.item._id
      }

      this.$store.dispatch(UPDATE_OBJECT, data)
        .then(() => this.$router.push('/'))
        .catch((e) => this.$root.$emit(CREATE_SNACHBAR, { text: e.error }))
    }
  }
}
</script>

<style lang="sass" scoped>
.map-input
  padding-top: 14px
</style>
