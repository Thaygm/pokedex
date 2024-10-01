<template>
  <div v-if="pokemon" class="pokemon-details">
    <button @click="goHome" class="back-button">
      Voltar
      <img src="../assets/images/Pikachu_rtn.png" alt="Pikachu" class="hover-image" />
    </button>
    <div class="pokemon-container">
      <div class="pokemon-image-container">
        <img :src="pokemon.sprites.front_default" :alt="pokemon.name" class="pokemon-image" />
      </div>
      <div class="pokemon-info">
        <h1 class="pokemon-name">{{ pokemon.name }} (#{{ pokemon.id }})</h1>

        <div class="pokemon-types">
          <h2>Tipos</h2>
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
              <div class="stat-name" :style="{ color: getStatColor(stat.stat.name) }">
                {{ traduzirEstatistica(stat.stat.name) }}
              </div>
              <div class="stat-bar">
                <div
                  class="stat-bar-empty"
                  :style="{ width: (100 - (stat.base_stat / 255) * 100) + '%', backgroundColor: getStatColor(stat.stat.name), opacity: 0.3 }"
                ></div>
                <div
                  class="stat-bar-filled"
                  :style="{ width: (stat.base_stat / 255) * 100 + '%', backgroundColor: getStatColor(stat.stat.name) }"
                ></div>
              </div>
            </li>
          </ul>
        </div>

        <div class="pokemon-evolution">
          <h2>Cadeia de Evolução</h2>
          <ul>
            <li v-for="(evolution, index) in evolutionChain" :key="index">
              <strong>{{ evolution.name }} (#{{ evolution.id }})</strong>
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
import { useRoute, useRouter } from 'vue-router';

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

interface Evolution {
  id: number;
  name: string;
}

const pokemon = ref<Pokemon | null>(null);
const evolutionChain = ref<Evolution[]>([]);
const route = useRoute();
const router = useRouter();

const fetchPokemonDetails = async () => {
  const pokemonId = route.params.id;
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    pokemon.value = response.data;
    await fetchEvolutionChain(pokemon.value.species.url);
  } catch (error) {
    console.error("Erro ao buscar Pokémon:", error);
  }
};

const fetchEvolutionChain = async (speciesUrl: string) => {
  try {
    const response = await axios.get(speciesUrl);
    const evolutionResponse = await axios.get(response.data.evolution_chain.url);
    const evolutions = evolutionResponse.data.chain;

    const fetchEvolutions = (chain: any): Evolution[] => {
      const evolutions: Evolution[] = [{ id: chain.species.url.split('/').slice(-2, -1)[0], name: chain.species.name }];
      if (chain.evolves_to.length > 0) {
        chain.evolves_to.forEach((evo: any) => {
          evolutions.push(...fetchEvolutions(evo));
        });
      }
      return evolutions;
    };

    evolutionChain.value = fetchEvolutions(evolutions);
  } catch (error) {
    console.error("Erro ao buscar a cadeia de evolução:", error);
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
    hp: '#87A2FF',
    attack: '#C7253E',
    defense: '#97FEED',
    'special-attack': '#CDC1FF',
    'special-defense': '#FFEB55',
    speed: '#FF8343',
  };
  return statColors[statName] || '#FFFFFF';
};

const goHome = () => {
  router.push({ name: 'Home' });
};

onMounted(fetchPokemonDetails);
</script>

<style scoped>
.pokemon-details {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(180deg, #FFCD0D, #3C68B0);
  overflow: hidden;
  position: relative;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px 15px;
  background-color: #ffffff;
  color: #000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.3s;
  display: flex;
  align-items: center;
}

.hover-image {
  opacity: 0;
  width: 30px;
  height: auto;
  margin-left: 10px;
  transition: opacity 0.3s ease;
}

.back-button:hover .hover-image {
  opacity: 1;
}

.back-button:hover {
  transform: scale(1.1);
}

.pokemon-container {
  display: flex;
  flex-direction: row;
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
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
  max-height: 800px;
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
  border-radius: 20px;
  color: #fff;
}

.pokemon-stats {
  margin-top: 20px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0;
}

.stat-name {
  width: 40%;
}

.stat-bar {
  position: relative;
  width: 60%;
  height: 20px;
  border-radius: 10px;
  overflow: hidden;
}

.stat-bar-empty {
  position: absolute;
  height: 100%;
  border-radius: 10px;
}

.stat-bar-filled {
  position: absolute;
  height: 100%;
  border-radius: 10px;
}

.stat-value {
  width: 20%;
  text-align: right;
}

.pokemon-evolution {
  margin-top: 20px;
}
</style>
