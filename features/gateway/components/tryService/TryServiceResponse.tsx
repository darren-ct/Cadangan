import { green } from "@mui/material/colors";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Scrollbars from "rc-scrollbars";
import * as React from "react";

import { useStore } from "@/hooks/useStore";

export const TryServiceResponse = () => {
  const apiResponse = useStore((state) => state.apiResponse);

  return (
    <Stack
      sx={{
        p: 2,
        overflow: "hidden",
      }}
      flex="1"
      spacing={2}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography fontWeight={500}>Response</Typography>
        {apiResponse?.status && (
          <Stack direction="row" flex="1" justifyContent="flex-end" spacing={1}>
            <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
              <Typography fontSize="0.875em">{"Status: "}</Typography>
              <Typography
                sx={{
                  color: green[500],
                }}
                fontSize="0.875em"
              >
                {apiResponse.status}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
              <Typography fontSize="0.875em">Time: </Typography>
              <Typography
                sx={{
                  color: green[500],
                }}
                fontSize="0.875em"
              >
                {apiResponse.duration} ms
              </Typography>
            </Stack>
          </Stack>
        )}
      </Stack>
      {apiResponse?.data ? (
        <Stack
          sx={(theme) => ({
            background: "white",
            border: `1px solid ${theme.palette.grey[600]}`,
            borderRadius: "10px",
            height: "100%",
            overflow: "auto",
            flex: 1,
          })}
        >
          <Scrollbars autoHide>
            <Typography
              sx={{
                fontFamily: "monospace, monospace",
                fontSize: "0.875em",
                p: 1,
                letterSpacing: "0px",
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
              }}
            >
              {apiResponse.data}
            </Typography>
          </Scrollbars>
        </Stack>
      ) : (
        <Typography fontSize="0.875em">Click Send to get a response</Typography>
      )}
    </Stack>
  );
};
