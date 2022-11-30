import * as React from "react";

import { usePopover } from "@/hooks";
import { Field } from "@/widgets/types";

import { ClassicSubProps, TextContent } from "../../types";

interface Props {
  isNumber?: boolean;
  value: TextContent[];
  onChange: (value: TextContent[]) => void;
  field: Field;
}

export const useMagicFields = ({ value, onChange, field, isNumber }: Props) => {
  const memoizedValue = React.useMemo(() => {
    if (!value) {
      return field.defaultValue as TextContent[];
    }

    return value;
  }, [value, field.defaultValue]);

  const {
    anchorEl,
    onClosePopover: onClosePopOver,
    onOpenPopover: onOpenPopOver,
  } = usePopover();

  // Functions
  const onAddTextContent = React.useCallback(
    (newTextContent: TextContent | Record<string, unknown>) => {
      const newValues: TextContent[] = memoizedValue
        ? [...memoizedValue, newTextContent as TextContent]
        : [newTextContent as TextContent];

      onChange(newValues);
    },
    [memoizedValue, onChange]
  );

  const onDeleteTextContent = React.useCallback(
    (id: string) => {
      const newValue = memoizedValue.filter((item) => item.id !== id);
      onChange(newValue);
    },
    [onChange, memoizedValue]
  );

  const onClassicTextContentChange = React.useCallback(
    (newText: string | number, id: string) => {
      if (isNumber && isNaN(Number(newText))) {
        return;
      }

      const newValue = memoizedValue.map((item) => {
        if (item.id === id) {
          return { ...item, subProps: { text: newText } as ClassicSubProps };
        } else {
          return item;
        }
      });

      onChange(newValue as TextContent[]);
    },
    [isNumber, memoizedValue, onChange]
  );

  return {
    memoizedValue,
    anchorEl,
    onOpenPopOver,
    onClosePopOver,
    onAddTextContent,
    onDeleteTextContent,
    onClassicTextContentChange,
  };
};
