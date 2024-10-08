<template>
  <div>
    <Hero />
    <div class="favorites">
      <div class="favorites-header">
        <h2>Favoritos</h2>
        <button class="clear-favorites" @click="clearFavorites">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
      <div class="favorites-list">
        <span v-if="favoritePokemons.length === 0">Nenhum favorito ainda.</span>
        <ul>
          <li v-for="pokemon in favoritePokemons" :key="pokemon.id">
            {{ pokemon.name }} (#{{ pokemon.id }})
          </li>
        </ul>
      </div>
    </div>

    <div class="search-filters">
      <input
        v-model="searchTerm"
        placeholder="Buscar por nome ou número o Pokémon"
        class="custom-input"
      />
      <select v-model="selectedType" class="custom-select">
        <option value="">Todos os tipos</option>
        <option
          v-for="type in types"
          :key="type"
          :value="type"
        >
          {{ traduzirTipo(type) }}
        </option>
      </select>
    </div>

    <div class="pokemon-list">
      <PokemonCard
        v-for="pokemon in paginatedPokemonList"
        :key="pokemon.id"
        :pokemonName="pokemon.name"
        :pokemonId="pokemon.id"
        :pokemonImage="pokemon.image"
        :height="pokemon.height"
        :weight="pokemon.weight"
        @toggle-favorite="toggleFavorite"
        :is-favorite="isFavorite(pokemon.id)"
      />
    </div>

    <div class="pagination-controls">
      <button @click="previousPage" :disabled="currentPage === 1" class="pagination-button previous-button">
        <img src="../../assets/images/Pikachu_rtn.png" alt="Pikachu" class="hover-image" />
        Anterior
      </button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-button next-button">
        Próximo
        <img src="../../assets/images/Pikachu_nxt.png" alt="Pikachu" class="hover-image" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Hero from '../../components/Hero.vue';
import PokemonCard from '../../components/PokemonCard.vue';
import axios from 'axios';

interface Pokemon {
  name: string;
  id: number;
  image: string;
  height: number;
  weight: number;
  types: string[];
}

const searchTerm = ref('');
const selectedType = ref('');
const pokemonList = ref<Pokemon[]>([]);
const favoritePokemons = ref<Pokemon[]>([]);

const types = [
  'fire', 'water', 'grass', 'electric', 'rock', 'ground',
  'flying', 'bug', 'poison', 'normal', 'ghost', 'fighting',
  'ice', 'psychic', 'dragon', 'dark', 'fairy', 'steel'
];

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

const currentPage = ref(1);
const itemsPerPage = 15;

const filteredPokemonList = computed(() => {
  return pokemonList.value.filter(pokemon => {
    const matchesSearchTerm = pokemon.name.includes(searchTerm.value.toLowerCase()) || String(pokemon.id).includes(searchTerm.value);
    const matchesType = !selectedType.value || pokemon.types.includes(selectedType.value);
    return matchesSearchTerm && matchesType;
  });
});

const totalPages = computed(() => {
  return Math.ceil(filteredPokemonList.value.length / itemsPerPage);
});

const paginatedPokemonList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredPokemonList.value.slice(start, start + itemsPerPage);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const toggleFavorite = (pokemon: Pokemon) => {
  const index = favoritePokemons.value.findIndex(fav => fav.id === pokemon.id);
  if (index === -1) {
    favoritePokemons.value.push(pokemon);
  } else {
    favoritePokemons.value.splice(index, 1);
  }
};

const isFavorite = (id: number) => {
  return favoritePokemons.value.some(fav => fav.id === id);
};

const clearFavorites = () => {
  favoritePokemons.value = [];
};

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
.favorites {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.favorites-header {
  display: flex;
  align-items: center;
}

.favorites-header h2 {
  margin: 0;
  margin-right: 10px;
}

.clear-favorites {
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 15px;
}

.favorites-list {
  max-height: 150px;
  overflow-y: auto;
}

.search-filters {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.search-filters input {
  margin: 0 10px;
  padding: 10px;
  font-size: 1rem;
  width: 350px;
}

.custom-input {
  border: none;
  border-bottom: 2px solid #050403;
  border-radius: 0;
  box-shadow: none;
  outline: none;
  padding: 10px;
  font-size: 1rem;
  margin: 0 10px;
  background-color: transparent;
}

.custom-input:focus {
  border-bottom: 2px solid #3c68b0;
  background-color: transparent;
}

.custom-select {
  border: none;
  border-bottom: 2px solid #050403;
  border-radius: 0;
  box-shadow: none;
  outline: none;
  padding: 10px;
  font-size: 1rem;
  margin: 0 10px;
  background-color: transparent;
}

.pokemon-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  padding: 20px;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-button {
  padding: 10px 20px;
  background-color: #ffffff;
  color: #000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.3s;
  display: flex;
  align-items: center;
}

.pagination-button:hover {
  background-color: #f0f0f0;
}

.hover-image {
  margin-left: 5px;
  width: 20px;
  height: 20px;
}
</style>
