import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { AddIcon, DeleteIcon } from "@/assets/icons";
import { Field } from "@/widgets/types";

import { FormInputs } from "./FormInputs";

interface Props {
  includes: Field[];
  excludes: Field[];
  activeField: string;
  onAddField: (field: Field) => void;
  onRemoveField: (field: Field) => void;
  onSelectField: (id: string) => void;
  onFieldChangeSubmit: (field: Field) => void;
  onAddVisibleFieldToggle: () => void;
  isAddVisibleFieldOpen: boolean;
}

export const FormFields = React.memo(function FormFields({
  activeField,
  includes,
  excludes,
  isAddVisibleFieldOpen,
  onAddField,
  onRemoveField,
  onSelectField,
  onFieldChangeSubmit,
  onAddVisibleFieldToggle,
}: Props) {
  return (
    <Stack direction="column">
      <Typography
        sx={(theme) => ({
          marginBottom: "8px",
          color: "#828282",
          fontWeight: 500,
          fontSize: theme.typography.fontSize,
        })}
      >
        Form Fields
      </Typography>

      {includes?.map((field) => (
        <Stack
          key={field.id}
          marginBottom={1}
          borderRadius={2}
          sx={{ overflow: "hidden" }}
        >
          <Stack
            key={field.id}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            padding="8px 12px"
            sx={{
              cursor: "pointer",
              borderRadius: "4px",
              color: activeField === field.id ? "white" : "rgba(0,0,0,.75)",
              backgroundColor:
                activeField === field.id ? "#130F40" : "rgba(0,0,0,.05)",
              "&:hover": {
                backgroundColor:
                  activeField === field.id ? "#130F40" : "rgba(0,0,0,.1)",
              },
              transition: "150ms linear",
            }}
            onClick={() => onSelectField(field.id)}
          >
            <Typography
              sx={(theme) => ({
                fontSize: theme.typography.fontSize,
                color: activeField === field.id ? "white " : "#130F40",
              })}
            >
              {field.name}
            </Typography>
            <IconButton onClick={() => onRemoveField(field)}>
              <DeleteIcon
                sx={(theme) => ({
                  fontSize: theme.typography.fontSize + 4,
                  color: activeField === field.id ? "white" : "#130F40",
                })}
              />
            </IconButton>
          </Stack>

          {activeField === field.id && (
            <Stack
              padding="16px 12px"
              bgcolor="rgba(0,0,0,.05)"
              alignItems="flex-end"
            >
              <FormInputs field={field} onSubmit={onFieldChangeSubmit} />
            </Stack>
          )}
        </Stack>
      ))}

      <Stack direction="column" sx={{ position: "relative" }}>
        <Stack
          onClick={onAddVisibleFieldToggle}
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ cursor: "pointer", padding: "12px" }}
        >
          <AddIcon sx={{ color: "#130F40" }} />
          <Typography
            sx={(theme) => ({
              color: " #130F40",
              fontSize: theme.typography.fontSize,
            })}
          >
            ADD VISIBLE FIELD
          </Typography>
        </Stack>

        {isAddVisibleFieldOpen && (
          <Stack
            spacing={1}
            minWidth="200px"
            alignItems="center"
            sx={{
              borderRadius: "4px",
              position: "absolute",
              bottom: "100%",
              backgroundColor: "white",
              boxShadow: "1px 1px 10px rgba(0,0,0,.25)",
              overflow: "hidden",
            }}
          >
            {excludes.length === 0 ? (
              <Box
                sx={(theme) => ({
                  padding: "12px",
                  fontSize: theme.typography.fontSize,
                })}
              >
                Nothing available
              </Box>
            ) : (
              excludes.map((field) => (
                <Box
                  key={field.id}
                  sx={(theme) => ({
                    width: "100%",
                    cursor: "pointer",
                    padding: "12px",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,.05)",
                    },
                    fontSize: theme.typography.fontSize,
                  })}
                  onClick={() => onAddField(field)}
                >
                  {field.name}
                </Box>
              ))
            )}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
});
