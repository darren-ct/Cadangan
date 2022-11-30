import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type { NavLink } from "@/features/editor";
import { IconDisplay, useMagicResult } from "@/features/editor";

interface Props {
  navLink: NavLink;
}
export const NavLinkTitle = React.memo(function NavLinkTitle({
  navLink,
}: Props) {
  // Memo
  const textContents = React.useMemo(() => {
    return navLink.text;
  }, [navLink.text]);

  // Hooks
  const { stringifiedOutput } = useMagicResult(textContents);

  return (
    <Stack direction="row" sx={{ alignItems: "center", flex: 1 }} spacing={1}>
      <IconDisplay name={navLink.iconName} />
      <Typography
        sx={(theme) => ({
          color: "black",
          fontSize: theme.typography.fontSize,
        })}
      >
        {stringifiedOutput ? stringifiedOutput : navLink.isImage ? "Image" : ""}
      </Typography>
    </Stack>
  );
});
