<template>
  <div>
    <v-card
      class="mx-auto"
      max-width="400"
      elevation="7"
    >
      <v-toolbar color="blue darken-2" dark flat>
        <v-toolbar-title>Вход в систему</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-form v-model="validLogin">
          <v-text-field
            label="Логин"
            v-model="credentials.username"
            prepend-icon="mdi-account"
            :rules="rules"
            required
            color="blue darken-2"
          ></v-text-field>
          <v-text-field
            label="Пароль"
            v-model="credentials.password"
            prepend-icon="mdi-key"
            :rules="rules"
            :append-icon="loginPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
            :type="loginPasswordVisible ? 'text' : 'password'"
            color="blue darken-2"
            required
            @click:append="() => (loginPasswordVisible = !loginPasswordVisible)"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-2"
          dark
          @click.native="submitAuthorization()"
        >Войти</v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar
      :timeout="3000"
      bottom
      color="red darken-3"
      v-model="snackbar"
    >{{ message }}</v-snackbar>
  </div>
</template>

<script>
import Auth from '@/components/pages/Auth'

export default {
  data () {
    return {
      snackbar: false,
      validLogin: false,
      loginPasswordVisible: false,
      rules: [(value) => !!value || 'Это поле обязательное'],
      credentials: {
        username: '',
        password: ''
      },
      message: ''
    }
  },
  methods: {
    submitAuthorization () {
      Auth.authorize(this, this.credentials, '/')
    }
  }
}
</script>

<style lang="scss">
  @import "./../../../assets/styles";
  .mx-auto {
    margin-top: 100px;
    animation: bounceIn .6s forwards ease;
  }
</style>
