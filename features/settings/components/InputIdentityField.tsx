import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { ArrowDownIcon } from "@/assets/icons";
import { Li, Ul } from "@/components/Elements";
import { InputButton } from "@/components/Form";
import { useSelection } from "@/hooks/useSelection";
import type { Field, UseControllerProps } from "@/types";

import { FormConfiguration } from "../types";

interface Props extends UseControllerProps<FormConfiguration> {
  w?: string;
  fields?: Field[];
  onSelect: (option: Field) => void;
}

export const InputIdentityField = React.memo(function InputIdentityField({
  w,
  fields,
  onSelect,
  ...rest
}: Props) {
  const { control } = useFormContext<FormConfiguration>();
  const value = useWatch({ control, ...rest });

  const fieldName = value as string | undefined;

  const {
    highlightedIndex,
    isOpen,
    getItemProps,
    getMenuProps,
    getToggleButtonProps,
  } = useSelection<Field>({
    isMultiSelect: false,
    items: fields ?? [],
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
          <Typography>{fieldName}</Typography>
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
            {fields.map((item, index) => {
              const isSelected = item.name === fieldName;

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
                  <Typography fontWeight={isSelected ? 600 : undefined} noWrap>
                    {item.name}
                  </Typography>
                </Li>
              );
            })}
          </Stack>
        )}
      </Ul>
    </Stack>
  );
});
