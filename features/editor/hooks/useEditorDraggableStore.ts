import { useRouter } from "next/router";
import * as React from "react";

import { ExplorerParams } from "@/types";
import { FormSubmitButtonProps } from "@/widgets/types";

import {
  Action,
  ChartItemAxisProps,
  DefaultLayouts,
  Draggable,
  DraggablePropsWithActions,
  DraggableTypes,
  MenuLink,
  NavLink,
  TabLink,
  TextContent,
} from "../types";
import {
  SetStatePropType,
  SetStateType,
  useDraggableStore,
  UseDraggableStoreState,
} from "./useDraggableStore";

export const useEditorDraggableStore = () => {
  const router = useRouter();

  const { editorPageId } = router.query as ExplorerParams;

  const {
    defaultLayouts: rawDefaultLayouts,
    setDefaultLayouts: setRawDefaultLayouts,
    draggables: rawDraggables,
    activeDraggable,
    activeId,
    setActiveDraggable,
    setActiveId,
    setDraggables: rawSetDraggables,
    createDraggable: rawCreateDraggable,
    deleteDraggable: rawDeleteDraggable,
    updateDraggable: rawUpdateDraggable,
    updateDraggableProps: rawUpdateDraggableProps,
  } = useDraggableStore((state) => state as UseDraggableStoreState);

  // Layout
  const defaultLayouts = React.useMemo(() => {
    if (!rawDefaultLayouts[editorPageId] || !editorPageId)
      return {
        xs: [],
        sm: [],
      };

    return rawDefaultLayouts[editorPageId];
  }, [rawDefaultLayouts, editorPageId]);

  const setDefaultLayouts = React.useCallback(
    (callbackFn: (prev: DefaultLayouts) => DefaultLayouts) => {
      setRawDefaultLayouts(editorPageId, callbackFn);
    },
    [setRawDefaultLayouts, editorPageId]
  );

  // Draggable
  const draggables = React.useMemo(() => {
    if (!rawDraggables[editorPageId] || !editorPageId) return [];

    return rawDraggables[editorPageId];
  }, [rawDraggables, editorPageId]);

  const setDraggables = React.useCallback(
    (draggables: Draggable[] | SetStateType) =>
      rawSetDraggables(editorPageId, draggables),
    [rawSetDraggables, editorPageId]
  );

  const createDraggable = React.useCallback(
    (draggable: Draggable) => rawCreateDraggable(editorPageId, draggable),
    [rawCreateDraggable, editorPageId]
  );

  const deleteDraggable = React.useCallback(
    (id: string) => rawDeleteDraggable(editorPageId, id),
    [rawDeleteDraggable, editorPageId]
  );

  const updateDraggable = React.useCallback(
    (id: string, body: Partial<Draggable>) =>
      rawUpdateDraggable(editorPageId, id, body),
    [rawUpdateDraggable, editorPageId]
  );

  const updateDraggableProps = React.useCallback(
    (
      id: string,
      field: string | keyof DraggablePropsWithActions,
      body:
        | string
        | number
        | boolean
        | TextContent[]
        | Action[]
        | NavLink[]
        | MenuLink[]
        | TabLink[]
        | Partial<DraggablePropsWithActions>
        | FormSubmitButtonProps
        | ChartItemAxisProps
        | SetStatePropType
        | DefaultLayouts
        | Draggable[]
    ) => {
      rawUpdateDraggableProps(editorPageId, id, field, body);
    },
    [rawUpdateDraggableProps, editorPageId]
  );

  const findDraggableByType = React.useCallback(
    (type: DraggableTypes) => {
      return draggables.filter((item) => item.type === type);
    },
    [draggables]
  );

  return {
    defaultLayouts,
    draggables,
    activeDraggable,
    activeId,
    setActiveDraggable,
    setActiveId,
    setDefaultLayouts,
    setDraggables,
    createDraggable,
    deleteDraggable,
    updateDraggable,
    updateDraggableProps,
    findDraggableByType,
  };
};
