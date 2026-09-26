import { requireNativeModule } from "expo-modules-core";

import type {
  DownloadWallpaperResult,
  DownloadedWallpaper,
  ExpoWallpaperModuleEvents,
  OpenWallpaperEditorResult,
  OpenWallpaperPickerResult,
} from "./ExpoWallpaper.types";

export type WallpaperModule = {
  downloadWallpaper(imageUrl: string): Promise<DownloadWallpaperResult>;

  openWallpaperEditor(uri: string): Promise<OpenWallpaperEditorResult>;

  openWallpaperPicker(value: string): Promise<OpenWallpaperPickerResult>;

  getDownloadedWallpapers(): Promise<DownloadedWallpaper[]>;

  getDownloadedWallpaper(imageUrl: string): Promise<DownloadedWallpaper | null>;

  isWallpaperDownloaded(imageUrl: string): Promise<boolean>;

  addListener<K extends keyof ExpoWallpaperModuleEvents>(
    eventName: K,
    listener: ExpoWallpaperModuleEvents[K],
  ): { remove: () => void };
};

const ExpoWallpaperModule =
  requireNativeModule<WallpaperModule>("ExpoWallpaper");

export default ExpoWallpaperModule;
