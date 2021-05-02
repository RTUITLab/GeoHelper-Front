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
        value="Экскурсионный"
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
      <v-textarea
        label="Описание"
        v-model="form.description"
        :rules="descriptionRules"
        :rows="3"
        filled
        dense
        required
      ></v-textarea>
      <v-file-input
        label="Аудиофайл"
        accept="audio/*"
        v-model="form.audioFile"
        :rules="fileRules"
        @change="load('audio')"
        required
      ></v-file-input>
      <audio :src="audioSrc" controls></audio>
      <v-file-input
        label="Архив"
        accept="application/zip"
        v-model="form.modelFile"
        :rules="fileRules"
        @change="load('audio')"
        required
      ></v-file-input>
      <v-btn v-if="!changed && item" color="blue darken-2" text><a target="blanc" :href="`/view/${item.files.find((F) => F.type === 'model').url.split('/').pop()}`">Посмотреть</a></v-btn>
      <v-btn v-if="!changed && item" color="blue darken-2" text><a target="blanc" :href="fileLink()">Скачать</a></v-btn>
    </template>
  </object-modal>
</template>

<script>
import Model from '@/components/pages/Excursion'
import ObjectModal from '@/components/ObjectModal/ObjectModal.vue'

export default {
  props: ['item'],
  data () {
    return {
      dialog: true,
      validForm: false,
      form: {
        name: '',
        modelFile: '',
        audioFile: '',
        description: ''
      },
      changed: false,
      nameRules: [v => !!v || 'Поле Название не заполнено'],
      descriptionRules: [v => !!v || 'Поле Описание не заполнено'],
      fileRules: [v => !!v || 'Файл не выбран'],
      modelSrc: '',
      audioSrc: '',
      snackbar: false,
      message: ''
    }
  },
  components: {
    ObjectModal
  },
  methods: {
    load (type) {
      Model.loadModel(this, type)
    },
    save () {
      Model.createObject(this)
    },
    update () {
      Model.updateObject(this)
    },
    fileLink () {
      return Model.getFileLink(this)
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
