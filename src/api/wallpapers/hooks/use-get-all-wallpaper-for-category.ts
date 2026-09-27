import { useAllWallpaperForCategoryStore } from "@/store/wallpapers/use-state-all-walpaper-explorer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { WallpaperService } from "../wallpaper-service";

export function useGetAllWallpaperForCategory() {
  const limit = useAllWallpaperForCategoryStore((state) => state.limit);

  const category = useAllWallpaperForCategoryStore((state) => state.category);
  const isOpen = useAllWallpaperForCategoryStore((state) => state.isOpen);

  const query = useInfiniteQuery({
    queryKey: ["wallpapers", "category", category, limit],

    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const wallpapers = new WallpaperService("test");

      return wallpapers.getAllWallpaperForCategory({
        page: pageParam,
        category,
        limit,
      });
    },

    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasNextPages) {
      }

      return lastPage.pagination.page + 1;
    },

    refetchOnWindowFocus: false,

    enabled: Boolean(category) && isOpen,
  });

  const wallpapers = query.data?.pages.flatMap((page) => page.wallpapers) ?? [];

  return {
    data: {
      wallpapers,

      pagination: query.data?.pages[query.data.pages.length - 1]?.pagination,
    },

    isLoading: query.isLoading,

    isFetching: query.isFetching,

    isFetchingNextPage: query.isFetchingNextPage,

    hasNextPage: query.hasNextPage,

    fetchNextPage: query.fetchNextPage,

    isError: query.isError,

    error: query.error,
  };
}
