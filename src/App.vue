<template>
  <div class="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch('getCategoriesFromDB')
    this.$store.dispatch('getNotesFromDB')
  },
}
</script>

<style>
  @import 'assets/less/index.less';
</style>
