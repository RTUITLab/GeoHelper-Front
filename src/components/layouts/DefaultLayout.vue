<template>
  <v-main>
    <v-app-bar
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click="drawerToggle = true"></v-app-bar-nav-icon>
      <v-toolbar-title

      >GeoHelper</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawerToggle"
      absolute
      temporary
    >
      <v-card-title>
        GeoHelper
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon @click="drawerToggle = false">mdi-chevron-left</v-icon>
        </v-btn>
      </v-card-title>
      <v-list
        dense
        nav
      >
        <v-list-item-group
          mandatory
          v-model="tabIndex"
          active-class="blue--text text--accent-4"
        >
          <v-list-item to="/create">
            <v-list-item-icon>
              <v-icon>mdi-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Создать объект</v-list-item-title>
          </v-list-item>
          <v-list-item to="/objects">
            <v-list-item-icon>
              <v-icon>mdi-view-list</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Объекты</v-list-item-title>
          </v-list-item>
          <v-list-item to="/map">
            <v-list-item-icon>
              <v-icon>mdi-map</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Карта</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
        <v-btn
          class="red--text text--accent-4 exit"
          elevation="0"
          @click="logout"
        >Выйти</v-btn>
      </v-list>
    </v-navigation-drawer>
    <div class="main-container" style="padding: 16px">
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </v-main>
</template>

<script>
import { LOGOUT } from '../../assets/globals'

export default {
  name: 'DefaultLayout',
  data: () => {
    return {
      drawerToggle: false,
      tabIndex: 1
    }
  },
  methods: {
    logout () {
      this.$store.commit(LOGOUT)
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="sass">
.exit
  position: absolute !important
  bottom: 16px
  width: 94%

.main-container
  max-width: 1200px
  margin: 0 auto
</style>
