import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export const AddPageModal = React.memo(function AddPageModal({
  isOpen,
  onClose,
  onSubmit,
}: Props) {
  const [value, setValue] = React.useState<string>("");

  // Function
  const onSubmitHandler = React.useCallback(() => {
    if (!value) {
      return;
    }

    onSubmit(value);

    setValue("");
  }, [onSubmit, value]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingX: 8,
      }}
    >
      <Container maxWidth="md">
        <Stack
          direction="column"
          sx={{
            width: "100%",
            borderRadius: 4,
            backgroundColor: "white",
            paddingY: 4,
          }}
        >
          <Stack paddingX={4}>
            <Typography
              sx={{ fontWeight: 500, fontSize: 20, color: "#130F40" }}
            >
              New Page
            </Typography>
          </Stack>

          <Box
            sx={{
              width: "100%",
              height: "1px",
              backgroundColor: "rgba(0,0,0,.1)",
              marginY: 3,
            }}
          ></Box>

          <Stack direction="column" paddingX={6}>
            <Typography
              sx={{
                color: "#828282",
                fontWeight: 500,
                marginBottom: "4px",
              }}
            >
              Name
            </Typography>
            <TextField
              placeholder="Enter new page name"
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue(e.target.value)
              }
            />
          </Stack>

          <Box
            sx={{
              width: "100%",
              height: "1px",
              backgroundColor: "rgba(0,0,0,.1)",
              marginY: 3,
            }}
          ></Box>

          <Stack
            direction="row"
            justifyContent="flex-end"
            paddingX={4}
            spacing={1}
          >
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" onClick={onSubmitHandler}>
              Create Screen
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Modal>
  );
});
