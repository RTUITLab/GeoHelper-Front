<template>
  <div>
    <template v-if="ENTITY_TYPES.TEXT === type || type === ENTITY_TYPES.EXCURSION">
      <v-textarea
        v-model="description"
        label="Описание"
        auto-grow
        :rules="[v => !!v || 'Поле не заполнено']"
      ></v-textarea>
    </template>
  </div>
</template>

<script>
import { ENTITY_TYPES } from '../../../assets/globals'

export default {
  name: 'DataSection',
  props: ['type', 'itemData'],
  data: () => {
    return {
      description: '',
      ENTITY_TYPES: ENTITY_TYPES
    }
  },
  created () {
    this.description = this.itemData.description
  }
}
</script>

<style scoped>

</style>
