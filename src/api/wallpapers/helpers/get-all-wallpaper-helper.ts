import { AxiosError, AxiosInstance } from "axios";
import { IGetWallpaperResponse } from "./type";
export interface IGetAllWallpapersParams {
  api: AxiosInstance;
  page?: number;
  limit?: number;
  filter: string;
  filterInput?: string;
}

export async function getAllWallpaperHelper({
  api,
  filter = "All",
  limit = 10,
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
