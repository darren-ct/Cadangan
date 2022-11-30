import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import * as React from "react";

import { MagicTextIcon } from "@/assets/icons";
import type { Action, Draggable, Param } from "@/features/editor";
import {
  MagicContainer,
  MagicTextPopup,
  useMagicTextAction,
  useParamFieldsAction,
} from "@/features/editor";

interface Props {
  item: Draggable;
  action: Action;
  param: Param;
  onUpdate: (id: string, newAction: Action) => unknown;
  updatePageParams: (newParams: Param[]) => void;
}

export const ParamFields = React.memo(function ParamFields({
  param,
  item,
  action,
  onUpdate,
  updatePageParams,
}: Props) {
  const {
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
  } = useParamFieldsAction({ action, param, onUpdate, updatePageParams });

  const { actions } = useMagicTextAction(item);

  return (
    <Stack direction="row" alignItems="flex-start" spacing={1}>
      {/* Key */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          flex: 1,
          backgroundColor: "white",
          borderRadius: 1,
          border: "1px solid white",
        }}
      >
        <MagicContainer
          placeholder="Key"
          textContents={param.key}
          onAddClassicTextContent={onSelectKeyMagic}
          onClassicTextContentChange={onChangeKeyTextContent}
          onDeleteTextContent={onDeleteKeyTextContent}
        />
        <IconButton onClick={onOpenKeyPopover}>
          <MagicTextIcon />
        </IconButton>
        <MagicTextPopup
          actions={actions}
          anchorEl={keyAnchorEl}
          onClose={onCloseKeyPopover}
          onCloseAll={onCloseKeyPopover}
          onSelect={onSelectKeyMagic}
        />
      </Stack>

      {/* Value */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          flex: 1,
          backgroundColor: "white",
          borderRadius: 1,
          border: "1px solid white",
        }}
      >
        <MagicContainer
          placeholder="Value"
          textContents={param.value}
          onAddClassicTextContent={onSelectValueMagic}
          onClassicTextContentChange={onChangeValueTextContent}
          onDeleteTextContent={onDeleteValueTextContent}
        />
        <IconButton onClick={onOpenValuePopover}>
          <MagicTextIcon />
        </IconButton>
        <MagicTextPopup
          actions={actions}
          anchorEl={valueAnchorEl}
          onClose={onCloseValuePopover}
          onCloseAll={onCloseValuePopover}
          onSelect={onSelectValueMagic}
        />
      </Stack>
    </Stack>
  );
});
