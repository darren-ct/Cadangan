import { lightBlue } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { ArrowDownIcon } from "@/assets/icons";
import { Input, Li, Ul } from "@/components/Elements";
import { useComboBox } from "@/hooks/useComboBox";
import type { Authentication } from "@/types";

interface Props {
  auths: Authentication[];
  onCloseAuth: () => void;
  onSearchAuth: (text: string) => void;
  onSelectAuth: (auth: Authentication) => void;
}

export const ListAuths = React.memo(function ListAuths({
  auths,
  onCloseAuth,
  onSearchAuth,
  onSelectAuth,
}: Props) {
  const handleItemToString = React.useCallback(
    (item: Authentication | null) => {
      return item?.identity ?? "";
    },
    []
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
  } = useComboBox<Authentication>({
    isMultiSelect: false,
    items: auths,
    itemToString: handleItemToString,
    onClose: onCloseAuth,
    onSearch: onSearchAuth,
    onSelect: onSelectAuth,
  });

  const handleFocus = React.useCallback(() => {
    if (isOpen) {
      return;
    }

    openMenu();
  }, [isOpen, openMenu]);

  const { onClick: onPress, ...toggleButtonProps } = getToggleButtonProps();

  return (
    <>
      <Stack
        sx={() => ({
          background: lightBlue[50],
          p: 1,
        })}
      >
        <Typography fontWeight={700}>Info</Typography>
        <Typography fontSize="0.875em">
          Add an identity to authentication history by calling Register or Login
          API.
        </Typography>
      </Stack>
      <Stack
        sx={{
          mt: 1,
          position: "relative",
        }}
        {...getComboboxProps()}
      >
        <Input
          sx={{
            backgroundColor: "white",
            width: "100%",
            padding: 1,
            lineHeight: "1.5em",
            fontSize: "12px",
            borderWidth: "1px",
            borderColor: "#e5e5e5",
            borderStyle: "solid",
            borderRadius: "8px",
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            outlineWidth: 0,
          }}
          {...getInputProps({
            autoComplete: "on",
            autoFocus: true,
            placeholder: "Search an identity...",
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
          onClick={onPress}
          {...toggleButtonProps}
        >
          <ArrowDownIcon />
        </IconButton>
      </Stack>
      <Ul
        sx={{
          margin: 0,
          padding: 2,
          position: "absolute",
          left: 0,
          right: 0,
          top: "90px",
          listStyle: "none",
        }}
        {...getMenuProps()}
      >
        {isOpen && (
          <Stack
            sx={(theme) => ({
              background: "white",
              border: `1px ${theme.palette.grey[200]} solid`,
              borderTopWidth: "0px",
              overflow: "auto",
            })}
          >
            {auths.length > 0 ? (
              auths.map((item, index) => (
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
                  <Typography fontSize="0.875em" noWrap>
                    {item.identity}
                  </Typography>
                </Li>
              ))
            ) : (
              <Stack
                sx={{
                  height: "160px",
                  fontSize: "0.875em",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                The searched email cannot be found
              </Stack>
            )}
          </Stack>
        )}
      </Ul>
    </>
  );
});
