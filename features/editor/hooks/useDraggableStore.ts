import create, { StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

import { FormSubmitButtonProps } from "@/widgets/types";

import {
  Action,
  ChartItemAxisProps,
  DefaultLayouts,
  Draggable,
  DraggablePropsWithActions,
  MenuLink,
  NavLink,
  TabLink,
  TextContent,
} from "../types";

export type SetStateType = (prev: Draggable[]) => Draggable[];
export type SetStatePropType = (
  prev:
    | string
    | number
    | boolean
    | TextContent[]
    | Action[]
    | FormSubmitButtonProps
    | Partial<DraggablePropsWithActions>
    | ChartItemAxisProps
    | MenuLink[]
    | NavLink[]
    | TabLink[]
) =>
  | string
  | number
  | boolean
  | TextContent[]
  | Action[]
  | FormSubmitButtonProps
  | Partial<DraggablePropsWithActions>
  | ChartItemAxisProps
  | MenuLink[]
  | NavLink[]
  | TabLink[];

export interface UseDraggableStoreState {
  draggables: Record<string, Draggable[]>;
  setDraggables: (
    pageId: string,
    draggables: Draggable[] | SetStateType
  ) => void;
  createDraggable: (pageId: string, draggable: Draggable) => void;
  deleteDraggable: (pageId: string, id: string) => void;
  clearDraggables: (pageId: string) => void;
  updateDraggable: (
    pageId: string,
    id: string,
    body: Partial<Draggable>
  ) => void;
  updateDraggableProps: (
    pageId: string,
    id: string,
    field: string,
    body:
      | string
      | number
      | boolean
      | TextContent[]
      | Action[]
      | MenuLink[]
      | NavLink[]
      | TabLink[]
      | FormSubmitButtonProps
      | Partial<DraggablePropsWithActions>
      | ChartItemAxisProps
      | SetStatePropType
      | DefaultLayouts
      | Draggable[]
  ) => void;
  activeDraggable: Draggable | null;
  setActiveDraggable: (activeDraggable: Draggable) => void;
  defaultLayouts: Record<string, DefaultLayouts>;
  setDefaultLayouts: (
    pageId: string,
    callbackFn: (prev: DefaultLayouts) => DefaultLayouts
  ) => void;
  clearDefaultLayouts: (pageId: string) => void;
  activeId: string | null;
  setActiveId: (activeId: string | null) => void;
}

interface PartializedState {
  defaultLayouts: Record<string, DefaultLayouts>;
  draggables: Record<string, Draggable[]>;
}

export const useDraggableStore = create<
  UseDraggableStoreState | PartializedState
>(
  (
    persist as unknown as (
      config: StateCreator<UseDraggableStoreState | PartializedState>,
      options: PersistOptions<UseDraggableStoreState | PartializedState>
    ) => StateCreator<UseDraggableStoreState | PartializedState>
  )(
    (set) => ({
      draggables: {},
      setDraggables: (pageId, draggables) =>
        set((state) => {
          if (!state.draggables[pageId]) {
            state.draggables[pageId] = [];
          }

          if (typeof draggables !== "function")
            return {
              draggables: { ...state.draggables, [pageId]: draggables },
            };

          const newDraggables = draggables(state.draggables[pageId]);

          return {
            draggables: { ...state.draggables, [pageId]: newDraggables },
          };
        }),
      createDraggable: (pageId, draggable) =>
        set((state) => {
          if (!state.draggables[pageId]) {
            state.draggables[pageId] = [];
          }
          state.draggables[pageId].push(draggable);

          return { draggables: { ...state.draggables } };
        }),
      deleteDraggable: (pageId, id) =>
        set((state) => {
          if (!state.draggables[pageId]) {
            state.draggables[pageId] = [];
          }
          const index = state.draggables[pageId].findIndex(
            (item) => item.id === id
          );

          const newDraggables = [...state.draggables[pageId]];
          newDraggables.splice(index, 1);
          return {
            draggables: { ...state.draggables, [pageId]: newDraggables },
          };
        }),
      clearDraggables: (pageId) =>
        set((state) => {
          return { draggables: { ...state.draggables, [pageId]: undefined } };
        }),
      updateDraggable: (pageId, id, body) =>
        set((state) => {
          if (!state.draggables[pageId]) {
            state.draggables[pageId] = [];
          }

          const newState = state.draggables[pageId].map((item) => {
            if (item.id !== id) return item;

            return { ...item, ...body };
          });

          return {
            draggables: { ...state.draggables, [pageId]: newState },
          };
        }),
      updateDraggableProps: (pageId, id, field, body) =>
        set((state) => {
          if (!state.draggables[pageId]) {
            state.draggables[pageId] = [];
          }

          let newState: Draggable[];

          // New
          if (typeof body === "function") {
            const newBody = body(
              state.draggables[pageId]?.find((draggable) => draggable.id === id)
                .props[field]
            );

            newState = state.draggables[pageId].map((item) => {
              if (item.id !== id) return item;

              const props = (item?.props ?? {}) as DraggablePropsWithActions;

              return { ...item, props: { ...props, [field]: newBody } };
            });
          } else {
            newState = state.draggables[pageId].map((item) => {
              if (item.id !== id) return item;

              const props = (item?.props ?? {}) as DraggablePropsWithActions;

              return { ...item, props: { ...props, [field]: body } };
            });
          }

          return {
            draggables: { ...state.draggables, [pageId]: newState },
          };
        }),
      activeDraggable: null,
      setActiveDraggable: (activeDraggable) => set(() => ({ activeDraggable })),
      defaultLayouts: {},
      setDefaultLayouts: (pageId, callbackFn) =>
        set((state) => {
          return {
            defaultLayouts: {
              ...state.defaultLayouts,
              [pageId]: callbackFn(state.defaultLayouts[pageId]),
            },
          };
        }),
      clearDefaultLayouts: (pageId) =>
        set((state) => {
          return {
            defaultLayouts: {
              ...state.defaultLayouts,
              [pageId]: undefined,
            },
          };
        }),
      activeId: null,
      setActiveId: (activeId) => set(() => ({ activeId })),
    }),
    {
      name: "editorPageData",
      partialize: (state) => ({
        draggables: state.draggables,
        defaultLayouts: state.defaultLayouts,
      }),
    }
  )
);
