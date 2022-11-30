import * as React from "react";

import type {
  Action,
  Draggable,
  DraggablePropsWithActions,
  EditorPage,
  NavLink,
} from "../..";
import {
  useActionsData,
  useEditorDraggableStore,
  useEditorPageStore,
  UseEditorPageStoreState,
} from "../..";

interface Props {
  item: Draggable | EditorPage | NavLink;
  updateNavLinkProps?: (name: string, body: unknown) => void;
}

export const useDraggableAction = ({ item, updateNavLinkProps }: Props) => {
  const { updateDraggableProps } = useEditorDraggableStore();
  const { pages, setPages, activePage } =
    useEditorPageStore() as UseEditorPageStoreState;
  const { memoizedActionLocation } = useActionsData();

  const currentProps = React.useMemo(() => {
    if (memoizedActionLocation !== "NAVLINK") {
      return (item as NavLink).subProps;
    }

    return (item as Draggable | EditorPage).props as DraggablePropsWithActions;
  }, [item, memoizedActionLocation]);

  const currentActions = React.useMemo(() => {
    let rawActions: Action[];

    // Actions Value
    switch (memoizedActionLocation) {
      case "PAGE":
      case "PROP":
        rawActions = (
          (item as EditorPage | Draggable)?.props as DraggablePropsWithActions
        )?.actions;
        break;

      case "NAVLINK":
        rawActions = (item as NavLink).actions;
        break;
    }

    return rawActions ?? [];
  }, [item, memoizedActionLocation]);

  // UPDATE ACTIONS
  const updatePropActions = React.useCallback(
    (newActions: Action[]) => {
      if (memoizedActionLocation === "PROP") {
        return updateDraggableProps(
          item?.id,
          "actions",
          newActions as Partial<DraggablePropsWithActions>
        );
      }

      const newPages = pages.map((page) => {
        if (page.id === activePage) {
          return { ...page, props: { ...page.props, actions: newActions } };
        } else {
          return page;
        }
      });

      return setPages(newPages);
    },
    [
      activePage,
      item?.id,
      memoizedActionLocation,
      pages,
      setPages,
      updateDraggableProps,
    ]
  );

  const updateNavLinksActions = React.useCallback(
    (newActions: Action[]) => {
      updateNavLinkProps("action", newActions);
    },
    [updateNavLinkProps]
  );

  const updateActionsPerLocation = React.useCallback(
    (newActions: Action[]) => {
      switch (memoizedActionLocation) {
        case "PAGE":
        case "PROP":
          updatePropActions(newActions);
          break;

        case "NAVLINK":
          return updateNavLinksActions(newActions);
          break;
      }
    },
    [memoizedActionLocation, updateNavLinksActions, updatePropActions]
  );

  // ACTION HANDLER
  const handleActionSelect = React.useCallback(
    (action: Action) => {
      let newActions = currentActions;

      newActions = [...newActions, action];

      updateActionsPerLocation(newActions);
    },
    [currentActions, updateActionsPerLocation]
  );

  const handleActionUpdate = React.useCallback(
    (id: string, action: Action) => {
      const newActions = currentActions;

      const findIndex = currentActions.findIndex((item) => item.id === id);

      if (findIndex < 0) return;

      newActions[findIndex] = action;

      updateActionsPerLocation(newActions);
    },
    [currentActions, updateActionsPerLocation]
  );

  const handleActionDelete = React.useCallback(
    (id: string) => {
      const newActions = currentActions;

      const findIndex = currentActions.findIndex((item) => item.id === id);

      if (findIndex < 0) return;

      newActions.splice(findIndex, 1);

      updateActionsPerLocation(newActions);
    },
    [currentActions, updateActionsPerLocation]
  );

  return {
    handleActionDelete,
    handleActionSelect,
    handleActionUpdate,
    currentProps,
  };
};
