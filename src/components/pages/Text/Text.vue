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
        value="Текстовый"
        filled
        dense
        disabled
      ></v-text-field>
      <v-text-field
        label="Название"
        v-model="form.name"
        class="mt-4"
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
    </template>
  </object-modal>
</template>

<script>
import Text from '@/components/pages/Text'
import ObjectModal from '@/components/ObjectModal/ObjectModal.vue'

export default {
  props: ['item'],
  data () {
    return {
      dialog: true,
      validForm: false,
      form: {
        name: '',
        description: ''
      },
      nameRules: [v => !!v || 'Поле Название не заполнено'],
      descriptionRules: [v => !!v || 'Поле Описание не заполнено'],
      snackbar: false,
      message: ''
    }
  },
  components: {
    ObjectModal
  },
  methods: {
    save () {
      Text.createObject(this)
    },
    update () {
      Text.updateObject(this)
    }
  },
  mounted () {
    if (this.item) Text.fillFields(this)
  }
}
</script>
