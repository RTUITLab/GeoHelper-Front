<template>
  <v-data-table
    :headers="headers"
    :items="filteredObjects"
    :loading="loading"
    loading-text="Загрузка объектов"
    class="elevation-2"
    style="cursor: pointer"
    @click:row="rowClick"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Объекты</v-toolbar-title>
        <v-divider
          class="mx-4"
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-btn
          icon
          title="Обновить"
          @click="loadObjects"
        ><v-icon>mdi-refresh</v-icon></v-btn>
      </v-toolbar>

      <v-text-field
        label="Поиск"
        class="px-4 pt-0"
        append-icon="mdi-magnify"
        v-model="search"
        @input="changeQuery"
      ></v-text-field>
    </template>

    <template v-slot:item.name="{ item }">
      {{ item.name }}
      <v-badge
        inline
        dot
        :color="setBadge(item).color"
        :title="setBadge(item).title"
      ></v-badge>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-btn
        icon
        small
        class="mr-2"
        :to="`objects/${item._id}`"
        title="Изменить"
      >
        <v-icon
          small
        >mdi-pencil</v-icon>
      </v-btn>

      <v-btn
        icon
        small
        @click="deleteItem(item._id)"
        title="Удалить"
      >
        <v-icon
          small
        >mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { CREATE_SNACHBAR, DELETE_OBJECT, FETCH_OBJECTS, GET_OBJECTS } from '../../assets/globals'
import router from '../../router'

export default {
  name: 'ObjectsList',
  data: () => {
    return {
      loading: true,
      headers: [
        { text: 'Название', align: 'start', value: 'name' },
        { text: 'Тип', value: 'pType' },
        { text: '', value: 'actions', sortable: false, align: 'end' }
      ],
      objects: [],
      search: ''
    }
  },
  created () {
    if (this.$route.query.q) {
      this.search = this.$route.query.q
    }
    this.loadObjects()
  },
  computed: {
    filteredObjects: function () {
      return this.objects.filter((item) => JSON.stringify(item).toLowerCase().indexOf(this.search.toLowerCase()) !== -1)
    }
  },
  methods: {
    loadObjects () {
      this.loading = true
      this.$store.dispatch(FETCH_OBJECTS)
        .then((data) => {
          this.objects = data
          this.loading = false
        })
        .catch(() => {
          this.$root.$emit(CREATE_SNACHBAR, { text: 'Не удалось получить список объектов' })
        })
    },

    deleteItem (id) {
      this.loading = true
      this.$store.dispatch(DELETE_OBJECT, id)
        .then(() => {
          this.objects = this.$store.getters[GET_OBJECTS]
        })
        .catch((e) => {
          this.$root.$emit(CREATE_SNACHBAR, { text: e.message })
        })
        .finally(() => (this.loading = false))
      return 0
    },

    rowClick (item) {
      router.push(`/objects/${item._id}`)
    },

    setBadge (item) {
      if (item.status === 0) {
        return { color: 'success', title: 'Готов' }
      } else if (item.status < 3) {
        return { color: 'blue', title: 'Обрабатывается' }
      }
      return { color: 'error', title: 'Нет файлов' }
    },

    changeQuery () {
      if (this.search) {
        router.replace({ path: '', query: { q: this.search } })
      } else {
        router.replace({ path: '', query: { } })
      }
    }
  }
}
</script>

<style scoped>

</style>
