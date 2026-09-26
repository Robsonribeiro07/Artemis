import api from "@/lib/axios";
import { AxiosInstance } from "axios";

import {
  getAllWallpaperHelper,
  IGetAllWallpapersParams,
} from "./helpers/get-all-wallpaper-helper";

type GetAllWallpapersParams = Omit<IGetAllWallpapersParams, "api">;

export class WallpaperService {
  private api: AxiosInstance;

  constructor(private token: string | null) {
    if (!token) {
      throw new Error("token is required");
    }

    this.api = api({
      token: this.token,
    });

    console.log("API:", this.api.defaults.baseURL);
  }

  async getAllWallpapers({
    filter,
    filterInput,
    limit,
    page,
  }: GetAllWallpapersParams) {
    console.log("PARAMS:", {
      filter,
      filterInput,
      limit,
      page,
    });

    const response = await getAllWallpaperHelper({
      filter,
      filterInput,
      api: this.api,
      limit,
      page,
    });

    return response;
  }
}
