import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { ChevronDownIcon, SearchIcon } from "@/assets/icons";
import { IconDisplay } from "@/features/editor";
import { useDisclose } from "@/hooks";

import { AddPageModal } from "../modal";

interface Props {
  handleCreatePage: (name: string, pageType: string) => void;
  filteredPageTypes: string[];
  onPageTypesSearchHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setTab: React.Dispatch<React.SetStateAction<string>>;
}

export const AddPageTab = React.memo(function AddPageTab({
  handleCreatePage,
  filteredPageTypes,
  onPageTypesSearchHandler,
  setTab,
}: Props) {
  // Hooks
  const { isOpen, onOpen, onClose } = useDisclose();

  //   State
  const [pageType, setPageType] = React.useState<string | null>(null);

  //   Functions
  const onSelectHandler = React.useCallback(
    (pageType: string) => {
      setPageType(pageType);
      onOpen();
    },
    [onOpen]
  );

  const onSubmitHandler = React.useCallback(
    (name: string) => {
      handleCreatePage(name, pageType);
      onClose();
      setTab("explorer");
    },
    [handleCreatePage, onClose, pageType, setTab]
  );

  return (
    <Stack
      direction="column"
      paddingX={1}
      paddingY={1.5}
      alignItems="flex-start"
    >
      {/* BreadCrumbs */}
      <Stack
        paddingX={0.5}
        direction="row"
        alignItems="center"
        justifyContent="flex-starts"
        spacing={1}
        marginBottom={0.5}
      >
        <Typography
          sx={(theme) => ({
            color: "#130F40",
            cursor: "pointer",
            fontSize: theme.typography.fontSize - 2,
            "&:hover": {
              textDecoration: "underline",
            },
          })}
          onClick={() => setTab("explorer")}
        >
          Explorer Tab
        </Typography>
        <ChevronDownIcon
          sx={(theme) => ({
            color: "#130F40",
            transform: "rotate(270deg)",
            fontSize: theme.typography.fontSize + 2,
          })}
        />
        <Typography
          sx={(theme) => ({
            color: "#130F40",
            cursor: "pointer",
            fontSize: theme.typography.fontSize - 2,
          })}
        >
          Add New Page
        </Typography>
      </Stack>

      {/* Search */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          position: "relative",
          padding: "4px 28px",
          backgroundColor: "#F4F6F8",
          marginTop: 3,
          marginBottom: "30px",
          width: "100%",
        }}
      >
        <SearchIcon
          sx={{
            marginRight: "12px",
            color: "#130F40",
            fontSize: 11,
          }}
        />
        <input
          placeholder="Search Options"
          style={{
            fontSize: 11,
            flex: 1,
            padding: "8px",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#130F40",
          }}
          onChange={onPageTypesSearchHandler}
        />
      </Stack>

      <Typography
        sx={{
          color: "rgba(0,0,0,.4)",
          fontSize: "11px",
          textAlign: "center",
          width: "100%",
        }}
      >
        Click one option to create page
      </Typography>

      {/* Grid */}
      <Box
        sx={{
          marginTop: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridGap: "12px",
          width: "100%",
          padding: "12px",
        }}
      >
        {filteredPageTypes.map((pageType, index) => (
          <Stack
            key={index}
            direction="column"
            alignItems={"center"}
            sx={{ cursor: "pointer", paddingY: "12px" }}
            onClick={() => onSelectHandler(pageType)}
          >
            <IconDisplay name={pageType} />
            <Typography
              sx={{ color: "#687076", fontWeight: 500, fontSize: 11 }}
            >
              {pageType}
            </Typography>
          </Stack>
        ))}
      </Box>

      {/* Modal */}
      <AddPageModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmitHandler}
      />
    </Stack>
  );
});
