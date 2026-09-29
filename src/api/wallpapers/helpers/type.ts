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
  subcategory: string;
  thumbnailUrl: string;
  portraitUrl: string;
}

export interface IGetWallpaperForCategoryResponse {
  wallpapers: IWallpaperResponse[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    hasNextPages: boolean;
    hasPreviousPage: boolean;
  };
}

export interface IWallpaperSubcategoryResponse {
  subcategory: string;
  wallpaper: IWallpaperResponse;
}

export interface ICategoriesResponse {
  category: string;
  subcategories: IWallpaperSubcategoryResponse[];
}

export interface IGetWallpaperResponse {
  wallpapers: IWallpaperResponse[];
  categories: ICategoriesResponse[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
