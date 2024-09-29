import { createRouter, createWebHistory } from 'vue-router';
import PokemonList from './views/PokemonList.vue';
import PokemonDetails from './views/PokemonDetails.vue';

const routes = [
    { path: '/', component: PokemonList },
    { path: '/pokemon/:id', component: PokemonDetails }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
