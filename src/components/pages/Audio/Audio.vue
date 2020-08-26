<template>
  <v-content class="pt-12">
    <v-dialog
      class="dialog"
      persistent
      max-width="1200"
      scrollable
      v-model="dialog"
    >
      <v-card>
        <v-toolbar
          color="blue darken-2"
          flat
          dark
        >
          <v-toolbar-title v-if="!item" class="headline">Создать объект</v-toolbar-title>
          <v-toolbar-title v-else class="headline">Изменить объект</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="$router.push('/')"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-form
            v-model="validForm"
            ref="form"
          >
            <v-text-field
              label="Тип объекта"
              class="mt-4"
              value="Звуковой"
              filled
              dense
              disabled
            ></v-text-field>
            <v-text-field
              label="Название"
              v-model="form.name"
              :rules="nameRules"
              filled
              dense
              required
            ></v-text-field>
            <v-file-input
              label="Аудиофайл"
              accept="audio/*"
              v-model="form.file"
              :rules="fileRules"
              @change="load"
              required
            ></v-file-input>
            <audio :src="audioSrc" controls></audio>
          </v-form>
          <app-map ref="map" />
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-2"
            text
            @click="!!item ? update() : save()"
          >Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      :timeout="3000"
      bottom
      color="red darken-3"
      v-model="snackbar"
    >{{ message }}</v-snackbar>
  </v-content>
</template>

<script>
import Audio from '@/components/pages/Audio'

export default {
  props: ['item'],
  data () {
    return {
      dialog: true,
      validForm: false,
      form: {
        name: '',
        file: ''
      },
      changed: false,
      nameRules: [v => !!v || 'Поле Название не заполнено'],
      fileRules: [v => !!v || 'Файл не выбран'],
      audioSrc: '',
      snackbar: false,
      message: ''
    }
  },
  methods: {
    load () {
      Audio.loadAudio(this)
    },
    save () {
      Audio.createObject(this)
    },
    update () {
      Audio.updateObject(this)
    }
  },
  mounted () {
    if (this.item) Audio.fillFields(this)
  }
}
</script>
