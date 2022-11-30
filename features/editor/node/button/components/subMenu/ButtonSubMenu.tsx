import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { AddIcon } from "@/assets/icons";
import type { ButtonProps, Draggable } from "@/features/editor";
import {
  ActionCard,
  ActionPopup,
  useDraggableAction,
  useMagicSubMenu,
  useSubMenuAction,
} from "@/features/editor";

import { useButtonSubMenu } from "../../hooks";
import { ButtonColor } from "./ButtonColor";
import { ButtonIcons } from "./ButtonIcons";
import { ButtonRounding } from "./ButtonRounding";
import { ButtonText } from "./ButtonText";
import { ButtonTextColor } from "./ButtonTextColor";
import { ButtonToggles } from "./ButtonToggles";
import { ButtonTypes } from "./ButtonTypes";

interface Props {
  item: Draggable;
}

export const ButtonSubMenu = React.memo(function ButtonSubMenu({
  item,
}: Props) {
  const {
    itemProps,
    actionAnchorEl,
    onOpenActionsPopOver,
    onCloseActionsPopOver,
  } = useButtonSubMenu(item);

  const {
    magicAnchorEl,
    onClassicTextContentChange,
    onAddTextContent,
    onDeleteTextContent,
    onOpenMagicTextPopOver,
    onCloseMagicTextPopOver,
  } = useMagicSubMenu({ item });

  const { actions: subMenuActions } = useSubMenuAction(item);
  const { handleActionSelect } = useDraggableAction({ item });

  return (
    <Stack
      direction="column"
      paddingX="12px"
      paddingTop="16px"
      borderTop="1px solid #F2F2F2"
    >
      <ButtonTypes itemProps={itemProps} itemId={item.id} />
      <ButtonText
        onAddTextContent={onAddTextContent}
        onClassicTextContentChange={onClassicTextContentChange}
        onDeleteTextContent={onDeleteTextContent}
        onCloseMagicTextPopOver={onCloseMagicTextPopOver}
        onOpenMagicTextPopOver={onOpenMagicTextPopOver}
        anchorEl={magicAnchorEl}
        itemProps={itemProps}
      />
      <ButtonIcons itemProps={itemProps} itemId={item.id} />
      <ButtonColor itemProps={itemProps} itemId={item.id} />
      {itemProps?.type === "contained" && (
        <ButtonTextColor itemId={item.id} itemProps={itemProps} />
      )}
      <ButtonRounding itemProps={itemProps} itemId={item.id} />
      <ButtonToggles itemProps={itemProps} itemId={item.id} />

      {/* Action */}
      <Stack
        marginBottom={3}
        direction="column"
        justifyContent="space-between"
        position="relative"
      >
        <Typography
          sx={{
            marginBottom: 1,
            marginLeft: "6px",
            fontSize: "12px",
            color: " #828282",
            fontWeight: 500,
          }}
        >
          Click Actions
        </Typography>

        {/* list */}
        {!(item.props as ButtonProps)?.actions ||
        (item.props as ButtonProps).actions.length < 1 ? (
          <Box
            sx={(theme) => ({
              fontSize: theme.typography.fontSize,
              width: "100%",
              textAlign: "center",
              border: "1px dotted rgba(0,0,0,.4)",
              color: "rgba(0,0,0,.4)",
              borderRadius: 4,
              padding: "8px 24px",
            })}
          >
            No Actions
          </Box>
        ) : (
          <Stack spacing={0.25}>
            {(item.props as ButtonProps).actions.map((action, index) => (
              <ActionCard key={index} item={item} action={action} />
            ))}
          </Stack>
        )}
        {/* add actions */}
        <Button
          size="small"
          onClick={onOpenActionsPopOver}
          variant="text"
          startIcon={<AddIcon />}
          sx={(theme) => ({
            marginTop: 2,
            color: "#130F40",
            width: "115px",
            fontSize: theme.typography.fontSize - 1,
          })}
        >
          ADD ACTION
        </Button>
        <ActionPopup
          anchorEl={actionAnchorEl}
          onClose={onCloseActionsPopOver}
          onCloseAll={onCloseActionsPopOver}
          actions={subMenuActions}
          onSelect={handleActionSelect}
        />
      </Stack>
    </Stack>
  );
});
