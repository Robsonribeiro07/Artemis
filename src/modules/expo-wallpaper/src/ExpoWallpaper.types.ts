export type WallpaperDownloadStatus =
  | "downloading"
  | "cached"
  | "completed"
  | "error";

export type DownloadWallpaperResult = {
  success: boolean;
  id: string;
  sourceUrl: string;
  uri: string;
  fileName: string;
  mimeType: string;
  downloadedBytes: number;
  totalBytes: number;
  fromCache: boolean;
  createdAt: number;
};

export type DownloadedWallpaper = {
  id: string;
  sourceUrl: string;
  uri: string;
  fileName: string;
  mimeType: string;
  size: number;
  createdAt: number;
};

export type OpenWallpaperEditorResult = {
  success: boolean;
  uri: string;
  sourceUri: string;
  mimeType: string;
};

export type OpenWallpaperPickerResult = DownloadWallpaperResult & {
  editorUri?: string;
};

export type WallpaperDownloadProgressEvent = {
  progress: number;
  downloadedBytes: number;
  totalBytes: number;
  status: WallpaperDownloadStatus;
  message?: string;
};

export type WallpaperDownloadCompleteEvent = {
  id: string;
  sourceUrl: string;
  uri: string;
  fileName: string;
  mimeType: string;
  downloadedBytes: number;
  totalBytes: number;
  fromCache: boolean;
  createdAt?: number;
};

export type ExpoWallpaperModuleEvents = {
  onDownloadProgress: (event: WallpaperDownloadProgressEvent) => void;

  onDownloadComplete: (event: WallpaperDownloadCompleteEvent) => void;
};
