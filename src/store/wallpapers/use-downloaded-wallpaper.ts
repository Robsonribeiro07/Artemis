import ExpoWallpaperModule from "@/modules/expo-wallpaper/src/ExpoWallpaperModule";
import { create } from "zustand";

type DownloadedWallpaperStore = {
  downloadedWallpapers: Map<string, string>;

  status: "idle" | "loading" | "loaded" | "error";

  loadDownloadedWallpapers: () => Promise<void>;

  addDownloadedWallpaper: (imageUrl: string, uri: string) => void;
};

export const useDownloadedWallpaperStore = create<DownloadedWallpaperStore>(
  (set, get) => ({
    downloadedWallpapers: new Map(),

    status: "idle",

    loadDownloadedWallpapers: async () => {
      const { status } = get();

      // Evita chamadas desnecessárias
      if (status === "loading" || status === "loaded") {
        return;
      }

      set({ status: "loading" });

      try {
        const wallpapers = await ExpoWallpaperModule.getDownloadedWallpapers();

        if (!wallpapers) {
          set({ status: "loaded" });
          return;
        }

        const map = new Map(
          wallpapers.map((wallpaper) => [wallpaper.sourceUrl, wallpaper.uri]),
        );

        set({
          downloadedWallpapers: map,
          status: "loaded",
        });
      } catch (error) {
        console.error("Erro ao carregar wallpapers baixados:", error);

        set({ status: "error" });
      }
    },

    addDownloadedWallpaper: (imageUrl, uri) => {
      set((state) => {
        const next = new Map(state.downloadedWallpapers);

        next.set(imageUrl, uri);

        return {
          downloadedWallpapers: next,
        };
      });
    },
  }),
);
