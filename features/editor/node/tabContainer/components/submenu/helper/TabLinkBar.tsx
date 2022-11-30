import Stack from "@mui/material/Stack";
import * as React from "react";

import type { TabLink } from "@/features/editor";
import {
  ExpandableCard,
  useEditorDraggableStore,
  useMagicResult,
} from "@/features/editor";
import { useDisclose } from "@/hooks";

import { TabContainerCard } from "../card";
import { TabLinkMember } from "./TabLinkMember";

interface Props {
  tabLink: TabLink;
  pickedLinkData: TabLink;
  setPickedLinkId: React.Dispatch<React.SetStateAction<string>>;
  onEditTabLink: (tabLink: TabLink) => void;
  onRemoveTabLink: (id: string) => void;
}

export const TabLinkBar = React.memo(function TabLinkBar({
  tabLink,
  pickedLinkData,
  setPickedLinkId,
  onEditTabLink,
  onRemoveTabLink,
}: Props) {
  const { draggables } = useEditorDraggableStore();
  const { stringifiedOutput } = useMagicResult(tabLink.text);
  const {
    isOpen: isChildrenOpen,
    onClose: onCloseChildren,
    onOpen: onOpenChildren,
  } = useDisclose();

  // Handler
  const onToggleCardHandler = React.useCallback(() => {
    if (pickedLinkData?.id === tabLink.id) {
      setPickedLinkId("");
      return onCloseChildren();
    }

    setPickedLinkId(tabLink.id);
    onOpenChildren();
  }, [
    onCloseChildren,
    onOpenChildren,
    pickedLinkData?.id,
    setPickedLinkId,
    tabLink.id,
  ]);

  return (
    <Stack direction="column">
      {/* Body */}
      <ExpandableCard
        active={pickedLinkData?.id === tabLink.id}
        title={stringifiedOutput}
        onClick={onToggleCardHandler}
        onRemove={() => onRemoveTabLink(tabLink.id)}
      >
        <TabContainerCard
          pickedLinkData={pickedLinkData}
          setPickedLinkId={setPickedLinkId}
          onEditTabLink={onEditTabLink}
        />
      </ExpandableCard>

      {/* Children */}
      {isChildrenOpen && (
        <Stack
          direction="column"
          paddingLeft={4}
          marginTop={1}
          marginBottom={3}
          spacing={1}
        >
          {draggables
            .filter((draggable) => draggable.containerId === tabLink.id)
            .map((draggable, index) => (
              <TabLinkMember
                key={draggable.id}
                draggable={draggable}
                isFirstChild={index === 0}
              />
            ))}
        </Stack>
      )}
    </Stack>
  );
});
