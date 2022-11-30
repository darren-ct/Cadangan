import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import * as React from "react";

import type {
  DateTimeSubProps,
  FieldSubProps,
  NewRecordSubProps,
  OtherComponentSubProps,
  ParamSubProps,
  TableSubProps,
  TextContent,
  UserSubProps,
} from "@/features/editor";

import { MagicPill } from "./MagicPill";
import { MagicTextField } from "./MagicTextField";

interface Props {
  isNumber?: boolean;
  placeholder?: string;
  textContents: TextContent[];
  onAddClassicTextContent: (newContent: TextContent) => void;
  onClassicTextContentChange: (newText: string | number, id: string) => void;
  onDeleteTextContent: (id: string) => void;
}

export const MagicContainer = React.memo(function MagicContainer({
  placeholder,
  isNumber = false,
  textContents,
  onAddClassicTextContent,
  onClassicTextContentChange,
  onDeleteTextContent,
}: Props) {
  const onChangeHandler: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = React.useCallback(
    (e) => {
      const value = e.target.value;
      const newTextContent: TextContent = {
        id: Date.now().toString(),
        type: "CLASSIC",
        format: isNumber ? "NUMBER" : "STRING",
        subProps: {
          text: isNumber ? Number(value) : value,
        },
      };
      onAddClassicTextContent(newTextContent);
    },
    [isNumber, onAddClassicTextContent]
  );

  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      alignItems="center"
      sx={{ flex: 1, width: "100%" }}
    >
      {/* Contents */}
      {textContents?.map((content) => {
        if (content.type !== "CLASSIC") {
          return (
            <MagicPill
              key={content.id}
              id={content.id}
              title={
                (
                  content.subProps as
                    | DateTimeSubProps
                    | FieldSubProps
                    | TableSubProps
                    | UserSubProps
                    | OtherComponentSubProps
                    | NewRecordSubProps
                    | ParamSubProps
                )?.subType
              }
              onDeleteTextContent={onDeleteTextContent}
            />
          );
        } else {
          return (
            <MagicTextField
              isNumber={isNumber}
              key={content.id}
              item={content}
              onClassicTextContentChange={onClassicTextContentChange}
            />
          );
        }
      })}
      {/* Add new text content */}
      {!textContents ||
      textContents[textContents.length - 1]?.type !== "CLASSIC" ? (
        <TextField
          variant="standard"
          type={isNumber ? "number" : "text"}
          placeholder={
            placeholder ?? `Enter new ${isNumber ? "number" : "text"}`
          }
          inputProps={{ style: { fontSize: 12 } }}
          InputProps={{
            disableUnderline: true,
          }}
          sx={{
            background: "transparent",
            outline: "none",
            fontFamily: "sans-serif",
            marginLeft: 1,
            width: "100%",
          }}
          onChange={onChangeHandler}
        />
      ) : (
        <React.Fragment />
      )}
    </Stack>
  );
});
