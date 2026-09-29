import { AxiosError, AxiosInstance } from "axios";
import type { IWallpaperResponse } from "./type";
export interface ISubcategoryWallpapersResponse {
  subcategory: string;
  wallpapers: IWallpaperResponse[];
}
export interface IGetWallpaperForSubCategoryResponse {
  subcategories: ISubcategoryWallpapersResponse[];
}
export interface IGetAllWallpapersForSubCategoryParams {
  api: AxiosInstance;
  category: string;
}
export async function getAllWallpaperForSubCategoryHelper({
  api,
  category,
}: IGetAllWallpapersForSubCategoryParams): Promise<IGetWallpaperForSubCategoryResponse> {
  try {
    if (!api) {
      throw new Error("API instance not found");
    }
    const response = await api.get<IGetWallpaperForSubCategoryResponse>(
      `/wallpapers/get-all-wallpapers-for-subcategory`,
      { params: { category } },
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
