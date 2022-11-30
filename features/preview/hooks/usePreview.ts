import { useRouter } from "next/router";
import * as React from "react";

import {
  useEditorDraggableStore,
  useEditorPageStore,
  useNodeAction,
} from "@/features/editor";

import { usePreviewPageStore } from "./usePreviewPageStore";

export const usePreview = () => {
  const router = useRouter();
  const { databaseId, editorPageId } = router.query;

  const { defaultLayouts, draggables } = useEditorDraggableStore();
  const { pages } = useEditorPageStore((state) => state);
  const { loggedUser } = usePreviewPageStore((state) => state);

  const [actionLoading, setActionLoading] = React.useState(true);

  // Function
  const navigateToEditor = React.useCallback(() => {
    router.push(`/databases/${databaseId}/editor/${editorPageId}`);
  }, [router, databaseId, editorPageId]);

  const page = React.useMemo(
    () => pages.find((page) => page.id === editorPageId),
    [pages, editorPageId]
  );

  const actions = React.useMemo(() => page?.props?.actions, [page?.props]);
  const { handleLinkAction } = useNodeAction({ actions });

  React.useEffect(() => {
    if (!actions) return setActionLoading(false);

    actions?.forEach((action) => {
      switch (action.type) {
        case "LINK":
          handleLinkAction(action);
          break;

        default:
          break;
      }
    });
  }, [page, actions, handleLinkAction]);

  return {
    defaultLayouts,
    draggables,
    navigateToEditor,
    loggedUser,
    actionLoading,
  };
};
