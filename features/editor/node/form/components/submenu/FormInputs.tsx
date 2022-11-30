import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { Field } from "@/widgets/types/index";

interface Props {
  field: Field;
  onSubmit: (field: Field) => void;
}

export const FormInputs = React.memo(function FormInputs({
  field,
  onSubmit,
}: Props) {
  const [form, setForm] = React.useState<{
    label: string;
    placeholder: string;
  }>({
    label: undefined,
    placeholder: undefined,
  });

  const onChangeHandler = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const handleSubmit = React.useCallback(() => {
    onSubmit({
      ...field,
      label: form.label !== undefined ? form.label : field.label,
      placeholder:
        form.placeholder !== undefined ? form.placeholder : field.placeholder,
    });
  }, [form.label, form.placeholder, onSubmit, field]);

  return (
    <>
      <Stack
        width="100%"
        spacing={0.5}
        marginBottom={2}
        padding="4px 8px"
        bgcolor="white"
        direction="column"
        borderRadius={1}
      >
        <Typography
          sx={(theme) => ({
            fontSize: theme.typography.fontSize,
            fontWeight: 500,
          })}
        >
          Label
        </Typography>
        <TextField
          size="small"
          sx={{ bgcolor: "#FFFFFF" }}
          inputProps={{ style: { fontSize: 12 } }}
          placeholder="Enter the label"
          variant="standard"
          InputProps={{
            disableUnderline: true,
          }}
          name="label"
          value={form.label ? form.label : field.label}
          onChange={onChangeHandler}
        />
      </Stack>
      <Stack
        width="100%"
        marginBottom={2}
        spacing={0.5}
        padding="4px 8px"
        bgcolor="white"
        direction="column"
        borderRadius={1}
      >
        <Typography
          sx={(theme) => ({
            fontSize: theme.typography.fontSize,
            fontWeight: 500,
          })}
        >
          Placeholder
        </Typography>
        <TextField
          size="small"
          sx={{ bgcolor: "#FFFFFF" }}
          placeholder="Enter the placeholder"
          variant="standard"
          InputProps={{
            disableUnderline: true,
          }}
          inputProps={{ style: { fontSize: 12 } }}
          name="placeholder"
          value={form.placeholder ? form.placeholder : field.placeholder}
          onChange={onChangeHandler}
        />
      </Stack>
      <Button
        size="small"
        onClick={handleSubmit}
        variant="contained"
        sx={(theme) => ({
          fontSize: theme.typography.fontSize - 1,
          color: "white",
        })}
      >
        DONE
      </Button>
    </>
  );
});
