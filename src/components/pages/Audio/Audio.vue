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
        value="Звуковой"
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
        label="Аудиофайл"
        accept="audio/*"
        v-model="form.file"
        :rules="fileRules"
        @change="load"
        required
      ></v-file-input>
      <audio :src="audioSrc" controls></audio>
    </template>
  </object-modal>
</template>

<script>
import Audio from '@/components/pages/Audio'
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
      audioSrc: '',
      snackbar: false,
      message: ''
    }
  },
  components: {
    ObjectModal
  },
  methods: {
    load () {
      Audio.loadAudio(this)
    },
    save () {
      Audio.createObject(this)
    },
    update () {
      Audio.updateObject(this)
    }
  },
  mounted () {
    if (this.item) Audio.fillFields(this)
  }
}
</script>
