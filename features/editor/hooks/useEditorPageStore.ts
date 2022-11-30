import create from "zustand";
import { persist } from "zustand/middleware";

import {
  Action,
  EditorPage,
  EditorPageProps,
  PageStylingProps,
  Param,
} from "../types";

export interface UseEditorPageStoreState {
  pages: EditorPage[];
  activePage: string | null;
  setPages?: (pages: EditorPage[]) => void;
  setActivePage?: (pageId: string) => void;
  createPage?: (page: EditorPage) => void;
  deletePage?: (id: string) => void;
  updatePage?: (id: string, body: Partial<EditorPage>) => void;
  updatePageProps?: (
    id: string,
    field: string,
    body: Partial<EditorPageProps> | Param[] | Action[] | PageStylingProps
  ) => void;
}

interface PartializedState {
  pages: EditorPage[];
}

export const useEditorPageStore = create(
  persist<UseEditorPageStoreState | PartializedState>(
    (set) => ({
      pages: [],
      activePage: null,
      setPages: (pages) => set(() => ({ pages })),
      setActivePage: (pageId) => set(() => ({ activePage: pageId })),
      createPage: (page) =>
        set((state) => {
          state.pages.push(page);

          return { pages: [...state.pages] };
        }),
      deletePage: (id) =>
        set((state) => {
          const index = state.pages.findIndex((item) => item.id === id);

          state.pages.splice(index, 1);

          return { pages: [...state.pages] };
        }),
      updatePage: (id, body) =>
        set((state) => {
          const newState = state.pages.map((item) => {
            if (item.id !== id) return item;

            return { ...item, ...body };
          });

          return { pages: newState };
        }),
      updatePageProps: (id, field, body) =>
        set((state) => {
          const newState = state.pages.map((item) => {
            if (item.id !== id) return item;

            const props = (item?.props ?? {}) as EditorPageProps;

            return { ...item, props: { ...props, [field]: body } };
          });

          return { pages: [...newState] };
        }),
    }),
    {
      name: "pages",
      partialize: (state) => ({
        pages: state.pages,
      }),
    }
  )
);
