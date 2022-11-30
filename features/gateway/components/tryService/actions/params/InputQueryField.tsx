import Chip from "@mui/material/Chip";
import { grey, lightBlue } from "@mui/material/colors";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { ArrowDownIcon } from "@/assets/icons";
import { Li, Ul } from "@/components/Elements";
import { InputButton } from "@/components/Form";
import { useSelection } from "@/hooks/useSelection";
import type { Field, UseControllerProps } from "@/types";

import type { FormTryServiceSimple, QueryFieldType } from "../../../../types";

interface Props extends UseControllerProps<FormTryServiceSimple> {
  fields: Field[];
  type: QueryFieldType;
  onSelect: (field: Field, type: QueryFieldType) => void;
}

export const InputQueryField = React.memo(function InputQueryField({
  fields,
  type,
  onSelect,
  ...rest
}: Props) {
  const { control } = useFormContext<FormTryServiceSimple>();
  const value = useWatch({ control, ...rest });

  const selectedFields = value as Field[] | undefined;

  const handleSelect = React.useCallback(
    (field: Field) => {
      onSelect(field, type);
    },
    [onSelect, type]
  );

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelection<Field>({
    isMultiSelect: fields.length > 1 ? true : false,
    items: fields ?? [],
    onSelect: handleSelect,
  });

  const { ...toggleButtonProps } = getToggleButtonProps();

  return (
    <Stack
      sx={{
        position: "relative",
      }}
    >
      <InputButton disableRipple {...toggleButtonProps}>
        <Stack
          sx={{
            flex: "1",
            overflow: "hidden",
            alignItems: "center",
          }}
          direction="row"
          spacing={0.5}
        >
          {selectedFields && selectedFields.length > 0 ? (
            selectedFields.map((item, index) => (
              <Chip
                key={index}
                size="small"
                sx={{
                  backgroundColor: lightBlue[50],
                }}
                label={item.name}
              />
            ))
          ) : (
            <Typography color={grey[500]} fontSize="0.875em">
              Select field
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
            {fields.map((item, index) => {
              const selectedField = selectedFields?.find(
                (entry) => entry.name === item.name
              );

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
                      backgroundColor: selectedField
                        ? undefined
                        : lightBlue[50],
                    }}
                    label={item.name}
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
