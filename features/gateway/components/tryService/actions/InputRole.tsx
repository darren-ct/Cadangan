import Chip from "@mui/material/Chip";
import { lightBlue } from "@mui/material/colors";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { ArrowDownIcon } from "@/assets/icons";
import { Li, Ul } from "@/components/Elements";
import { InputButton } from "@/components/Form";
import { useSelection } from "@/hooks/useSelection";
import type { RoleType, UseControllerProps } from "@/types";

import type { FormTryServiceSimple } from "../../../types";

interface Props extends UseControllerProps<FormTryServiceSimple> {
  w?: string;
  fieldName: string;
  onOpen: () => void;
  onSelect: (type: RoleType, isMultiSelect: boolean) => void;
}

export const InputRole = React.memo(function InputRole({
  w,
  fieldName,
  onOpen,
  onSelect,
  ...rest
}: Props) {
  const { control } = useFormContext<FormTryServiceSimple>();
  const value = useWatch({ control, ...rest });
  // const { colorMode } = useColorMode();

  const selectedOption = value as RoleType | undefined;
  const types: RoleType[] = ["admin", "authenticated"];

  const {
    highlightedIndex,
    isOpen,
    getItemProps,
    getMenuProps,
    getToggleButtonProps,
  } = useSelection<RoleType>({
    isMultiSelect: false,
    items: types ?? [],
    onOpen,
    onSelect,
  });

  const { ...toggleButtonProps } = getToggleButtonProps();

  return (
    <Stack
      sx={{
        width: w,
        position: "relative",
      }}
    >
      <InputButton {...toggleButtonProps}>
        <Stack
          sx={{
            flex: "1",
            overflow: "hidden",
            alignItems: "center",
          }}
          direction="row"
          spacing={0.5}
        >
          {selectedOption ? (
            <Chip
              size="small"
              sx={{
                backgroundColor: lightBlue[50],
              }}
              label={selectedOption}
            />
          ) : (
            <Typography fontSize="0.875em">
              {w ? "Select option" : fieldName}
            </Typography>
          )}
        </Stack>
        <ArrowDownIcon />
      </InputButton>
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
            {types.map((item, index) => {
              const isSelected = item === selectedOption[0];

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
                      backgroundColor: isSelected ? undefined : lightBlue[50],
                    }}
                    label={item}
                  />
                </Li>
              );
            })}
          </Stack>
        )}
      </Ul>
    </Stack>
  );
});
