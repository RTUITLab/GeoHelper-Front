<template>
  <section>
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

    <p v-if="!value || !value.length" style="text-align: center">Поведение отсутствует</p>
    <v-expansion-panels v-else>
      <v-expansion-panel
        v-for="(item,i) in value"
        :key="i"
      >
        <v-expansion-panel-header>
          <v-row>
            <v-col class="ma-auto" cols="auto">Поведение {{i + 1}}</v-col>
            <v-col>
              <v-btn icon small @click.stop="value.splice(i, 1)">
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
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
            <file-input audio :file-name="item.action.points[0].audio.fileName" @change="(e) => { item.action.points[0].audio = e }"></file-input>

            <audio :src="item.action.points[0].audio.localUrl || item.action.points[0].audio.url || ''" controls></audio>
            <v-spacer style="margin-top: 16px"></v-spacer>
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

                <file-input audio :file-name="item.action.points[j].audio.fileName" @change="(e) => { item.action.points[j].audio = e }"></file-input>

                <audio :src="item.action.points[j].audio.localUrl || item.action.points[j].audio.url || ''" controls></audio>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </section>
</template>

<script>
import { BEHAVIORS_CONDITIONS_TYPES, BEHAVIORS_TYPES, CREATE_SNACHBAR } from '../../../assets/globals'
import FileInput from './FileInput'
import MapInput from '../../maps/MapInput'

export default {
  name: 'BehaviorSection',
  components: { MapInput, FileInput },
  props: ['behaviors'],
  data: () => {
    return {
      value: [],
      BEHAVIORS_TYPES: BEHAVIORS_TYPES,
      BEHAVIORS_CONDITIONS_TYPES: BEHAVIORS_CONDITIONS_TYPES
    }
  },
  created () {
    if (this.behaviors) {
      this.behaviors.forEach((B) => {
        this.addBehavior()

        const lastB = this.value[this.value.length - 1]
        lastB.action.type = B.action.type
        lastB.conditions = B.conditions
        lastB.map = {
          routes: [{ points: B.action.points.map((point) => ({ lat: point.lat, lng: point.lng })) }]
        }

        for (let i = 0; i < lastB.map.routes[0].points.length; i++) {
          lastB.action.points[i] = B.action.points[i]
        }
      })
    }
  },
  methods: {
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

      if (this.value) {
        this.value.push(newBehavior)
      } else {
        this.value = [newBehavior]
      }
    },

    validate () {
      let bError = ''

      if (!this.value.length) {
        return []
      }

      const temp = this.value.map((B, j) => {
        if (!B.map.routes[0]) {
          bError = `Поведению ${j + 1} не задан маршрут`
          return
        }

        const behavior = {
          type: B.action.type,
          action: {
            type: B.action.type,
            points: B.action.points.slice(0, B.map.routes[0].points.length).map((P, i) => {
              if (!(P.audio ? P.audio : B.action.points[0].audio).url) {
                bError = 'Не все аудио файлы загружены'
              }

              return {
                lat: B.map.routes[0].points[i].lat,
                lng: B.map.routes[0].points[i].lng,
                audio: P.audio ? P.audio : B.action.points[0].audio,
                description: P.description ? P.description : B.action.points[0].description
              }
            })
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
        return false
      }

      return temp
    }
  }
}
</script>

<style scoped>

</style>
