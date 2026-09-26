import { AxiosError, AxiosInstance } from "axios";

export type Filter = "all";

export interface IGetAllWallpapersParams {
  api: AxiosInstance;
  page?: number;
  limit?: number;
  filter: Filter;
  filterInput?: string;
}

export interface IWallpaperResponse {
  _id: string;
  title: string;
  imageUrl: string;
  category: string;
  tags: string[];
  resolution: string;
  width: number;
  height: number;
  isFeatured: boolean;
  downloads: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface IGetWallpaperResponse {
  wallpapers: IWallpaperResponse[];

  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export async function getAllWallpaperHelper({
  api,
  filter = "all",
  limit = 5,
  page = 1,
  filterInput,
}: IGetAllWallpapersParams): Promise<IGetWallpaperResponse> {
  try {
    if (!api) {
      throw new Error("API instance not found");
    }

    const response = await api.get<IGetWallpaperResponse>(
      `/wallpapers/get-all-wallpapers`,
      {
        params: {
          page,
          limit,
          filter,
          filterInput,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error);
      throw new Error(
        error.response?.data?.error || "Erro ao buscar wallpapers",
      );
    }

    throw error;
  }
}
