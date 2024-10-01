<template>
  <div class="pokemon-card" @click="detailsPokemon">
    <img :src="pokemonImage" :alt="pokemonName" class="pokemon-image" />
    <h3>{{ pokemonName }} (#{{ pokemonId }})</h3>
    <p class="pokemon-height">Altura: {{ height / 10 }} m</p>
    <p class="pokemon-weight">Peso: {{ weight / 10 }} kg</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  pokemonName: string;
  pokemonId: number;
  pokemonImage: string;
  height: number;
  weight: number;
}>();

const router = useRouter();

const detailsPokemon = () => {
  router.push({ name: 'PokemonDetails', params: { id: props.pokemonId } });
};
</script>

<style scoped>
.pokemon-card {
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  background: linear-gradient(180deg, #FEFF9F, #BBE9FF);
  transition: box-shadow 0.3s;
  cursor: pointer;
  width: 300px;
  height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.pokemon-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.pokemon-image {
  width: 200px;
  height: 200px;
}

.pokemon-height,
.pokemon-weight {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 5px 0;
}
</style>
