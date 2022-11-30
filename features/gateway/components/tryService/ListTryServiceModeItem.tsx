import Button from "@mui/material/Button";
import * as React from "react";

import { TryServiceMode, TryServiceType } from "../../types";

interface Props {
  isActive: boolean;
  tryServiceMode: TryServiceMode;
  onSelect: (tryServiceType: TryServiceType) => void;
}

export const ListTryServiceModeItem = React.memo(
  function ListTryServiceModeItem({
    isActive,
    tryServiceMode,
    onSelect,
  }: Props) {
    const handleClick = React.useCallback(() => {
      onSelect(tryServiceMode.id);
    }, [onSelect, tryServiceMode.id]);

    return (
      <Button
        sx={(theme) => ({
          display: "flex",
          minWidth: "100px",
          py: 0.5,
          border: "0px solid",
          borderBottomWidth: "3px",
          borderColor: isActive
            ? theme.palette.primary.main
            : theme.palette.grey[600],
          borderRadius: "0px",
          alignItems: "center",
          color: isActive
            ? theme.palette.primary.main
            : theme.palette.grey[600],
          textTranform: "none",
        })}
        onClick={handleClick}
      >
        {tryServiceMode.name}
      </Button>
    );
  }
);
