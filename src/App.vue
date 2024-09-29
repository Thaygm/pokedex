<template>
  <div id="app">
    <PokemonList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PokemonList from './views/PokemonList.vue';

export default defineComponent({
  components: {
    PokemonList,
  },
});
</script>

<style>
</style>
