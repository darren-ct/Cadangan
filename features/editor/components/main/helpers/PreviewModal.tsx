import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Modal from "@mui/material/Modal";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

interface Props {
  navigateToPreview: (type: string) => void;
  isShowPreviewModal: boolean;
  onClosePreviewModal: () => void;
}

export const PreviewModal = React.memo(function PreviewModal({
  navigateToPreview,
  isShowPreviewModal,
  onClosePreviewModal,
}: Props) {
  const [value, setValue] = React.useState<string>("whole-app");

  const onChangeHandler = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
      setValue(value);
    },
    []
  );

  return (
    <Modal
      open={isShowPreviewModal}
      onClose={onClosePreviewModal}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingX: 8,
      }}
    >
      <Container maxWidth="sm">
        <Stack
          direction="column"
          sx={{
            width: "100%",
            borderRadius: 4,
            backgroundColor: "white",
            paddingY: 4,
            paddingX: 4,
          }}
        >
          <Typography sx={{ fontSize: 20, marginBottom: 4, fontWeight: 500 }}>
            How would you like to preview the app ?
          </Typography>

          <FormControl>
            <FormLabel id="options-label">Pick one option:</FormLabel>
            <RadioGroup
              aria-labelledby="options-label"
              name="radio-options-group"
              value={value}
              onChange={onChangeHandler}
            >
              <FormControlLabel
                value="whole-app"
                control={<Radio />}
                label="I want to view the app as the whole unity"
              />
              <FormControlLabel
                value="per-page"
                control={<Radio />}
                label="I want to view the app per page"
              />
            </RadioGroup>
          </FormControl>

          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            marginTop={1}
          >
            <Button onClick={onClosePreviewModal} size="large">
              Cancel
            </Button>
            <Button
              size="large"
              variant="contained"
              onClick={() => navigateToPreview(value)}
            >
              Preview Now
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Modal>
  );
});
