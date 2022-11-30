import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { MagicTextIcon } from "@/assets/icons";
import type {
  ClassicSubProps,
  Draggable,
  TextContent,
  UserRecordFields,
} from "@/features/editor";
import { useMagicTextAction } from "@/features/editor";
import { usePopover } from "@/hooks";

import { MagicContainer, MagicTextPopup } from "../../../elements";

interface Props {
  item: Draggable;
  field: string;
  form: UserRecordFields | Partial<UserRecordFields>;
  setForm:
    | React.Dispatch<React.SetStateAction<UserRecordFields>>
    | React.Dispatch<React.SetStateAction<Partial<UserRecordFields>>>;
}

export const FormFields = React.memo(function FormFields({
  item,
  field,
  form,
  setForm,
}: Props) {
  // States
  const { anchorEl, onClosePopover, onOpenPopover } = usePopover();
  const { actions } = useMagicTextAction(item);

  // Functions
  const onAddTextContent = React.useCallback(
    (newContent: TextContent) => {
      setForm((prev) => ({ ...prev, [field]: [...prev[field], newContent] }));
    },

    [setForm, field]
  );

  const onDeleteTextContent = React.useCallback(
    (id: string) => {
      setForm((prev) => {
        // Form new TextContents
        const previousTextContents: TextContent[] = form[field];
        const toBeRemovedId = previousTextContents.findIndex(
          (textContent) => textContent.id === id
        );

        previousTextContents.splice(toBeRemovedId, 1);

        // Insert new Values
        return { ...prev, [field]: previousTextContents };
      });
    },
    [field, form, setForm]
  );

  const onClassicTextContentChange = React.useCallback(
    (newText: string | number, id: string) => {
      setForm((prev) => {
        // Form new TextContents
        const previousTextContents: TextContent[] = form[field];
        const toBeEditedId = previousTextContents.findIndex(
          (textContent) => textContent.id === id
        );

        previousTextContents[toBeEditedId] = {
          ...previousTextContents[toBeEditedId],
          subProps: {
            text: newText,
          } as ClassicSubProps,
        };

        // Insert new Values
        return { ...prev, [field]: previousTextContents };
      });
    },
    [field, form, setForm]
  );

  return (
    <Stack direction="column">
      <Typography sx={{ fontSize: "12px" }}>{field}</Typography>
      <Stack direction="row" alignItems="center" bgcolor="white">
        <MagicContainer
          textContents={form ? form[field] : []}
          onAddClassicTextContent={onAddTextContent}
          onDeleteTextContent={onDeleteTextContent}
          onClassicTextContentChange={onClassicTextContentChange}
        />
        <IconButton onClick={onOpenPopover} size="small">
          <MagicTextIcon sx={{ fontSize: "18px" }} />
        </IconButton>
        <MagicTextPopup
          anchorEl={anchorEl}
          onClose={onClosePopover}
          onCloseAll={onClosePopover}
          actions={actions}
          onSelect={onAddTextContent}
        />
      </Stack>
    </Stack>
  );
});
