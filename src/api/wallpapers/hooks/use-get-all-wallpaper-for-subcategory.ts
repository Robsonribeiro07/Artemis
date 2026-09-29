import { useAllWallpaperForCategoryStore } from "@/store/wallpapers/use-state-all-walpaper-explorer";
import { useQuery } from "@tanstack/react-query";
import { WallpaperService } from "../wallpaper-service";

export function useGetAllWallpapersForSubCategory() {
  const category = useAllWallpaperForCategoryStore((state) => state.category);

  const query = useQuery({
    queryKey: ["wallpapers", "category", category],

    queryFn: async () => {
      const wallpapers = new WallpaperService("test");

      return wallpapers.getAllWallpaperForSubCategory({
        category,
      });
    },

    enabled: Boolean(category),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Infinity,
  });

  return {
    data: query.data,
    isFetched: query.isFetched,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
