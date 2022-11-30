import * as React from "react";

import type {
  Breakpoints,
  Cols,
  DefaultLayouts,
  Draggable,
  LayoutItem,
  TabContainerProps,
  TabLink,
} from "@/features/editor";
import {
  dummyContainerLayout,
  useEditorDraggableStore,
} from "@/features/editor";
import { useDisclose } from "@/hooks";

export const useTabContainerView = (item: Draggable) => {
  const {
    isOpen: isShowGridHelper,
    onClose: onShowGridHelperClose,
    onOpen: onShowGridHelperOpen,
  } = useDisclose();

  const {
    draggables,
    activeDraggable,
    activeId,
    setActiveId,
    updateDraggableProps,
    createDraggable,
  } = useEditorDraggableStore();

  const tabContainerProps = React.useMemo(() => {
    return item.props as TabContainerProps;
  }, [item.props]);

  const [clickedTabLinkId, setClickedTabLinkId] = React.useState<string>(
    tabContainerProps.tabLinks ? tabContainerProps.tabLinks[0].id : ""
  );

  const tabLinkDefaultLayouts: DefaultLayouts = React.useMemo(() => {
    return tabContainerProps.tabLinks?.find(
      (tabLink) => tabLink.id === clickedTabLinkId
    )?.defaultLayouts;
  }, [clickedTabLinkId, tabContainerProps.tabLinks]);

  // View
  const bps: Breakpoints = React.useMemo(
    () => ({
      sm: 768,
      xs: 400,
    }),
    []
  );

  const activeRow: number = React.useMemo(() => 16, []);

  const columns: Cols = React.useMemo(
    () => ({
      xs: 24,
      sm: 24,
    }),
    []
  );

  const lowestIndex: number | null = React.useMemo(() => {
    if (!tabLinkDefaultLayouts) {
      return 0;
    }

    return tabLinkDefaultLayouts["xs"]?.reduce(
      (depth: number, value: LayoutItem) => {
        if (value.y + value.h > depth) {
          return value.y;
        } else {
          return depth;
        }
      },
      0
    );
  }, [tabLinkDefaultLayouts]);

  // Functions
  const handleDrop = React.useCallback(
    (layout: LayoutItem[]) => {
      const newLayouts = {
        sm: layout,
        xs: layout,
      } as DefaultLayouts;

      createDraggable({ ...activeDraggable, containerId: clickedTabLinkId });

      const newTabLinks = (item.props as TabContainerProps).tabLinks?.map(
        (tabLink) => {
          if (tabLink.id === clickedTabLinkId) {
            return {
              ...tabLink,
              defaultLayouts: newLayouts,
            };
          } else {
            return tabLink;
          }
        }
      );

      updateDraggableProps(item.id, "tabLinks", newTabLinks);
      onShowGridHelperClose();
    },
    [
      activeDraggable,
      clickedTabLinkId,
      createDraggable,
      item.id,
      item.props,
      onShowGridHelperClose,
      updateDraggableProps,
    ]
  );

  const handleDragStart = React.useCallback(
    (
      _layout: LayoutItem[],
      oldItem: LayoutItem,
      _newItem: LayoutItem,
      _placeholder: LayoutItem,
      e: React.MouseEvent
    ) => {
      e.stopPropagation();
      setActiveId(oldItem.i);
      onShowGridHelperOpen();
    },
    [onShowGridHelperOpen, setActiveId]
  );

  const handleDragStop = React.useCallback(
    (layout: LayoutItem[]) => {
      const newLayouts = {
        sm: layout,
        xs: layout,
      } as DefaultLayouts;

      const newTabLinks = (item.props as TabContainerProps).tabLinks?.map(
        (tabLink) => {
          if (tabLink.id === clickedTabLinkId) {
            return {
              ...tabLink,
              defaultLayouts: newLayouts,
            };
          } else {
            return tabLink;
          }
        }
      );

      updateDraggableProps(item.id, "tabLinks", newTabLinks);
      setActiveId(null);
      onShowGridHelperClose();
    },
    [
      clickedTabLinkId,
      item.id,
      item.props,
      onShowGridHelperClose,
      setActiveId,
      updateDraggableProps,
    ]
  );

  const handleResizeStart = React.useCallback(
    (_layout: LayoutItem[], oldItem: LayoutItem) => {
      setActiveId(oldItem.i);
      onShowGridHelperOpen();
    },
    [onShowGridHelperOpen, setActiveId]
  );

  const handleResizeStop = React.useCallback(
    (layout: LayoutItem[]) => {
      const newLayouts = {
        sm: layout,
        xs: layout,
      } as DefaultLayouts;

      const newTabLinks = (item.props as TabContainerProps).tabLinks?.map(
        (tabLink) => {
          if (tabLink.id === clickedTabLinkId) {
            return {
              ...tabLink,
              defaultLayouts: newLayouts,
            };
          } else {
            return tabLink;
          }
        }
      );
      updateDraggableProps(item.id, "tabLinks", newTabLinks);
      setActiveId(null);
      onShowGridHelperClose();
    },
    [
      clickedTabLinkId,
      item.id,
      item.props,
      onShowGridHelperClose,
      setActiveId,
      updateDraggableProps,
    ]
  );

  const handleDraggableItemClick = React.useCallback(
    (item: Draggable) => {
      if (item.id === activeId) return;

      setActiveId(item.id);
      onShowGridHelperClose();
    },
    [activeId, setActiveId, onShowGridHelperClose]
  );

  const getColor = React.useCallback(
    (id: string) => {
      if (!activeId || id !== activeId) return "transparent";

      return "#42a5f5";
    },
    [activeId]
  );

  // UseEffects
  // give default dummy layout
  React.useEffect(() => {
    if (!tabLinkDefaultLayouts && clickedTabLinkId) {
      const newTabLinks = (item.props as TabContainerProps).tabLinks?.map(
        (tabLink) => {
          if (tabLink.id === clickedTabLinkId) {
            return {
              ...tabLink,
              defaultLayouts: {
                xs: [dummyContainerLayout],
                sm: [dummyContainerLayout],
              },
            };
          } else {
            return tabLink;
          }
        }
      );

      updateDraggableProps(item.id, "tabLinks", newTabLinks);
    }
  }, [
    tabLinkDefaultLayouts,
    item.id,
    updateDraggableProps,
    item.props,
    clickedTabLinkId,
  ]);

  // give default tabs
  React.useEffect(() => {
    if (!tabContainerProps.tabLinks) {
      const id = String(Date.now());

      const defaultTabLink: TabLink = {
        id,
        text: [
          {
            id: String(Date.now()),
            type: "CLASSIC",
            subProps: {
              text: "Tab 1",
            },
          },
        ],
        defaultLayouts: {
          xs: [dummyContainerLayout],
          sm: [dummyContainerLayout],
        },
      };

      updateDraggableProps(item.id, "tabLinks", [defaultTabLink]);
      setClickedTabLinkId(id);
    }
  }, [item.id, tabContainerProps.tabLinks, updateDraggableProps]);

  return {
    isShowGridHelper,
    draggables,
    activeDraggable,
    tabLinkDefaultLayouts,
    clickedTabLinkId,
    setClickedTabLinkId,
    activeRow,
    bps,
    columns,
    lowestIndex,
    handleDrop,
    handleDragStart,
    handleDragStop,
    handleResizeStart,
    handleResizeStop,
    handleDraggableItemClick,
    getColor,
  };
};
