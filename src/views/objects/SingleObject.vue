<template>
  <v-card>
    <v-toolbar
      flat
    >
      <v-toolbar-title>Редактировать объект</v-toolbar-title>
      <v-spacer></v-spacer>
      <token-btn :id="item._id"></token-btn>
    </v-toolbar>

    <v-divider></v-divider>

    <v-card-text>
      <v-form ref="form">
        <v-text-field
          v-model="form.name"
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
          v-model="form.type"
          label="Тип"
        ></v-select>

        <template v-if="form.type">
          <v-divider></v-divider>

          <data-section :type="form.type" :item-data="form.data" @change="(e) => { form.data = e }"></data-section>
        </template>

        <v-divider></v-divider>
        <v-row>
          <v-subheader>Видимость</v-subheader>
        </v-row>

        <div class="map-input">
          <map-input v-model="mapData" ref="map"></map-input>
        </div>

        <template v-if="form.type && form.type === ENTITY_TYPES.OBJECT">
          <v-divider style="margin-top: 16px"></v-divider>

          <behavior-section :behaviors="form.behaviors" ref="behaviorSection"></behavior-section>
        </template>
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
  BEHAVIORS_TYPES,
  BEHAVIORS_CONDITIONS_TYPES,
  UPLOAD_FILE,
  UPDATE_OBJECT,
  CREATE_SNACHBAR
} from '../../assets/globals'
import MapInput from '../../components/maps/MapInput'
import TokenBtn from '../../components/objects/TokenBtn'
import DataSection from '../../components/objects/form/DataSection'
import BehaviorSection from '../../components/objects/form/BehaviorSection'

export default {
  name: 'SingleObject',
  components: { BehaviorSection, DataSection, TokenBtn, MapInput },
  data: () => {
    return {
      item: {},
      form: {},
      ENTITY_TYPES: ENTITY_TYPES,
      BEHAVIORS_TYPES: BEHAVIORS_TYPES,
      BEHAVIORS_CONDITIONS_TYPES: BEHAVIORS_CONDITIONS_TYPES,
      loadingQueue: 0,
      mapData: ''
    }
  },
  async created () {
    if (this.$route.params.id) {
      await this.$store.dispatch(FETCH_OBJECTS)
      this.item = this.$store.getters[GET_OBJECT_ONE](this.$route.params.id)

      // Fill form
      this.form = {
        name: this.item.name,
        type: this.item.type,
        data: {
          description: this.item.description ?? '',
          audio: this.item.audioFile ?? {},
          model: this.item.modelFile ?? {}
        },
        behaviors: this.item.behaviors
      }

      this.mapData = {
        markers: [{ position: this.item.position }],
        areas: this.item.areas || [],
        route: this.item.route || []
      }

      if (this.item.behaviors && this.item.behaviors.length) {
        this.item.behaviors = this.item.behaviors.map((B) => {
          B.map = {
            routes: [{ points: B.action.points.map((point) => ({ lat: point.lat, lng: point.lng })) }]
          }
          B.action.points = B.action.points.map((point) => {
            if (point.audio) {
              point.audioFile = new File([], point.audio.fileName, { type: 'audio/*' })
            }

            return point
          })

          B.action.points.push(...(new Array(100)).fill({}))

          return B
        })
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
    async uploadFile (e, type = '-1', item) {
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

      if (item) {
        item.audio.fileName = e.name
        item.audio.localUrl = URL.createObjectURL(e)
      }

      const name = await this.$store.dispatch(UPLOAD_FILE, e)

      const url = process.env.VUE_APP_API.split('/api')[0] + '/uploads/' + name
      if (type === ENTITY_TYPES.AUDIO) {
        this.item.audioFile.url = url
      }
      if (type === ENTITY_TYPES.OBJECT) {
        this.item.modelFile.url = url
      }

      if (item) {
        item.audio.url = url
      }

      this.loadingQueue--
    },

    saveData () {
      if (!this.$refs.map.validate() || !this.$refs.form.validate()) {
        return
      }

      const data = {
        name: this.form.name,
        type: this.form.type,
        areas: this.mapData.areas,
        position: this.mapData.position
      }

      // Type based data
      data.files = []
      if (this.form.type === ENTITY_TYPES.AUDIO || this.form.type === ENTITY_TYPES.EXCURSION) {
        data.files.push(this.form.data.audio)
      }
      if (this.form.type === ENTITY_TYPES.OBJECT || this.form.type === ENTITY_TYPES.EXCURSION) {
        data.files.push(this.form.data.model)
      }

      if (this.form.type === ENTITY_TYPES.TEXT || this.form.type === ENTITY_TYPES.EXCURSION) {
        data.description = this.form.data.description
      }
      if (this.form.type === ENTITY_TYPES.AUDIO || this.form.type === ENTITY_TYPES.OBJECT) {
        data.fileName = data.files[0].fileName
        data.url = data.files[0].url
      }

      if (this.item._id) {
        data._id = this.item._id
      }

      // Behaviors
      if (this.form.type === ENTITY_TYPES.OBJECT) {
        data.behaviors = this.$refs.behaviorSection.validate()

        if (data.behaviors === false) {
          return
        }
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
