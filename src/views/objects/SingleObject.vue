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

        <v-divider></v-divider>

        <template v-if="ENTITY_TYPES.TEXT === item.type">
          <v-text-field
            v-model="item.description"
            label="Описание"
            :rules="[v => !!v || 'Поле не заполнено']"
          ></v-text-field>
        </template>

        <v-divider></v-divider>

        <div class="map-input">
          <map-input v-model="item.map"></map-input>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { FETCH_OBJECTS, GET_OBJECT_ONE, ENTITY_TYPES } from '../../assets/globals'
import MapInput from '../../components/maps/MapInput'

export default {
  name: 'SingleObject',
  components: { MapInput },
  data: () => {
    return {
      item: {},
      ENTITY_TYPES: ENTITY_TYPES
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
    } else {
      this.item.map = {}
    }
  }
}
</script>

<style lang="sass" scoped>
.map-input
  padding-top: 14px
</style>
