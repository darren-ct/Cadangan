import * as React from "react";

import { useEditorPageStore, UseEditorPageStoreState } from "@/features/editor";
import { useDisclose } from "@/hooks";

import { Action, EditorPage, LinkActionProps, Param } from "../../../types";

interface Props {
  action: Action;
  handleActionUpdate: (id: string, action: Action) => void;
}

export const useDraggableLinkAction = ({
  action,
  handleActionUpdate,
}: Props) => {
  // Hooks
  const { pages, updatePageProps } =
    useEditorPageStore() as UseEditorPageStoreState;

  const { isOpen, onToggle } = useDisclose();

  const { isOpen: isAdvancedOpen, onToggle: onIsAdvancedToggle } =
    useDisclose();

  const { isOpen: isParamsOpen, onToggle: onParamsToggle } = useDisclose();

  // States
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const [websiteUrl, setWebsiteUrl] = React.useState<string>(
    (action?.props as LinkActionProps)?.url
  );

  // Memos
  const targetPageId = React.useMemo(() => {
    return (action?.props as LinkActionProps)?.page?.id ?? "";
  }, [action?.props]);

  const memoizedPage: EditorPage = React.useMemo(() => {
    return pages.find((page) => page.id === targetPageId);
  }, [pages, targetPageId]);

  // Functions
  const updatePageParams = React.useCallback(
    (newParams: Param[]) => {
      updatePageProps(targetPageId, "params", newParams);
    },
    [targetPageId, updatePageProps]
  );

  const handleOpenPopup = React.useCallback((anchorEl: HTMLElement) => {
    setAnchorEl(anchorEl);
  }, []);

  const handleClosePopup = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleWebsiteChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = React.useCallback((e) => {
    setWebsiteUrl(e.target.value);
  }, []);

  const handleWebsiteKeyDown:
    | React.KeyboardEventHandler<HTMLDivElement>
    | React.MouseEventHandler<HTMLButtonElement> = React.useCallback(
    (
      e:
        | React.MouseEvent<HTMLButtonElement>
        | React.KeyboardEvent<HTMLDivElement>
    ) => {
      if (
        (e as React.KeyboardEvent<HTMLDivElement>).key !== "Enter" &&
        (e as React.KeyboardEvent<HTMLDivElement>).key
      )
        return;

      const newAction: Action = {
        ...action,
        props: { ...action?.props, url: websiteUrl },
      };
      handleActionUpdate(action.id, newAction);
      onToggle();
    },
    [action, websiteUrl, handleActionUpdate, onToggle]
  );

  const handleAdvancedToggle = React.useCallback(
    (value: string) => {
      const newAction: Action = {
        ...action,
        isAdvanced: value === "true" ? true : false,
        advancedProps: undefined,
      };
      handleActionUpdate(action.id, newAction);
    },
    [action, handleActionUpdate]
  );

  const handleAddParam = React.useCallback(() => {
    const newParam: Param = { id: String(Date.now()), key: [], value: [] };

    handleActionUpdate(action.id, {
      ...action,
      params: action.params ? [...action.params, newParam] : [newParam],
    });

    // Update Page as Well
    updatePageParams([...(memoizedPage?.props?.params ?? []), newParam]);
  }, [
    action,
    handleActionUpdate,
    memoizedPage?.props?.params,
    updatePageParams,
  ]);

  return {
    anchorEl,
    isOpen,
    isAdvancedOpen,
    isParamsOpen,
    onToggle,
    onParamsToggle,
    handleOpenPopup,
    handleClosePopup,
    websiteUrl,
    updatePageParams,
    handleAddParam,
    handleWebsiteChange,
    handleWebsiteKeyDown,
    handleAdvancedToggle,
    onIsAdvancedToggle,
  };
};
