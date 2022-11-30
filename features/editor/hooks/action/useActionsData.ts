import { useRouter } from "next/router";
import * as React from "react";

import type { ActionLocation } from "@/features/editor";
import { usePropsBar } from "@/features/editor";

export const useActionsData = () => {
  const dbId = useRouter().query.databaseId;

  //   Item
  const { memoizedDraggable: item } = usePropsBar({ dbId: dbId as string });

  //   Action Memos
  const memoizedActionLocation: ActionLocation = React.useMemo(() => {
    switch (item?.type) {
      case "nav":
        return "NAVLINK";
        break;
      case "button":
      case "form":
      case "text":
        return "PROP";
        break;
      default:
        return "PAGE";
    }
  }, [item?.type]);

  return {
    memoizedActionLocation,
  };
};
