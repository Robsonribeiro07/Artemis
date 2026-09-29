import { create } from "zustand";

interface IStateAllWallpaperForCategory {
  isOpen: boolean;
  onClose: () => void;
  openCategory: (category: string) => void;
  limit: number;
  page: number;
  nextPage: () => void;
  setLimit: (limit: number) => void;
  category: string;
  subCategory: string;
  filterInput: string;
  setCategory: (category: string) => void;
  setSubCategory: (subCategory: string) => void;
  setFilterInput: (category: string) => void;
  reset: () => void;
}

const initialValues: Omit<
  IStateAllWallpaperForCategory,
  | "setLimit"
  | "nextPage"
  | "setCategory"
  | "onClose"
  | "reset"
  | "openCategory"
  | "setFilterInput"
  | "setSubCategory"
> = {
  limit: 20,
  page: 1,
  isOpen: false,
  category: "",
  filterInput: "",
  subCategory: "",
};

export const useAllWallpaperForCategoryStore =
  create<IStateAllWallpaperForCategory>((set, get) => ({
    ...initialValues,

    onClose: () =>
      set({
        isOpen: false,
        category: "",
      }),

    setCategory: (category) =>
      set({
        category,
        page: 1,
      }),
    setSubCategory: (subCategory) =>
      set({
        subCategory,
      }),

    nextPage: () =>
      set((state) => ({
        page: state.page + 1,
      })),
    setLimit: (limit) =>
      set({
        limit,
        page: 1,
      }),

    reset: () =>
      set({
        ...initialValues,
      }),
    openCategory: (category) =>
      set({
        category: category,
        isOpen: true,
      }),
    setFilterInput: (filter) =>
      set({
        filterInput: filter,
      }),
  }));
