import * as React from "react";

import type { Action, Param, TextContent } from "@/features/editor";
import { usePopover } from "@/hooks";

interface Props {
  param: Param;
  action: Action;
  onUpdate: (id: string, newAction: Action) => unknown;
  updatePageParams: (newParams: Param[]) => void;
}

export const useParamFieldsAction = ({
  param,
  action,
  onUpdate,
  updatePageParams,
}: Props) => {
  // Update Page Props
  // Keys
  const {
    anchorEl: keyAnchorEl,
    onClosePopover: onCloseKeyPopover,
    onOpenPopover: onOpenKeyPopover,
  } = usePopover();

  const onSelectKeyMagic = React.useCallback(
    (newTextContent: TextContent | Record<string, unknown>) => {
      const newParams = action.params.map((paramItem) => {
        if (paramItem.id === param.id) {
          return {
            ...paramItem,
            key: [...paramItem.key, newTextContent as TextContent],
          };
        } else {
          return paramItem;
        }
      });

      onUpdate(action.id, { ...action, params: newParams });
      updatePageParams(newParams);
    },
    [action, onUpdate, param.id, updatePageParams]
  );

  const onDeleteKeyTextContent = React.useCallback(
    (id: string) => {
      // Update Text Content
      const currentTextContents = [...param.key];
      const toBeRemovedIndex = currentTextContents.findIndex(
        (content) => content.id === id
      );

      currentTextContents.splice(toBeRemovedIndex, 1);

      // Update Params Arr.
      const newParams = action.params.map((paramItem) => {
        if (paramItem.id === param.id) {
          return {
            ...paramItem,
            key: currentTextContents,
          };
        } else {
          return paramItem;
        }
      });

      onUpdate(action.id, { ...action, params: newParams });
      updatePageParams(newParams);
    },
    [action, onUpdate, param.id, param.key, updatePageParams]
  );

  const onChangeKeyTextContent = React.useCallback(
    (newText: string | number, id: string) => {
      // Update Text Content
      const currentTextContents = [...param.key];
      const toBeChangedIndex = currentTextContents.findIndex(
        (content) => content.id === id
      );

      currentTextContents[toBeChangedIndex] = {
        ...currentTextContents[toBeChangedIndex],
        subProps: {
          text: newText,
        },
      };

      // Update Params Arr.
      const newParams = action.params.map((paramItem) => {
        if (paramItem.id === param.id) {
          return {
            ...paramItem,
            key: currentTextContents,
          };
        } else {
          return paramItem;
        }
      });

      onUpdate(action.id, { ...action, params: newParams });
      updatePageParams(newParams);
    },
    [action, onUpdate, param.id, param.key, updatePageParams]
  );

  //   Values
  const {
    anchorEl: valueAnchorEl,
    onClosePopover: onCloseValuePopover,
    onOpenPopover: onOpenValuePopover,
  } = usePopover();

  const onSelectValueMagic = React.useCallback(
    (newTextContent: TextContent | Record<string, unknown>) => {
      const newParams = action.params.map((paramItem) => {
        if (paramItem.id === param.id) {
          return {
            ...paramItem,
            value: [...paramItem.value, newTextContent as TextContent],
          };
        } else {
          return paramItem;
        }
      });

      onUpdate(action.id, { ...action, params: newParams });
      updatePageParams(newParams);
    },
    [action, onUpdate, param.id, updatePageParams]
  );

  const onDeleteValueTextContent = React.useCallback(
    (id: string) => {
      // Update Text Content
      const currentTextContents = [...param.value];
      const toBeRemovedIndex = currentTextContents.findIndex(
        (content) => content.id === id
      );

      currentTextContents.splice(toBeRemovedIndex, 1);

      // Update Params Arr.
      const newParams = action.params.map((paramItem) => {
        if (paramItem.id === param.id) {
          return {
            ...paramItem,
            value: currentTextContents,
          };
        } else {
          return paramItem;
        }
      });

      onUpdate(action.id, { ...action, params: newParams });
      updatePageParams(newParams);
    },
    [action, onUpdate, param.id, param.value, updatePageParams]
  );

  const onChangeValueTextContent = React.useCallback(
    (newText: string | number, id: string) => {
      // Update Text Content
      const currentTextContents = [...param.value];
      const toBeChangedIndex = currentTextContents.findIndex(
        (content) => content.id === id
      );

      currentTextContents[toBeChangedIndex] = {
        ...currentTextContents[toBeChangedIndex],
        subProps: {
          text: newText,
        },
      };

      // Update Params Arr.
      const newParams = action.params.map((paramItem) => {
        if (paramItem.id === param.id) {
          return {
            ...paramItem,
            value: currentTextContents,
          };
        } else {
          return paramItem;
        }
      });

      onUpdate(action.id, { ...action, params: newParams });
      updatePageParams(newParams);
    },
    [action, onUpdate, param.id, param.value, updatePageParams]
  );

  return {
    keyAnchorEl,
    onCloseKeyPopover,
    onOpenKeyPopover,
    onSelectKeyMagic,
    onDeleteKeyTextContent,
    onChangeKeyTextContent,
    valueAnchorEl,
    onCloseValuePopover,
    onOpenValuePopover,
    onSelectValueMagic,
    onDeleteValueTextContent,
    onChangeValueTextContent,
  };
};
