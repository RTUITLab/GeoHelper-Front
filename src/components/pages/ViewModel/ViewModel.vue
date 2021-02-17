<template>
  <div id="renderer"></div>
</template>

<script>
import ViewModel from './index'

export default {
  data () {
    return {
      fileName: '',
      fs: undefined
    }
  },
  mounted () {
    this.fileName = this.$route.params.fileName

    ViewModel.initTree(this)
  }
}
</script>

<style lang="scss" scoped>
html, body {
  margin: 0;
  height: 100vh;
}
</style>
