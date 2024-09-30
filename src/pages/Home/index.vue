<template>
  <div>
    <Hero />
    <div class="search-filters">
      <input v-model="searchTerm" placeholder="Buscar Pokémon" />
      <select v-model="selectedType">
        <option value="">Todos os tipos</option>
        <option v-for="type in types" :key="type" :value="type">{{ traduzirTipo(type) }}</option>
      </select>
    </div>
    
    <div class="pokemon-list">
      <PokemonCard
        v-for="pokemon in filteredPokemonList"
        :key="pokemon.id"
        :pokemonName="pokemon.name"
        :pokemonId="pokemon.id"
        :pokemonImage="pokemon.image"
        :height="pokemon.height"
        :weight="pokemon.weight"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Hero from '../../components/Hero.vue';
import PokemonCard from '../../components/PokemonCard.vue';
import axios from 'axios';

const searchTerm = ref('');
const selectedType = ref('');
const pokemonList = ref<any[]>([]);
const types = ['fire', 'water', 'grass', 'electric', 'rock', 'ground', 'flying', 'bug', 'poison', 'normal', 'ghost', 'fighting', 'ice', 'psychic', 'dragon', 'dark', 'fairy', 'steel'];

const fetchPokemonList = async () => {
  const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
  const pokemonDetails = await Promise.all(
    response.data.results.map(async (pokemon: any, index: number) => {
      const detailResponse = await axios.get(pokemon.url);
      const { height, weight, sprites, types } = detailResponse.data; 
      return {
        name: pokemon.name,
        id: index + 1,
        image: sprites.front_default,
        height,
        weight,
        types: types.map((typeInfo: any) => typeInfo.type.name)
      };
    })
  );
  pokemonList.value = pokemonDetails;
};

onMounted(() => {
  fetchPokemonList();
});

const filteredPokemonList = computed(() => {
  return pokemonList.value.filter(pokemon => {
    const matchesSearchTerm = pokemon.name.includes(searchTerm.value.toLowerCase()) || String(pokemon.id).includes(searchTerm.value);
    const matchesType = !selectedType.value || pokemon.types.includes(selectedType.value);
    return matchesSearchTerm && matchesType;
  });
});
const traduzirTipo = (tipo: string) => {
  const traducoes: { [key: string]: string } = {
    fire: 'Fogo',
    water: 'Água',
    grass: 'Planta',
    electric: 'Elétrico',
    rock: 'Pedra',
    ground: 'Terrestre',
    flying: 'Voador',
    bug: 'Inseto',
    poison: 'Venenoso',
    normal: 'Normal',
    ghost: 'Fantasma',
    fighting: 'Lutador',
    ice: 'Gelo',
    psychic: 'Psíquico',
    dragon: 'Dragão',
    dark: 'Sombrio',
    fairy: 'Fada',
    steel: 'Aço',
  };
  return traducoes[tipo] || tipo;
};
</script>

<style scoped>
.search-filters {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.search-filters input,
.search-filters select {
  margin: 0 10px;
  padding: 10px;
  font-size: 1rem;
}

.pokemon-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
}
</style>
