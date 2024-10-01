<template>
    <div v-if="pokemon" class="pokemon-details">
      <h1>{{ pokemon.name }} (#{{ pokemon.id }})</h1>
      <img :src="pokemon.sprites.front_default" :alt="pokemon.name" class="pokemon-image" />
  
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
          <li v-for="stat in pokemon.stats" :key="stat.stat.name">
            {{ traduzirEstatistica(stat.stat.name) }}: {{ stat.base_stat }}
          </li>
        </ul>
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
  
  onMounted(fetchPokemonDetails);
  </script>
  
  <style scoped>
  .pokemon-details {
    text-align: center;
  }
  
  .pokemon-image {
    width: 200px;
    height: auto;
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
  </style>
  