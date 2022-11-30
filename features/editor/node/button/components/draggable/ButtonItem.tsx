import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type { ButtonProps, Draggable } from "@/features/editor";
import { IconDisplay, useMagicResult, useNodeAction } from "@/features/editor";

export const ButtonItem = React.memo(function ButtonItem({
  isDisabled = true,
  item,
}: {
  isDisabled?: boolean;
  item: Draggable;
}) {
  const props = React.useMemo(() => {
    return item.props as ButtonProps;
  }, [item.props]);

  const { stringifiedOutput } = useMagicResult(
    props?.content,
    props?.isUppercase
  );
  const { handleSubmit } = useNodeAction({ actions: props?.actions, item });

  const getBorderColor = React.useMemo(() => {
    if (!props) {
      return "#FFA500";
    }

    switch (props.type) {
      case "contained":
        return props.buttonColor ? props.buttonColor : "#FFA500";

      case "outlined":
        return props.buttonColor ? props.buttonColor : "#FFA500";

      case "text":
        return "transparent";

      default:
        return "#FFA500";
    }
  }, [props]);

  const getTextColor = React.useMemo(() => {
    if (!props) {
      return "#FFFFFF";
    }

    switch (props.type) {
      case "contained":
        return props.contentColor ? props.contentColor : "#FFFFFF";

      case "outlined":
        return props.buttonColor ? props.buttonColor : "#FFA500";

      case "text":
        return props.buttonColor ? props.buttonColor : "#FFA500";

      default:
        return "#FFFFFF";
    }
  }, [props]);

  const getBgColor = React.useMemo(() => {
    if (!props) {
      return "#FFA500";
    }

    switch (props.type) {
      case "contained":
        return props.buttonColor ? props.buttonColor : "#FFA500";

      case "outlined":
        return "transparent";

      case "text":
        return "transparent";

      default:
        return "#FFA500";
    }
  }, [props]);

  const renderItem = React.useMemo(() => {
    return (
      <Stack
        onClick={() => {
          if (isDisabled) {
            return;
          }
          handleSubmit();
        }}
        sx={{
          fontSize: "10px",
          display: "inline-flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          width: "100%",
          height: "100%",
          border: `1px solid ${getBorderColor}`,
          color: getTextColor,
          background: getBgColor,
          borderRadius: props ? props.rounding : 0,
          boxShadow: props?.isShadow ? "1px 1px 10px rgba(0,0,0,.2)" : null,
          padding: "8px 16px",
          overflow: "hidden",
          cursor: !isDisabled && "pointer",
        }}
      >
        {props?.icon && <IconDisplay name={props.icon} color={getTextColor} />}
        <Typography sx={{ marginLeft: props?.icon ? "8px" : 0 }}>
          {props?.content ? stringifiedOutput : "BUTTON"}{" "}
        </Typography>
      </Stack>
    );
  }, [
    getBorderColor,
    getTextColor,
    getBgColor,
    props,
    isDisabled,
    stringifiedOutput,
    handleSubmit,
  ]);

  return <React.Fragment>{renderItem}</React.Fragment>;
});
