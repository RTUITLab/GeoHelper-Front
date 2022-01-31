<template>
  <v-toolbar
    elevation="2"
  >
    <v-toolbar-title>Редактировать объект</v-toolbar-title>
  </v-toolbar>
</template>

<script>
import { FETCH_OBJECTS, GET_OBJECT_ONE } from '../../assets/globals'

export default {
  name: 'SingleObject',
  data: () => {
    return {
      item: {}
    }
  },
  async created () {
    if (this.$route.params.id) {
      await this.$store.dispatch(FETCH_OBJECTS)
      this.item = this.$store.getters[GET_OBJECT_ONE](this.$route.params.id)
    }
  }
}
</script>

<style scoped>

</style>
