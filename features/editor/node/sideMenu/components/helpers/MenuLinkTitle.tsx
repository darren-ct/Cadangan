import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type { MenuLink } from "@/features/editor";
import { IconDisplay, useMagicResult } from "@/features/editor";

interface Props {
  menuLink: MenuLink;
}
export const MenuLinkTitle = React.memo(function MenuLinkTitle({
  menuLink,
}: Props) {
  // Memo
  const textContents = React.useMemo(() => {
    return menuLink.text;
  }, [menuLink.text]);

  // Hooks
  const { stringifiedOutput } = useMagicResult(textContents);

  return (
    <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
      <IconDisplay name={menuLink.iconName} />
      <Typography
        sx={(theme) => ({
          color: "black",
          fontSize: theme.typography.fontSize,
        })}
      >
        {stringifiedOutput
          ? stringifiedOutput
          : menuLink.isImage
          ? "Image"
          : ""}
      </Typography>
    </Stack>
  );
});
