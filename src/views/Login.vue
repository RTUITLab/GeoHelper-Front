<template>
  <v-main>
    <v-card
      style="max-width: 360px"
      class="mx-auto mt-16"
      :loading="loading"
    >
      <v-card-title class="blue--text text--accent-4">GeoHelper</v-card-title>
      <v-card-text>
        <v-form @submit="login">
          <v-text-field
            v-model="form.username"
            prepend-icon="mdi-account"
            label="Логин"
            type="text"
            :rules="[v => !!v || 'Поле не заполнено']"
          ></v-text-field>
          <v-text-field
            v-model="form.password"
            prepend-icon="mdi-key"
            label="Пароль"
            type="password"
            :rules="[v => !!v || 'Поле не заполнено']"
            class="pb-3"
            @keyup.enter="login"
          ></v-text-field>
          <v-btn
            dark
            class="blue accent-4"
            elevation="0"
            block
            @click="login"
          >Войти</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script>
import { CHECK_AUTH, CREATE_SNACHBAR, LOGIN } from '../assets/globals'

export default {
  name: 'Login',
  data: () => {
    return {
      form: {
        username: '',
        password: ''
      },
      loading: false
    }
  },
  created () {
    if (this.$store.getters[CHECK_AUTH]) {
      this.$router.push('/')
    }
  },
  methods: {
    login () {
      this.loading = true

      this.$store.dispatch(LOGIN, this.form)
        .then(() => {
          this.$router.push('/')
        })
        .catch((e) => {
          this.$root.$emit(CREATE_SNACHBAR, { text: e.message })
        })
        .finally(() => (this.loading = false))
    }
  }
}
</script>

<style scoped>

</style>
