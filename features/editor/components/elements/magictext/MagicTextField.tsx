import * as React from "react";

import { ClassicSubProps, TextContent } from "@/features/editor";

interface Props {
  item: TextContent;
  onClassicTextContentChange: (newText: string | number, id: string) => void;
  reference?: React.LegacyRef<HTMLInputElement>;
  isNumber?: boolean;
}

export const MagicTextField = React.memo(function MagicTextField({
  onClassicTextContentChange,
  item,
  isNumber,
}: Props) {
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    inputRef.current.focus();
  }, []);

  const onChangeHandler: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = React.useCallback(
    (e) => {
      const value = e.target.value;

      if (isNaN(Number(value)) && isNumber) {
        return;
      }

      onClassicTextContentChange(isNumber ? Number(value) : value, item?.id);
    },
    [isNumber, item?.id, onClassicTextContentChange]
  );

  return (
    <input
      type={isNumber ? "number" : "text"}
      ref={inputRef}
      onChange={onChangeHandler}
      style={{
        padding: "8px 8px",
        border: "none",
        fontFamily: "sans-serif",
        fontSize: "12px",
        width: "100%",
        outline: "none",
        background: "transparent",
      }}
      value={(item.subProps as ClassicSubProps).text}
    />
  );
});
