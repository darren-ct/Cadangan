import Box from "@mui/material/Box";
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
import type { SelectOption, UseControllerProps } from "@/types";

import type { FormTryServiceSimple } from "../../../types";

interface Props extends UseControllerProps<FormTryServiceSimple> {
  w?: string;
  fieldName: string;
  options?: SelectOption[];
  onOpen: () => void;
  onSelect: (option: SelectOption, isMultiSelect: boolean) => void;
}

export const InputMultiSelect = React.memo(function InputMultiSelect({
  w,
  fieldName,
  options,
  onOpen,
  onSelect,
  ...rest
}: Props) {
  const { control } = useFormContext<FormTryServiceSimple>();
  const value = useWatch({ control, ...rest });

  const selectedOptions = value as SelectOption[] | undefined;

  const {
    highlightedIndex,
    isOpen,
    getItemProps,
    getMenuProps,
    getToggleButtonProps,
  } = useSelection<SelectOption>({
    isMultiSelect: true,
    items: options ?? [],
    onOpen,
    onSelect,
  });

  const { ...toggleButtonProps } = getToggleButtonProps();

  return (
    <Box
      sx={{
        width: w,
        position: "relative",
      }}
    >
      <InputButton
        sx={{
          width: "100%",
          borderBottomRadius: isOpen ? "0" : undefined,
        }}
        accessibilityLabel="toggle menu"
        {...toggleButtonProps}
      >
        <Stack
          sx={{
            flex: "1",
            overflow: "hidden",
            alignItems: "center",
          }}
          direction="row"
          spacing={0.5}
        >
          {selectedOptions && selectedOptions.length > 0 ? (
            selectedOptions.map((item, index) => (
              <Chip
                key={index}
                size="small"
                sx={{
                  backgroundColor: lightBlue[50],
                }}
                label={item.value === "" ? "Unnamed Option" : item.value}
              />
            ))
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
          top: "36px",
          left: 0,
          right: 0,
          zIndex: 1,
          outlineWidth: 0,
          listStyle: "none",
          boxShadow: theme.shadows[2],
        })}
        {...getMenuProps()}
      >
        {isOpen && (
          <Stack
            sx={(theme) => ({
              background: "white",
              borderTopRightRadius: "0px",
              borderTopLeftRadius: "0px",
              border: `1px ${theme.palette.grey[200]} solid`,
              borderTopWidth: "0px",
              borderRadius: "8px",
            })}
          >
            {options?.map((item, index) => {
              const selectedOption = selectedOptions?.find(
                (entry) => entry.id === item.id
              );

              return (
                <Li
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    paddingX: 1.5,
                    paddingY: 1,
                    cursor: "pointer",
                    backgroundColor:
                      highlightedIndex === index ? "#f5f5f5" : undefined,
                  }}
                  key={`${item}${index}`}
                  {...getItemProps({ item, index })}
                >
                  <Chip
                    size="small"
                    sx={{
                      backgroundColor: selectedOption
                        ? undefined
                        : lightBlue[50],
                    }}
                    label={item.value === "" ? "Unnamed Option" : item.value}
                  />
                </Li>
              );
            })}
          </Stack>
        )}
      </Ul>
    </Box>
  );
});
