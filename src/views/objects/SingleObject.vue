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
          <v-row>
            <v-subheader>Данные</v-subheader>
          </v-row>

          <p></p>

          <template v-if="ENTITY_TYPES.TEXT === item.type || item.type === ENTITY_TYPES.EXCURSION">
            <v-textarea
              v-model="item.description"
              label="Описание"
              auto-grow
              :rules="[v => !!v || 'Поле не заполнено']"
            ></v-textarea>
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
        <v-row>
          <v-subheader>Видимость</v-subheader>
        </v-row>

        <div class="map-input">
          <map-input v-model="mapData" ref="map"></map-input>
        </div>

        <template v-if="item.type && item.type === ENTITY_TYPES.OBJECT">
          <v-divider style="margin-top: 16px"></v-divider>
          <v-row>
            <v-col class="a">
              <v-subheader style="padding-left: 4px">Поведение</v-subheader>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="col-auto">
              <v-btn
                icon
                small
                class="ml-auto"
                title="Добавить поведение"
                @click="addBehavior"
              ><v-icon>mdi-plus</v-icon></v-btn>
            </v-col>
          </v-row>

          <p v-if="!item.behaviors || !item.behaviors.length" style="text-align: center">Поведение отсутствует</p>
          <v-expansion-panels v-else>
            <v-expansion-panel
              v-for="(item,i) in item.behaviors"
              :key="i"
            >
              <v-expansion-panel-header>Поведение {{i + 1}}</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-select
                  label="Тип"
                  v-model="item.action.type"
                  :rules="[v => !!v || 'Поле не заполнено']"
                  :items="[
                    {
                      value: BEHAVIORS_TYPES.ROUTE,
                      text: 'Маршрут'
                    },
                    {
                      value: BEHAVIORS_TYPES.EXCURSION,
                      text: 'Экскурсия'
                    }
                  ]"
                ></v-select>
                <v-select
                  multiple
                  label="Условия"
                  :rules="[v => !!v || 'Поле не заполнено', v => !!v.length || 'Поле не заполнено']"
                  v-model="item.conditions"
                  :items="[
                    {
                      value: BEHAVIORS_CONDITIONS_TYPES.CLICK,
                      text: 'Нажатие'
                    },
                    {
                      value: BEHAVIORS_CONDITIONS_TYPES.VOLUME,
                      text: 'Звук'
                    }
                  ]"
                ></v-select>

                <template v-if="item.action.type === BEHAVIORS_TYPES.ROUTE">
                  <v-file-input
                    label="Аудиофайл"
                    accept="audio/*"
                    v-model="item.action.points[0].audioFile"
                    :loading="!!loadingQueue"
                    :disabled="!!loadingQueue"
                    @change="(e) => uploadFile(e, ENTITY_TYPES.AUDIO, item.action.points[0])"
                    :rules="[v => !!v || 'Поле не заполнено', v => !!v && v.size < 52428000 || 'Файл более 50 Мб']"
                  ></v-file-input>

                  <audio :src="item.action.points[0].audio ? (item.action.points[0].audio.localUrl ? item.action.points[0].audio.localUrl : item.action.points[0].audio.url) : ''" controls></audio>
                </template>

                <div class="map-input">
                  <map-input v-model="item.map"></map-input>
                </div>

                <template v-if="item.map.routes[0] && item.action.type === BEHAVIORS_TYPES.EXCURSION">
                  <v-row v-for="(point, j) in item.map.routes[0].points" :key="j">
                    <v-col>
                      <v-divider></v-divider>
                      <v-subheader>Точка {{j + 1}}</v-subheader>
                      <v-textarea
                        auto-grow
                        label="Описание"
                        v-model="item.action.points[j].description"
                        :rules="[v => !!v || 'Поле не заполнено']"
                      ></v-textarea>

                      <v-file-input
                        label="Аудиофайл"
                        accept="audio/*"
                        v-model="item.action.points[j].audioFile"
                        :loading="!!loadingQueue"
                        :disabled="!!loadingQueue"
                        @change="(e) => uploadFile(e, ENTITY_TYPES.AUDIO, item.action.points[j])"
                        :rules="[v => !!v || 'Поле не заполнено', v => !!v && v.size < 52428000 || 'Файл более 50 Мб']"
                      ></v-file-input>

                      <audio :src="item.action.points[j].audio ? (item.action.points[j].audio.localUrl ? item.action.points[j].audio.localUrl : item.action.points[j].audio.url) : ''" controls></audio>
                    </v-col>
                  </v-row>
                </template>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
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

export default {
  name: 'SingleObject',
  components: { MapInput },
  data: () => {
    return {
      item: {},
      ENTITY_TYPES: ENTITY_TYPES,
      BEHAVIORS_TYPES: BEHAVIORS_TYPES,
      BEHAVIORS_CONDITIONS_TYPES: BEHAVIORS_CONDITIONS_TYPES,
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

    openLink (mode) {
      let src = ''
      if (mode === 'DOWNLOAD') {
        src = this.item.modelFile.url
      }
      if (mode === 'OPEN') {
        src = location.origin + '/ModelViewer/index.html?=' + this.item.modelFile.url.split('/').pop()
      }

      if (src) {
        window.open(src, '_blank')
      }
    },

    saveData () {
      if (!this.$refs.map.validate() || !this.$refs.form.validate()) {
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

      // Behaviors
      let bError = ''
      data.behaviors = this.item.behaviors.map((B, j) => {
        const behavior = {
          type: B.action.type,
          action: {
            type: B.action.type,
            points: B.action.points.slice(0, B.map.routes[0].points.length).map((P, i) => ({
              lat: B.map.routes[0].points[i].lat,
              lng: B.map.routes[0].points[i].lng,
              audio: P.audio ? P.audio : B.action.points[0].audio,
              description: P.description ? P.description : B.action.points[0].description
            }))
          },
          conditions: B.conditions
        }

        if (behavior.action.points.length < 3) {
          bError = `Поведение ${j + 1} содержит менее 3-х точек`
        }

        return behavior
      })

      if (bError) {
        this.$root.$emit(CREATE_SNACHBAR, { text: bError })
        return
      }

      console.log(data.behaviors)
      this.$store.dispatch(UPDATE_OBJECT, data)
        .then(() => this.$router.push('/'))
        .catch((e) => this.$root.$emit(CREATE_SNACHBAR, { text: e.error }))
    },

    addBehavior () {
      const newBehavior = {
        action: {
          points: new Array(100).fill({})
        },
        map: {
          routes: []
        }
      }

      newBehavior.action.points = newBehavior.action.points.map(() => ({ audio: {} }))

      if (this.item.behaviors) {
        this.item.behaviors.push(newBehavior)
      } else {
        this.item.behaviors = [newBehavior]
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.map-input
  padding-top: 14px
</style>
