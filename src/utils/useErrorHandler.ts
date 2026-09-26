import { AxiosInstance } from "axios";

export type filter = "all";
interface IGetAllWallpapersParams {
  api: AxiosInstance;
  page?: number;
  limit?: number;
  filter: filter;
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
  wallpapers: IWallpaperResponse;
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
