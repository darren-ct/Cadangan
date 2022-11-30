/* eslint-disable @typescript-eslint/ban-ts-comment */
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import { lightBlue } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { ArrowDownIcon } from "@/assets/icons";
import { Input, Li, Ul } from "@/components/Elements";
import { useComboBox } from "@/hooks/useComboBox";
import type { Row } from "@/types";

import type { FormTryServiceSimple } from "../../../types";

interface Props {
  w?: string;
  fieldName: string;
  idx?: number;
  loadingGet: boolean;
  primaryFieldName: string;
  records: Row[];
  onClose: () => void;
  onOpen: () => void;
  onSearch: (text: string) => void;
  onSelect: (record: Row) => void;
}

export const ListLinkToRecords = React.memo(function ListLinkToRecords({
  w,
  fieldName,
  idx,
  loadingGet,
  primaryFieldName,
  records,
  onClose,
  onOpen,
  onSearch,
  onSelect,
}: Props) {
  const { control } = useFormContext<FormTryServiceSimple>();
  const value = useWatch({
    control,
    name:
      idx !== undefined
        ? `selectedLinkRecordParams.${idx}`
        : `selectedLinkRecordBody.${fieldName}`,
  });

  const selectedRecords = value as (Row | null)[] | Row | null | undefined;

  const handleItemToString = React.useCallback(
    (item: Row | null) => {
      return item[primaryFieldName] ?? "";
    },
    [primaryFieldName]
  );

  const {
    highlightedIndex,
    isOpen,
    getComboboxProps,
    getInputProps,
    getItemProps,
    getMenuProps,
    getToggleButtonProps,
    openMenu,
  } = useComboBox<Row>({
    isMultiSelect: false,
    items: records,
    // @ts-ignore
    itemToString: handleItemToString,
    onClose,
    onOpen,
    onSearch,
    onSelect,
  });

  const handleFocus = React.useCallback(() => {
    if (isOpen) {
      return;
    }

    openMenu();
  }, [isOpen, openMenu]);

  const { ...toggleButtonProps } = getToggleButtonProps();

  return (
    <Stack sx={{ width: w, position: "relative" }}>
      <Stack
        sx={{
          zIndex: 10,
          position: "relative",
        }}
        {...getComboboxProps()}
      >
        <Input
          sx={(theme) => ({
            width: "100%",
            padding: 1,
            background: "white",
            lineHeight: "1.5em",
            fontSize: "12px",
            border: `2px solid ${theme.palette.primary.main}`,
            borderRadius: "4px",
            outlineWidth: 0,
          })}
          {...getInputProps({
            autoComplete: "on",
            autoFocus: true,
            placeholder: "Search a record...",
            onFocus: handleFocus,
          })}
        />
        <IconButton
          sx={{
            ml: 2,
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
          }}
          aria-label="toggle menu"
          accessibilityLabel="toggle menu"
          size="small"
          {...toggleButtonProps}
        >
          <ArrowDownIcon />
        </IconButton>
      </Stack>
      <Ul
        sx={(theme) => ({
          margin: 0,
          padding: 0,
          position: "absolute",
          left: 0,
          right: 0,
          top: "38px",
          zIndex: 10,
          listStyle: "none",
          boxShadow: theme.shadows[2],
        })}
        {...getMenuProps()}
      >
        {isOpen && (
          <Stack
            sx={(theme) => ({
              background: "white",
              maxHeight: "238px",
              border: `1px ${theme.palette.grey[200]} solid`,
              borderTopWidth: "0px",
              overflow: "auto",
            })}
          >
            {records.length > 0 ? (
              records.map((item, index) => {
                let selectedRecord: Row | null | undefined;

                if (Array.isArray(selectedRecords)) {
                  selectedRecord = selectedRecords.find((entry) => {
                    return entry?._id === item._id;
                  });
                } else if (selectedRecords?._id === item._id) {
                  selectedRecord = selectedRecords;
                }

                const record = item[primaryFieldName] as
                  | string
                  | null
                  | undefined;
                return (
                  <Li
                    key={`${item}${index}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingX: 1.5,
                      paddingY: 1,
                      cursor: "pointer",
                      backgroundColor:
                        highlightedIndex === index ? "#f5f5f5" : undefined,
                    }}
                    {...getItemProps({ item, index })}
                  >
                    <Chip
                      size="small"
                      sx={{
                        backgroundColor: selectedRecord
                          ? undefined
                          : lightBlue[50],
                      }}
                      label={!record ? "Unnamed Record" : record}
                    />
                  </Li>
                );
              })
            ) : (
              <Stack
                sx={{
                  height: "160px",
                  fontSize: "0.875em",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {loadingGet ? (
                  <CircularProgress />
                ) : (
                  "The searched email cannot be found"
                )}
              </Stack>
            )}
          </Stack>
        )}
      </Ul>
    </Stack>
  );
});
