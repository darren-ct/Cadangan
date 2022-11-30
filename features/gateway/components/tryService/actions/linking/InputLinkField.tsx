import Chip from "@mui/material/Chip";
import { grey, lightBlue } from "@mui/material/colors";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { ArrowDownIcon } from "@/assets/icons";
import { Li, Ul } from "@/components/Elements";
import { InputButton } from "@/components/Form";
import { useSelection } from "@/hooks/useSelection";
import type { Field } from "@/types";

interface Props {
  fieldName?: string;
  fields: Field[];
  onSelect: (field: Field) => void;
}

export const InputLinkField = React.memo(function InputLinkField({
  fieldName,
  fields,
  onSelect,
}: Props) {
  const {
    highlightedIndex,
    isOpen,
    getItemProps,
    getMenuProps,
    getToggleButtonProps,
  } = useSelection<Field>({
    isMultiSelect: false,
    items: fields,
    onSelect,
  });

  const { ...toggleButtonProps } = getToggleButtonProps();

  return (
    <Stack
      sx={{
        flex: 1,
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
          {fieldName ? (
            <Chip
              size="small"
              sx={{
                backgroundColor: lightBlue[50],
              }}
              label={fieldName}
            />
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
                  <Chip size="small" label={item.name} />
                </Li>
              );
            })}
          </Stack>
        )}
      </Ul>
    </Stack>
  );
});
