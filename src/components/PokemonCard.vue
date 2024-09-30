<template>
  <div class="pokemon-card">
    <img :src="pokemonImage" :alt="pokemonName" class="pokemon-image" />
    <h3>{{ pokemonName }} (#{{ pokemonId }})</h3>
    <p>Altura: {{ height / 10 }} m</p>
    <p>Peso: {{ weight / 10 }} kg</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  pokemonName: string;
  pokemonId: number;
  pokemonImage: string;
  height: number;
  weight: number;
}>();

const { pokemonName, pokemonId, pokemonImage, height, weight } = props;
</script>

<style scoped>
.pokemon-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  background-color: #f9f9f9;
  transition: box-shadow 0.3s;
}

.pokemon-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.pokemon-image {
  width: 100px;
  height: 100px;
}
</style>
