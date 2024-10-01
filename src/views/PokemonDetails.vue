<template>
  <div v-if="pokemon" class="pokemon-details">
    <div class="pokemon-container">
      <div class="pokemon-image-container">
        <img :src="pokemon.sprites.front_default" :alt="pokemon.name" class="pokemon-image" />
      </div>
      <div class="pokemon-info">
        <h1 class="pokemon-name">{{ pokemon.name }} (#{{ pokemon.id }})</h1>

        <div class="pokemon-types">
          <span
            v-for="type in pokemon.types"
            :key="type.type.name"
            :style="{ backgroundColor: getTypeColor(type.type.name) }"
            class="pokemon-type"
          >
            {{ traduzirTipo(type.type.name) }}
          </span>
        </div>

        <div class="pokemon-stats">
          <h2>Estatísticas</h2>
          <ul>
            <li v-for="stat in pokemon.stats" :key="stat.stat.name" class="stat-item">
              <div class="stat-name">{{ traduzirEstatistica(stat.stat.name) }}</div>
              <div class="stat-bar" :title="stat.base_stat">
                <div
                  class="stat-bar-filled"
                  :style="{ width: (stat.base_stat / 255) * 100 + '%', backgroundColor: getStatColor(stat.stat.name) }"
                ></div>
                <div
                  class="stat-bar-empty"
                  :style="{ width: (100 - (stat.base_stat / 255) * 100) + '%', backgroundColor: getStatColor(stat.stat.name), opacity: 0.3 }"
                ></div>

              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  types: Array<{
    type: {
      name: string;
    };
  }>;
}

const pokemon = ref<Pokemon | null>(null);
const route = useRoute();

const fetchPokemonDetails = async () => {
  const pokemonId = route.params.id;
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    pokemon.value = response.data;
  } catch (error) {
    console.error("Erro ao buscar Pokémon:", error);
  }
};

const getTypeColor = (type: string) => {
  const typeColors: { [key: string]: string } = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    rock: '#B8A038',
    ground: '#E0C068',
    flying: '#A890F0',
    bug: '#A8B820',
    poison: '#A040A0',
    normal: '#A8A878',
    ice: '#98D8D8',
    fighting: '#C03028',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };
  return typeColors[type] || '#FFFFFF';
};

const traduzirTipo = (tipo: string) => {
  const traducoes: { [key: string]: string } = {
    fire: 'Fogo',
    water: 'Água',
    grass: 'Grama',
    electric: 'Elétrico',
    rock: 'Pedra',
    ground: 'Terra',
    flying: 'Voador',
    bug: 'Inseto',
    poison: 'Veneno',
    normal: 'Normal',
    ice: 'Gelo',
    fighting: 'Lutador',
    ghost: 'Fantasma',
    dragon: 'Dragão',
    dark: 'Sombrio',
    steel: 'Aço',
    fairy: 'Fada',
  };
  return traducoes[tipo] || tipo;
};

const traduzirEstatistica = (estatistica: string) => {
  const traducoes: { [key: string]: string } = {
    hp: 'HP',
    attack: 'Ataque',
    defense: 'Defesa',
    'special-attack': 'Ataque Especial',
    'special-defense': 'Defesa Especial',
    speed: 'Velocidade',
  };
  return traducoes[estatistica] || estatistica;
};

const getStatColor = (statName: string) => {
  const statColors: { [key: string]: string } = {
    hp: '#4F75FF',
    attack: '#A02334',
    defense: '#97FEED',
    'special-attack': '#AD49E1',
    'special-defense': '#FFEB55',
    speed: '#E85C0D',
  };
  return statColors[statName] || '#FFFFFF';
};

onMounted(fetchPokemonDetails);
</script>

<style scoped>
.pokemon-details {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
}

.pokemon-container {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.pokemon-image-container {
  flex: 1;
  max-width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pokemon-image {
  max-width: 100%;
  max-height: 100%;
  height: 800px;
}

.pokemon-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 20px;
}

.pokemon-name {
  font-size: 2.5rem;
}

.pokemon-types {
  margin-top: 10px;
}

.pokemon-type {
  display: inline-block;
  margin: 5px;
  padding: 5px 10px;
  border-radius: 12px;
  color: #fff;
}

.pokemon-stats {
  margin-top: 20px;
}

.stat-item {
  margin: 10px 0;
  display: flex;
  align-items: center;
}

.stat-name {
  width: 150px;
}

.stat-bar {
  width: 300px;
  height: 15px;
  border-radius: 10px;
  flex-grow: 1;
  margin-left: 10px;
  background-color: transparent;
  position: relative;
}

.stat-bar-filled {
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.stat-bar-empty {
  height: 100%;
  border-radius: 10px;
  position: absolute;
  top: 0;
  left: 0;
}

.stat-value {
  position: absolute;
  right: 0;
  top: -20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 5px; 
  border-radius: 5px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-bar:hover .stat-value {
  opacity: 1;
}
</style>
