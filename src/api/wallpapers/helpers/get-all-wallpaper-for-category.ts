import { AxiosError, AxiosInstance } from "axios";
import { IGetWallpaperForCategoryResponse } from "./type";

export interface IGetAllWallpapersForCategoryParams {
  api: AxiosInstance;
  page?: number;
  limit?: number;
  category: string;
}

export async function getAllWallpaperForCategoryHelper({
  api,
  limit = 10,
  page = 1,
  category,
}: IGetAllWallpapersForCategoryParams): Promise<IGetWallpaperForCategoryResponse> {
  try {
    if (!api) {
      throw new Error("API instance not found");
    }

    const response = await api.get<IGetWallpaperForCategoryResponse>(
      `/wallpapers/get-all-wallpapers-for-category`,
      {
        params: {
          page,
          limit,
          category,
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
