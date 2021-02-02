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
          <slot name="header"></slot>

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
            <slot name="form"></slot>
          </v-form>
          <app-map ref="map" />
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-2" text @click="action">Сохранить</v-btn>
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
export default {
  props: ['message', 'snackbar', 'validForm', 'action'],
  data () {
    return {
      dialog: true
    }
  }
}
</script>
