import * as React from "react";

import {
  useEditorPageStore,
  UseEditorPageStoreState,
  useSubMenuAction,
} from "@/features/editor";
import { useDisclose, usePopover } from "@/hooks";

import { Action, EditorPage } from "../types";

interface Props {
  page: EditorPage;
}

export const useEditPageTab = ({ page }: Props) => {
  const pageProps = React.useMemo(() => {
    return page?.props;
  }, [page?.props]);

  //   Hooks
  const { pages, setPages } = useEditorPageStore() as UseEditorPageStoreState;
  const { actions: subMenuActions } = useSubMenuAction(page);

  const { isOpen: isComponentsOpen, onToggle: onComponentsToggle } =
    useDisclose();

  const { isOpen: isActionsOpen, onToggle: onActionsToggle } = useDisclose();

  const {
    anchorEl: actionsAnchorEl,
    onOpenPopover: onOpenActionsPopOver,
    onClosePopover: onCloseActionsPopOver,
  } = usePopover();

  const { isOpen: isStylesOpen, onToggle: onStylesToggle } = useDisclose();

  //   Memos
  const pageActions = React.useMemo(() => {
    return pageProps?.actions ?? [];
  }, [pageProps?.actions]);

  //   Callback
  const handleActionSelect = React.useCallback(
    (action: Action) => {
      const newPages = pages.map((pageItem) => {
        if (pageItem.id === page.id) {
          return {
            ...pageItem,
            props: {
              ...pageItem?.props,
              actions: [...(pageProps?.actions ?? []), action],
            },
          };
        } else {
          return pageItem;
        }
      });

      setPages(newPages);
    },
    [page.id, pageProps?.actions, pages, setPages]
  );

  return {
    pageActions,
    isComponentsOpen,
    onComponentsToggle,
    isActionsOpen,
    onActionsToggle,
    subMenuActions,
    actionsAnchorEl,
    onOpenActionsPopOver,
    onCloseActionsPopOver,
    handleActionSelect,
    isStylesOpen,
    onStylesToggle,
  };
};
