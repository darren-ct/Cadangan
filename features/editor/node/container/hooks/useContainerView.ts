import * as React from "react";

import type {
  Breakpoints,
  Cols,
  ContainerProps,
  DefaultLayouts,
  Draggable,
  LayoutItem,
} from "@/features/editor";
import {
  dummyContainerLayout,
  useEditorDraggableStore,
} from "@/features/editor";
import { useDisclose } from "@/hooks";

export const useContainerView = (item: Draggable) => {
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

  //   Memos
  //  Props
  const containerProps = React.useMemo(() => {
    return item.props as ContainerProps;
  }, [item.props]);

  const containerDefaultLayouts: DefaultLayouts = React.useMemo(() => {
    return containerProps?.defaultLayouts;
  }, [containerProps?.defaultLayouts]);

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
      xs: 6,
      sm: 6,
    }),
    []
  );

  const lowestIndex: number | null = React.useMemo(() => {
    if (!containerDefaultLayouts) {
      return 0;
    }

    return containerDefaultLayouts["xs"].reduce(
      (depth: number, value: LayoutItem) => {
        if (value.y + value.h > depth) {
          return value.y;
        } else {
          return depth;
        }
      },
      0
    );
  }, [containerDefaultLayouts]);

  // Functions
  const produceBaseLayout = React.useCallback(() => {
    return (prev: DefaultLayouts) => {
      if (!prev || prev.xs.length === 0) {
        return {
          xs: [dummyContainerLayout],
          sm: [dummyContainerLayout],
        };
      }

      return prev;
    };
  }, []);

  const handleDrop = React.useCallback(
    (layout: LayoutItem[]) => {
      const newLayouts = {
        sm: layout,
        xs: layout,
      } as DefaultLayouts;

      createDraggable({ ...activeDraggable, containerId: item.id });

      updateDraggableProps(item.id, "defaultLayouts", newLayouts);
      onShowGridHelperClose();
    },
    [
      activeDraggable,
      createDraggable,
      item.id,
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

      updateDraggableProps(item.id, "defaultLayouts", newLayouts);
      setActiveId(null);
      onShowGridHelperClose();
    },
    [item.id, onShowGridHelperClose, setActiveId, updateDraggableProps]
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

      updateDraggableProps(item.id, "defaultLayouts", newLayouts);
      setActiveId(null);
      onShowGridHelperClose();
    },
    [item.id, onShowGridHelperClose, setActiveId, updateDraggableProps]
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

  // useEffects
  React.useEffect(() => {
    if (!containerDefaultLayouts) {
      updateDraggableProps(
        item.id,
        "defaultLayouts",
        produceBaseLayout() as unknown as DefaultLayouts
      );
    }
  }, [
    containerDefaultLayouts,
    item.id,
    produceBaseLayout,
    updateDraggableProps,
  ]);

  return {
    isShowGridHelper,
    draggables,
    activeDraggable,
    containerDefaultLayouts,
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
