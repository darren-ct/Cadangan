import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { DeleteIcon, EditIcon } from "@/assets/icons";
import { usePopover } from "@/hooks";

interface Props {
  id: string;
  title: string;
  onDeleteTextContent: (id: string) => void;
}

export const MagicPill = React.memo(function MagicPill({
  id,
  title,
  onDeleteTextContent,
}: Props) {
  const {
    anchorEl,
    onClosePopover: onClose,
    onOpenPopover: onOpen,
  } = usePopover();

  return (
    <Stack padding={0.5}>
      <Stack
        direction="row"
        alignItems="center"
        paddingY={0.6}
        paddingX={1.2}
        spacing={1}
        borderRadius="100vh"
        bgcolor="#130F40"
        sx={{ cursor: "pointer" }}
        onClick={onOpen}
      >
        <Typography sx={{ color: "white", textAlign: "end", fontSize: 11 }}>
          {title}
        </Typography>
        <EditIcon sx={{ fontSize: 12, color: "white" }} />
      </Stack>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Stack direction="row" alignItems="center" padding={1}>
          <Typography sx={{ fontSize: "11px" }}>{title}</Typography>
          <IconButton onClick={() => onDeleteTextContent(id)}>
            <DeleteIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Stack>
      </Popover>
    </Stack>
  );
});
