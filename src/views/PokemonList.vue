<template>
    <div>
      <input v-model="searchTerm" placeholder="Buscar por nome ou número..." />
  
      <select v-model="selectedType">
        <option value="">Todos os tipos</option>
        <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
      </select>
  
      <div class="pokemon-list">
        <div v-for="pokemon in filteredPokemonList" :key="pokemon.name" class="pokemon-card">
          <img :src="pokemon.image" :alt="pokemon.name" />
          <h3>{{ pokemon.name }} (#{{ pokemon.id }})</h3>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  
  interface PokemonSummary {
    id: number;
    name: string;
    image: string;
    types: string[];
  }
  
  export default {
    setup() {
      const searchTerm = ref('');
      const selectedType = ref('');
      const pokemonList = ref<PokemonSummary[]>([]);
      const types = ['fire', 'water', 'grass', 'electric', 'rock', 'ground', 'flying', 'bug', 'poison', 'normal', 'ghost', 'fighting', 'ice', 'psychic', 'dragon', 'dark', 'fairy', 'steel'];
  
      const fetchPokemonList = async () => {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
        const pokemonData = await Promise.all(
          response.data.results.map(async (pokemon: any) => {
            const pokemonDetails = await axios.get(pokemon.url);
            return {
              name: pokemonDetails.data.name,
              id: pokemonDetails.data.id,
              image: pokemonDetails.data.sprites.front_default,
              types: pokemonDetails.data.types.map((t: any) => t.type.name),
            };
          })
        );
        pokemonList.value = pokemonData;
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
  
      return {
        searchTerm,
        selectedType,
        filteredPokemonList,
        types,
      };
    },
  };
  </script>
  
  <style scoped>
  .pokemon-list {
    display: flex;
    flex-wrap: wrap;
  }
  
  .pokemon-card {
    width: 150px;
    text-align: center;
    margin: 10px;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 8px;
  }
  
  .pokemon-card img {
    width: 100px;
    height: 100px;
  }
  </style>
  