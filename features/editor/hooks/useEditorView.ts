import { useRouter } from "next/router";
import * as React from "react";

import type {
  Breakpoints,
  DefaultLayouts,
  Draggable,
  DraggableProps,
  DraggableTypes,
  EditorPage,
  LayoutItem,
} from "@/features/editor";
import { dummyLayout } from "@/features/editor";
import { getCookie } from "@/utils/cookie";
import { useDisclose } from "@/widgets/hooks";

import { useEditorDraggableStore } from "./useEditorDraggableStore";
import {
  useEditorPageStore,
  UseEditorPageStoreState,
} from "./useEditorPageStore";
import { useFixedLayout } from "./useFixedLayout";

export const useEditorView = () => {
  const {
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
  } = useEditorDraggableStore();

  const { pages, createPage, activePage } =
    useEditorPageStore() as UseEditorPageStoreState;

  const { handleFixedDrop, handleFixedDragStop } = useFixedLayout();

  const {
    isOpen: isShowPreviewModal,
    onClose: onClosePreviewModal,
    onOpen: onOpenPreviewModal,
  } = useDisclose();

  const {
    isOpen: isShowGridHelper,
    onClose: onShowGridHelperClose,
    onOpen: onShowGridHelperOpen,
  } = useDisclose();

  const pageHeight = React.useMemo(() => {
    return (
      pages.find((page) => page.id === activePage)?.props?.stylingProps
        ?.height ?? 540
    );
  }, [activePage, pages]);

  // layout-related
  const [activeBreakpoint, setActiveBreakpoint] = React.useState<string>("sm");

  const bps: Breakpoints = React.useMemo(
    () => ({
      sm: 768,
      xs: 400,
    }),
    []
  );

  const defItemW: number = React.useMemo(() => {
    switch (activeDraggable?.type) {
      case "button":
        return 2;

      case "text":
        return 6;

      case "textInput":
        return 6;

      case "nav":
        return 24;

      case "form":
        return 6;

      case "table":
        return 12;

      case "sideMenu":
        return 6;

      case "container":
      case "tabContainer":
        return 16;

      default:
        return 12;
    }
  }, [activeDraggable]);

  const defItemH: number = React.useMemo(() => {
    switch (activeDraggable?.type) {
      case "button":
        return 2;

      case "text":
        return 2;

      case "textInput":
        return 3;

      case "nav":
        return 3;

      case "form":
        return 14;

      case "sideMenu":
        return 32;

      case "container":
      case "tabContainer":
        return 16;

      default:
        return 12;
    }
  }, [activeDraggable]);

  const lowestIndex: number | null = React.useMemo(() => {
    return defaultLayouts[activeBreakpoint].reduce(
      (depth: number, value: LayoutItem) => {
        if (value.y + value.h > depth) {
          return value.y;
        } else {
          return depth;
        }
      },
      0
    );
  }, [defaultLayouts, activeBreakpoint]);

  // Other Functions
  const getColor = React.useCallback(
    (id: string) => {
      if (!activeId || id !== activeId) return "transparent";

      return "#42a5f5";
    },
    [activeId]
  );

  const findSameType = React.useCallback(
    (type: DraggableTypes) => {
      if (!draggables) return [];

      return draggables.filter((item) => item.type === type);
    },
    [draggables]
  );

  const deleteLayout = React.useCallback(
    (layoutId: string) => {
      setDefaultLayouts((prev) => {
        return {
          xs: prev.xs.filter((layout) => layout.i !== layoutId),
          sm: prev.sm.filter((layout) => layout.i !== layoutId),
        };
      });
    },
    [setDefaultLayouts]
  );

  // Handler Functions
  const handleDrop = React.useCallback(
    (layout: LayoutItem[]) => {
      console.log("Dropped Main");
      const fixedLayouts = handleFixedDrop(activeDraggable.type, layout);

      setDefaultLayouts(() => fixedLayouts);
      createDraggable(activeDraggable);
      onShowGridHelperClose();
    },
    [
      activeDraggable,
      createDraggable,
      handleFixedDrop,
      onShowGridHelperClose,
      setDefaultLayouts,
    ]
  );

  const handleDragStart = React.useCallback(
    (_layout: LayoutItem[], oldItem: LayoutItem) => {
      console.log("Dragged Main");
      setActiveId(oldItem.i);
      onShowGridHelperOpen();
    },
    [onShowGridHelperOpen, setActiveId]
  );

  const handleDragStop = React.useCallback(
    (layout: LayoutItem[]) => {
      const fixedLayouts = handleFixedDragStop(layout);

      setActiveId(null);
      onShowGridHelperClose();
      setDefaultLayouts(() => fixedLayouts);
    },
    [handleFixedDragStop, onShowGridHelperClose, setActiveId, setDefaultLayouts]
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
      const fixedLayouts = handleFixedDragStop(layout);

      setActiveId(null);
      onShowGridHelperClose();
      setDefaultLayouts(() => fixedLayouts);
    },
    [handleFixedDragStop, onShowGridHelperClose, setActiveId, setDefaultLayouts]
  );

  const handleBreakpointChange = React.useCallback((newBp: string) => {
    setActiveBreakpoint(newBp);
    // setActiveColumns(newcols);
  }, []);

  const handleRemoveDraggable = React.useCallback(() => {
    // Remove all child of that id too
    deleteDraggable(activeId);
    deleteLayout(activeId);
    setActiveId(null);
    onShowGridHelperClose();
  }, [
    activeId,
    setActiveId,
    deleteDraggable,
    deleteLayout,
    onShowGridHelperClose,
  ]);

  const handleDraggableItemClick = React.useCallback(
    (item: Draggable) => {
      onShowGridHelperClose();
      if (item.id === activeId) return;

      setActiveId(item.id);
    },
    [activeId, setActiveId, onShowGridHelperClose]
  );

  const handleDraggableKeyDown: React.KeyboardEventHandler<HTMLDivElement> =
    React.useCallback(
      (e) => {
        if (e.key === "Escape") {
          setActiveId(null);
          onShowGridHelperClose();
        }

        if (e.key === "Delete") {
          handleRemoveDraggable();
        }
      },
      [onShowGridHelperClose, setActiveId, handleRemoveDraggable]
    );

  const handleActiveDraggableChange = React.useCallback(
    (e: React.DragEvent<HTMLElement>, type: DraggableTypes) => {
      const id =
        type === "nav"
          ? `nav-${String(Date.now())}`
          : type === "sideMenu"
          ? `side-${String(Date.now())}`
          : String(Date.now());

      const sameTypeLength = findSameType(type).length;
      const name = `${type} ${sameTypeLength + 1}`;

      let props = {} as DraggableProps;

      if (type === "chart") {
        props = {
          type: "bar",
        };
      }

      setActiveDraggable({
        id,
        type,
        name,
        props,
      });
      return e.dataTransfer.setData("text/plain", "");
    },
    [setActiveDraggable, findSameType]
  );

  // Extra
  const router = useRouter();
  const { editorPageId, databaseId } = router.query;
  const projectId = getCookie("__pjid") ?? "";

  const navigateToPreview = React.useCallback(
    (type: string) => {
      const isInIframe = window.self !== window.top;
      if (isInIframe) {
        const url = document.referrer;
        window.open(
          `${url}projects/${projectId}/builder/preview/${
            type === "per-page" ? editorPageId : pages[0].id
          }`
        );
      } else {
        window.open(
          `/databases/${databaseId}/preview/${
            type === "per-page" ? editorPageId : pages[0].id
          }`
        );
      }
    },
    [databaseId, editorPageId, pages, projectId]
  );

  // UseEffects
  React.useEffect(() => {
    if (!pages || pages?.length === 0) {
      const newPage: EditorPage = {
        id: editorPageId as string,
        name: "Page 1",
        props: {
          actions: [],
          params: [],
          stylingProps: {
            height: 540,
            backgroundColor: "white",
            maxWidth: 1040,
          },
        },
      };

      createPage(newPage);
    }
  }, [createPage, editorPageId, pages]);

  const produceBaseLayout = React.useCallback(() => {
    return (prev: DefaultLayouts) => {
      if (!prev || prev.xs.length === 0) {
        return {
          xs: [dummyLayout],
          sm: [dummyLayout],
        };
      }

      return prev;
    };
  }, []);

  React.useEffect(() => {
    setDefaultLayouts(produceBaseLayout());
  }, [produceBaseLayout, setDefaultLayouts]);

  return {
    activeBreakpoint,
    activeDraggable,
    activeId,
    bps,
    defItemW,
    defItemH,
    lowestIndex,
    getColor,
    deleteDraggable,
    deleteLayout,
    draggables,
    defaultLayouts,
    isShowGridHelper,
    onShowGridHelperClose,
    handleActiveDraggableChange,
    handleBreakpointChange,
    handleDrop,
    handleDraggableItemClick,
    handleDraggableKeyDown,
    handleDragStart,
    handleDragStop,
    handleRemoveDraggable,
    handleResizeStart,
    handleResizeStop,
    setActiveId,
    setDefaultLayouts,
    setDraggables,
    navigateToPreview,
    isShowPreviewModal,
    onClosePreviewModal,
    onOpenPreviewModal,
    pageHeight,
  };
};
