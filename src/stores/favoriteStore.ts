import { defineStore } from 'pinia';

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: [] as { id: number; name: string }[],
  }),
  actions: {
    addFavorite(pokemon: { id: number; name: string }) {
      this.favorites.push(pokemon);
    },
    removeFavorite(pokemonId: number) {
      this.favorites = this.favorites.filter((fav) => fav.id !== pokemonId);
    },
    isFavorite(pokemonId: number) {
      return this.favorites.some((fav) => fav.id === pokemonId);
    },
  },
});
