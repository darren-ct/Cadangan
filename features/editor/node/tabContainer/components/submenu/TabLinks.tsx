import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import * as React from "react";

import { AddIcon } from "@/assets/icons";
import type { TabLink } from "@/features/editor";

import { TabLinkBar } from "./helper";

interface Props {
  tabLinks: TabLink[];
  pickedLinkData: TabLink;
  setPickedLinkId: React.Dispatch<React.SetStateAction<string>>;
  onAddTabLink: (tabLink: TabLink) => void;
  onEditTabLink: (tabLink: TabLink) => void;
  onRemoveTabLink: (id: string) => void;
}

export const TabLinks = React.memo(function TabLinks({
  tabLinks,
  pickedLinkData,
  setPickedLinkId,
  onAddTabLink,
  onEditTabLink,
  onRemoveTabLink,
}: Props) {
  // Handler
  const onClickHandler = React.useCallback(() => {
    const id = String(Date.now());

    onAddTabLink({
      id,
      text: [
        {
          id: String(Date.now()),
          type: "CLASSIC",
          subProps: {
            text: "New Tab",
          },
        },
      ],
    });
    setPickedLinkId(id);
  }, [onAddTabLink, setPickedLinkId]);

  return (
    <Stack direction="column" spacing={0.5}>
      {tabLinks?.map((tabLink) => (
        <TabLinkBar
          key={tabLink.id}
          tabLink={tabLink}
          pickedLinkData={pickedLinkData}
          setPickedLinkId={setPickedLinkId}
          onEditTabLink={onEditTabLink}
          onRemoveTabLink={onRemoveTabLink}
        />
      ))}
      <Button
        size="small"
        onClick={onClickHandler}
        variant="text"
        startIcon={<AddIcon />}
        sx={{
          marginTop: 2,
          color: "#130F40",
          width: "115px",
        }}
      >
        ADD TAB
      </Button>
    </Stack>
  );
});
