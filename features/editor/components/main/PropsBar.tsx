import Stack from "@mui/material/Stack";
import { useRouter } from "next/router";
import * as React from "react";

import { useWidgetGlobalEvent } from "@/widgets/hooks";
import { ExplorerParams } from "@/widgets/types";

import { useEditorView, usePropsBar } from "../../hooks";
import { SubMenu } from "../submenus/SubMenu";

export const PropsBar = React.memo(function PropsBar() {
  const router = useRouter();
  const { databaseId } = router.query as ExplorerParams;

  const { handleRemoveDraggable, activeId } = useEditorView();
  const { memoizedDraggable, onGetTables, onGetFields } = usePropsBar({
    dbId: databaseId,
  });

  useWidgetGlobalEvent({ onGetTables, onGetFields });

  return (
    <Stack
      direction="column"
      width={270}
      height="100vh"
      maxHeight="100vh"
      bgcolor="white"
      paddingX={0}
      paddingBottom={4}
      position="fixed"
      sx={{
        overflowY: "scroll",
        right: "0px",
        top: "0px",
        zIndex: 50,
        transform: `translateX(${activeId ? 0 : 270}px)`,
        transition: "200ms linear",
      }}
      borderLeft="1px solid #F2F2F2"
    >
      <SubMenu item={memoizedDraggable} onRemove={handleRemoveDraggable} />
    </Stack>
  );
});
