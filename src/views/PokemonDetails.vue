<template>
<div v-if="pokemon">
    <h1>{{ pokemon.name }} (#{{ pokemon.id }})</h1>
    <img :src="pokemon.sprites.front_default" alt="Imagem do Pokémon" />
    
    <h2>Estatísticas</h2>
    <ul>
        <li v-for="stat in pokemon.stats" :key="stat.stat.name">
            {{ stat.stat.name }}: {{ stat.base_stat }}
        </li>
    </ul>
    
    <h2>Tipos</h2>
    
    <div
    v-for="type in pokemon.types"
    :key="type.type.name"
    :style="{ backgroundColor: getTypeColor(type.type.name) }"
    >
    {{ type.type.name }}
</div>
</div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

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

export default {
    props: {
        pokemonId: {
            type: Number,
            required: true,
        },
    },
    setup(props) {
        const pokemon = ref<Pokemon | null>(null);
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
            fairy: '#EE99AC'
        };

        const fetchPokemonDetails = async () => {
            const response = await axios.get(
                `https://pokeapi.co/api/v2/pokemon/${props.pokemonId}`,
            );
            pokemon.value = response.data;
        };

        const getTypeColor = (typeName: string) => {
            return typeColors[typeName] || '#000';
        };

        onMounted(() => {
            fetchPokemonDetails();
        });

        return {
            pokemon,
            getTypeColor,
        };
    },
};
</script>

<style scoped>
</style>
