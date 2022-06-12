<template>
  <v-btn
    :disabled="!id"
    :loading="isLoading"
    icon
    title="Скопировать токен"
    @click="copyToken"
  >
    <v-icon>mdi-content-copy</v-icon>
  </v-btn>
</template>

<script>
import { CREATE_SNACHBAR, FETCH_OBJECT_TOKEN } from '../../assets/globals'

export default {
  name: 'TokenBtn',
  props: ['id'],
  data: () => ({
    isLoading: false
  }),
  methods: {
    async copyToken () {
      this.isLoading = true
      try {
        const key = await this.$store.dispatch(FETCH_OBJECT_TOKEN, this.id)
        await navigator.clipboard.writeText(key)
        this.$root.$emit(CREATE_SNACHBAR, { text: 'Токен скопирован', type: 'success' })
      } catch (e) {
        this.$root.$emit(CREATE_SNACHBAR, { text: 'Не удалось скопировать токен' })
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
