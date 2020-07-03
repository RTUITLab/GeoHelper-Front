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
          <v-toolbar-title v-if="!item" class="headline">Создать текстовый объект</v-toolbar-title>
          <v-toolbar-title v-else class="headline">Изменить текстовый объект</v-toolbar-title>
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
              label="Название"
              v-model="form.name"
              class="mt-4"
              :rules="nameRules"
              filled
              dense
              required
            ></v-text-field>
            <v-textarea
              label="Описание"
              v-model="form.description"
              :rules="descriptionRules"
              :rows="3"
              filled
              dense
              required
            ></v-textarea>
          </v-form>
          <app-map ref="map" />
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-2" text @click="!!item ? update() : save()">Сохранить</v-btn>
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
import Text from '@/components/pages/Text'

export default {
  props: ['item'],
  data () {
    return {
      dialog: true,
      validForm: false,
      form: {
        name: '',
        description: ''
      },
      nameRules: [v => !!v || 'Поле Название не заполнено'],
      descriptionRules: [v => !!v || 'Поле Описание не заполнено'],
      snackbar: false,
      message: ''
    }
  },
  methods: {
    save () {
      Text.createObject(this)
    },
    update () {
      Text.updateObject(this)
    }
  },
  mounted () {
    if (this.item) Text.fillFields(this)
  }
}
</script>
