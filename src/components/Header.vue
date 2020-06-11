<template>
  <v-app-bar
      app
      color="blue darken-2"
      dark
      height="48"
    >
      <v-toolbar-title class="ml-4">GeoHelper</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn
            color="white"
            outlined
            v-on="on"
          >Создать объект</v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(tab, index) in tabs"
            :key="index"
            :disabled="tab.disabled"
            @click="create(tab.redirect)"
          >
            <v-list-item-title>{{ tab.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        class="ml-4"
        color="white"
        text
        @click="signout()"
      >Выйти</v-btn>
    </v-app-bar>
</template>
<script>
import router from '@/router'
import Auth from '@/components/pages/Auth'

export default {
  data () {
    return {
      tabs: [
        {
          title: 'Текст',
          redirect: '/create-text',
          disabled: false
        },
        {
          title: 'Изображение',
          redirect: '/create-image',
          disabled: false
        }
      ]
    }
  },
  methods: {
    signout () {
      Auth.signout(this, '/login')
    },
    create (redirect) {
      router.push(redirect)
    }
  }
}
</script>
