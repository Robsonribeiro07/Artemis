import { useWallpaperStore } from "@/store/wallpapers/use-wallpapers-store";
import { useQuery } from "@tanstack/react-query";
import { WallpaperService } from "../wallpaper-service";

export function useGetAllWallpapers() {
  const filter = useWallpaperStore((state) => state.filter);
  const filterInput = useWallpaperStore((state) => state.filterInput);
  const limit = useWallpaperStore((state) => state.limit);
  const currentPage = useWallpaperStore((state) => state.page);

  const query = useQuery({
    queryKey: ["wallpapers", currentPage, limit, filter, filterInput],

    queryFn: async () => {
      const wallpapers = new WallpaperService("test");

      return wallpapers.getAllWallpapers({
        filter,
        filterInput,
        page: currentPage,
        limit,
      });
    },
  });

  return {
    data: query.data,
    isFetched: query.isFetched,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
