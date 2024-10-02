<template>
  <div>
    <input v-model="searchTerm" placeholder="Buscar por nome ou número..." class="form-control w-100" />

    <select v-model="selectedType" class="form-select">
      <option value="">Todos os tipos</option>
      <option v-for="type in types" :key="type" :value="type">
        {{ traduzirTipo(type) }}
      </option>
    </select>

    <div class="pokemon-list">
      <div v-for="pokemon in filteredPokemonList" :key="pokemon.id" class="pokemon-card">
        <img :src="pokemon.image" :alt="pokemon.name" />
        <h3>{{ pokemon.name }} (#{{ pokemon.id }})</h3>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

interface PokemonSummary {
  id: number;
  name: string;
  image: string;
  types: string[];
}

const searchTerm = ref('');
const selectedType = ref('');
const pokemonList = ref<PokemonSummary[]>([]);
const types = [
  'fire', 'water', 'grass', 'electric', 'rock', 'ground', 'flying',
  'bug', 'poison', 'normal', 'ghost', 'fighting', 'ice', 'psychic',
  'dragon', 'dark', 'fairy', 'steel'
];

const fetchPokemonList = async () => {
  try {
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
  } catch (error) {
    console.error("Erro ao buscar a lista de Pokémon:", error);
  }
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
