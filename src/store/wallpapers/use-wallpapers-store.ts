import { create } from "zustand";

export type Filter = "all";
export type BehaviorType = "apply" | "download";

interface WallpaperState {
  filter: Filter;
  filterInput: string;
  page: number;
  limit: number;

  stateModalWallpaper: boolean;
  selectedWallpaperUri: string | undefined;
  behavior: BehaviorType;

  setFilter: (filter: Filter) => void;
  setFilterInput: (filterInput: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;

  setStateModal: (state: boolean) => void;
  setSelectedWallpaperUri: (uri: string | undefined) => void;
  setBehavior: (behavior: BehaviorType) => void;

  reset: () => void;
}

const initialState: Omit<
  WallpaperState,
  | "setFilter"
  | "setFilterInput"
  | "setPage"
  | "setLimit"
  | "setStateModal"
  | "setSelectedWallpaperUri"
  | "setBehavior"
  | "reset"
> = {
  filter: "all",
  filterInput: "",
  page: 1,
  limit: 5,
  stateModalWallpaper: false,
  selectedWallpaperUri: undefined,
  behavior: "apply",
};

export const useWallpaperStore = create<WallpaperState>((set) => ({
  ...initialState,

  setBehavior: (behavior) =>
    set({
      behavior,
    }),

  setSelectedWallpaperUri: (selectedWallpaperUri) =>
    set({
      selectedWallpaperUri,
    }),

  setStateModal: (stateModalWallpaper) =>
    set({
      stateModalWallpaper,
    }),

  setFilter: (filter) =>
    set({
      filter,
      page: 1,
    }),

  setFilterInput: (filterInput) =>
    set({
      filterInput,
      page: 1,
    }),

  setPage: (page) =>
    set({
      page,
    }),

  setLimit: (limit) =>
    set({
      limit,
      page: 1,
    }),

  reset: () =>
    set({
      ...initialState,
    }),
}));
