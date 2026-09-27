import { IGetWallpaperResponse } from "@/api/wallpapers/helpers/type";
import { AxiosInstance } from "axios";

export type filter = "all";
interface IGetAllWallpapersParams {
  api: AxiosInstance;
  page?: number;
  limit?: number;
  filter: filter;
  filterInput?: string;
}

export async function getAllWallpaperHelper({
  api,
  filter = "all",
  limit = 5,
  page = 1,
  filterInput = undefined,
}: IGetAllWallpapersParams): Promise<IGetWallpaperResponse> {
  try {
    if (!api) throw new Error("api instance not found");

    const response = await api.get(
      `/wallpapers/get-all-wallpapers?page=${page}&limit=${limit}&filter=${filter}&filterInput=${filterInput}`,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error);
  }
}
