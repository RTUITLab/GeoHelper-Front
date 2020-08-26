<template>
  <div>
    <div id="nav-drawer">
      <v-navigation-drawer
        v-model="drawer"
        temporary
        fixed
        app
      >
        <v-toolbar
          flat
        >
          <v-toolbar-title>Создать</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-2"
            text
            @click="signout()"
          ><v-icon>mdi-exit-to-app</v-icon></v-btn>
        </v-toolbar>

        <v-divider></v-divider>

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
      </v-navigation-drawer>
    </div>
    <v-app-bar
      app
      color="blue darken-2"
      dark
      height="48"
    >
      <v-app-bar-nav-icon id="nav-btn" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="ml-4">GeoHelper</v-toolbar-title>

      <v-spacer></v-spacer>

      <div class="large-menu">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn
              color="white"
              outlined
              v-on="on"
            >Создать объект</v-btn>
          </template>
          <v-list class="large-menu">
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
      </div>
    </v-app-bar>
  </div>
</template>
<script>
import router from '@/router'
import Auth from '@/components/pages/Auth'

export default {
  data () {
    return {
      tabs: [
        {
          title: 'Звук',
          redirect: '/create-audio',
          disabled: false
        },
        {
          title: 'Текст',
          redirect: '/create-text',
          disabled: false
        },
        {
          title: 'Изображение',
          redirect: '/create-image',
          disabled: true
        }
      ],
      drawer: false
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

<style lang="scss">
@import '@/assets/styles.scss';

#nav-btn {
  display: none;

  @include _600 {
    display: flex;
  }
}

#nav-drawer {
  display: none;

  @include _600 {
    display: flex;
  }
}

.large-menu {
  @include _600 {
    display: none;
  }
}
</style>
