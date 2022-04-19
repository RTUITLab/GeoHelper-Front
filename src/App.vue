<template>
  <v-app>
    <router-view/>
    <v-snackbar
      v-model="snackbar.isShowing"
      :timeout="snackbar.timeout"
      :color="snackbar.type"
      outlined
    >{{ snackbar.text }}</v-snackbar>
  </v-app>
</template>

<script>
import { CREATE_SNACHBAR, INIT_APP } from './assets/globals'

export default {
  name: 'App',
  data: () => ({
    snackbar: {
      text: '',
      timeout: 2000,
      type: 'success',
      isShowing: false
    }
  }),
  created () {
    this.$store.commit(INIT_APP)

    this.$root.$on(CREATE_SNACHBAR, (params) => {
      this.snackbar = {
        text: params.text || 'Неизвестная ошибка',
        timeout: params.timeout || 2000,
        type: params.type || 'error',
        isShowing: true
      }
    })
  }
}
</script>
