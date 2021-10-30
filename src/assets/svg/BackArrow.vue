<template lang="html">
  <svg width="7" height="12" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" :stroke="color" stroke-width="1.2" points="6 1 1 6 6 11"></polyline></svg>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    color: String,
  },
})
export default class BackArrow extends Vue { }
</script>
