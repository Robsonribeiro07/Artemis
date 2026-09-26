import { create } from "zustand";
import { storage } from "../storage";
const FAVORITES_KEY = "artemis:favorites";

interface FavoritesState {
  favorites: string[];
  addFavorite: (wallpaperId: string) => void;
  removeFavorite: (wallpaperId: string) => void;
  toggleFavorite: (wallpaperId: string) => void;
  isFavorite: (wallpaperId: string) => boolean;
  clearFavorites: () => void;
}

const getFavorites = (): string[] => {
  const data = storage.getString(FAVORITES_KEY);

  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: getFavorites(),

  addFavorite: (wallpaperId) => {
    const favorites = get().favorites;

    if (favorites.includes(wallpaperId)) return;

    const updatedFavorites = [...favorites, wallpaperId];

    storage.set(FAVORITES_KEY, JSON.stringify(updatedFavorites));

    set({ favorites: updatedFavorites });
  },

  removeFavorite: (wallpaperId) => {
    const updatedFavorites = get().favorites.filter((id) => id !== wallpaperId);

    storage.set(FAVORITES_KEY, JSON.stringify(updatedFavorites));

    set({ favorites: updatedFavorites });
  },

  toggleFavorite: (wallpaperId) => {
    const { favorites } = get();

    if (favorites.includes(wallpaperId)) {
      get().removeFavorite(wallpaperId);
    } else {
      get().addFavorite(wallpaperId);
    }
  },

  isFavorite: (wallpaperId) => {
    return get().favorites.includes(wallpaperId);
  },

  clearFavorites: () => {
    storage.remove(FAVORITES_KEY);

    set({ favorites: [] });
  },
}));
