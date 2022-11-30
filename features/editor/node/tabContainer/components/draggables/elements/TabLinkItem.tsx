import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type { TabLink } from "@/features/editor";
import { useMagicResult } from "@/features/editor";

interface Props {
  tabLink: TabLink;
  clickedTabLinkId: string;
  setClickedTabLinkId: React.Dispatch<React.SetStateAction<string>>;
}

export const TabLinkItem = React.memo(function TabLinkItem({
  tabLink,
  clickedTabLinkId,
  setClickedTabLinkId,
}: Props) {
  const { stringifiedOutput } = useMagicResult(tabLink.text);
  return (
    <Stack
      sx={{ cursor: "pointer" }}
      onClick={(e) => {
        e.stopPropagation();
        setClickedTabLinkId(tabLink.id);
      }}
      onDragStart={(e) => e.stopPropagation()}
    >
      <Typography
        sx={(theme) => ({
          fontSize: theme.typography.fontSize,
          color: clickedTabLinkId === tabLink.id ? "#130F40" : "#828282",
        })}
      >
        {stringifiedOutput}
      </Typography>
    </Stack>
  );
});
