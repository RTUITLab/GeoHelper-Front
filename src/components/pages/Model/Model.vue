<template>
  <object-modal
    :message="message"
    :snackbar="snackbar"
    :validForm="validForm"
    :action="!!item ? update : save"
    ref="modal"
  >
    <template v-slot:header>
      <v-toolbar-title v-if="!item" class="headline">Создать объект</v-toolbar-title>
      <v-toolbar-title v-else class="headline">Изменить объект</v-toolbar-title>
    </template>
    <template v-slot:form>
      <v-text-field
        label="Тип объекта"
        class="mt-4"
        value="Модель"
        filled
        dense
        disabled
      ></v-text-field>
      <v-text-field
        label="Название"
        v-model="form.name"
        :rules="nameRules"
        filled
        dense
        required
      ></v-text-field>
      <v-file-input
        label="Архив"
        accept="application/zip"
        v-model="form.file"
        :rules="fileRules"
        @change="load"
        required
      ></v-file-input>
      <v-btn color="blue darken-2" text><a v-if="!changed" target="blanc" :href="`/view/${item.url.split('/').pop()}`">Посмотреть</a></v-btn>
    </template>
  </object-modal>
</template>

<script>
import Model from '@/components/pages/Model'
import ObjectModal from '@/components/ObjectModal/ObjectModal.vue'

export default {
  props: ['item'],
  data () {
    return {
      dialog: true,
      validForm: false,
      form: {
        name: '',
        file: ''
      },
      changed: false,
      nameRules: [v => !!v || 'Поле Название не заполнено'],
      fileRules: [v => !!v || 'Файл не выбран'],
      modelSrc: '',
      snackbar: false,
      message: ''
    }
  },
  components: {
    ObjectModal
  },
  methods: {
    load () {
      Model.loadModel(this)
    },
    save () {
      Model.createObject(this)
    },
    update () {
      Model.updateObject(this)
    }
  },
  mounted () {
    if (this.item) Model.fillFields(this)
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}

button {
  text-decoration: none;
}
</style>
