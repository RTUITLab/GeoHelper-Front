<template>
  <v-content class="pt-12">
    <v-dialog
      class="dialog"
      persistent
      v-model="dialog"
    >
      <v-card>
        <v-toolbar
          color="blue darken-2"
          flat
          dark
        >
          <v-toolbar-title class="headline">Создать текстовый объект</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
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
          <app-map />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script>

export default {
  data () {
    return {
      dialog: true,
      validForm: false,
      form: {
        name: '',
        description: ''
      },
      nameRules: [v => !!v || 'Поле Название не заполнено'],
      descriptionRules: [v => !!v || 'Поле Описание не заполнено']
    }
  }
}
</script>
