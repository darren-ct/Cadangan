import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { CloseIcon } from "@/assets/icons";
import type { Method } from "@/types";

interface Props {
  index: number;
  isActiveMethod: boolean;
  method: Method;
  tabLength: number;
  onCloseTab: (method: Method, index: number) => void;
  onOpen: (method: Method) => void;
}

export const TryServiceTabItem = React.memo(function TryServiceTabItem({
  index,
  isActiveMethod,
  method,
  tabLength,
  onCloseTab,
  onOpen,
}: Props) {
  const [textWidth, setTextWidth] = React.useState(180);
  const handleCloseTab = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onCloseTab(method, index);
    },
    [index, method, onCloseTab]
  );

  const handleOpen = React.useCallback(() => {
    onOpen(method);
  }, [method, onOpen]);

  const ref = React.useRef<HTMLButtonElement>(null);

  const handleWidthChange = () => {
    setTextWidth(ref.current.offsetWidth - 25);
  };

  React.useLayoutEffect(() => {
    handleWidthChange();
  }, [tabLength]);

  return (
    <Button
      sx={(theme) => ({
        ":hover .tab-item-text": {
          maxWidth: `${(textWidth ?? 180) - 25}px`,
        },
        ":hover .tab-item-close": {
          display: "flex",
        },
        height: "40px",
        maxWidth: "200px",
        minWidth: "150px",
        display: "flex",
        flexDirection: "row",
        flex: "1",
        px: 1,
        py: 0.5,
        background: theme.palette.grey[100],
        border: "solid",
        borderColor: theme.palette.grey[400],
        borderTopColor: isActiveMethod
          ? theme.palette.primary.main
          : theme.palette.grey[400],
        borderTopWidth: isActiveMethod ? "2px" : "1px",
        borderBottomColor: theme.palette.grey[400],
        borderLeftWidth: "0px",
        borderRightWidth: "1px",
        borderBottomWidth: "1px",
        borderRadius: "0px",
        justifyContent: "space-between",
        alignItems: "center",
        textTransform: "none",
        color: "black",
      })}
      ref={ref}
      onClick={handleOpen}
    >
      <Stack
        className="tab-item-text"
        sx={{
          maxWidth: `${textWidth ?? 180}px`,
        }}
        direction="row"
        flex="1"
        alignItems="center"
        spacing={1}
        justifyContent="flex-start"
      >
        <Chip
          size="small"
          label={method.label}
          sx={{
            backgroundColor: method.bgColor,
            color: method.color,
            marginRight: 1,
            borderRadius: 1,
          }}
        />
        <Typography noWrap>{method.path}</Typography>
      </Stack>
      <IconButton
        className="tab-item-close"
        sx={{
          display: "none",
        }}
        size="small"
        onClick={handleCloseTab}
      >
        <CloseIcon />
      </IconButton>
    </Button>
  );
});
