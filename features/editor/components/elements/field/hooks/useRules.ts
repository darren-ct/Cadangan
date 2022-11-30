import * as React from "react";
import { Path, RegisterOptions } from "react-hook-form";

import type {
  Field,
  FieldOptionsCurrency,
  FieldOptionsLinkToRecord,
  FieldOptionsLongText,
  FieldOptionsNumber,
  FieldOptionsPercent,
  FieldOptionsSelect,
  FieldOptionsSingleText,
  LinkToRecordObjectInput,
} from "@/widgets/types";

export type RulesReturnType<T> = {
  rules: Omit<
    RegisterOptions<T, Path<T>>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
};

export const useRules = <T>(field: Field, name: string): RulesReturnType<T> => {
  const rules = React.useMemo(() => {
    // General
    const requiredRule = {
      required:
        field?.isRequired &&
        field?.type !== "rating" &&
        field?.type !== "checkBox"
          ? `${name} is required`
          : undefined,
    };

    const minLengthRule = {
      minLength:
        field?.type === "singleLineText"
          ? {
              value: (field.options as FieldOptionsSingleText)?.minChar,
              message: `Length cannot be less than ${
                (field.options as FieldOptionsSingleText)?.minChar
              }`,
            }
          : undefined,
    };

    const maxLengthRule = {
      maxLength: field?.type === "singleLineText" && {
        value: (field.options as FieldOptionsSingleText)?.maxChar,
        message: `Length cannot be more than ${
          (field?.options as FieldOptionsSingleText)?.maxChar
        }`,
      },
    };

    const maxRule = {
      max:
        field?.type === "number"
          ? {
              value: (field.options as FieldOptionsNumber)?.maxValue,
              message: `Value cannot be bigger than ${
                (field.options as FieldOptionsNumber)?.maxValue
              }`,
            }
          : field?.type === "currency"
          ? {
              value: (field.options as FieldOptionsCurrency)?.maxValue,
              message: `Value cannot be bigger than ${
                (field.options as FieldOptionsCurrency)?.maxValue
              }`,
            }
          : undefined,
    };

    const minRule = {
      min:
        field?.type === "number"
          ? {
              value: (field.options as FieldOptionsNumber)?.minValue,
              message: `Value cannot be smaller than ${
                (field.options as FieldOptionsNumber)?.minValue
              }`,
            }
          : field?.type === "currency"
          ? {
              value: (field.options as FieldOptionsCurrency)?.minValue,
              message: `Value cannot be smaller than ${
                (field.options as FieldOptionsCurrency)?.minValue
              }`,
            }
          : undefined,
    };

    return {
      ...requiredRule,
      ...minLengthRule,
      ...maxLengthRule,
      ...minRule,
      ...maxRule,
      validate:
        field?.type === "longText"
          ? {
              minimal: (value: string) => {
                if (value) {
                  const wordLength = value ? value.split(" ").length : 0;
                  const minimalRequirement = (
                    field.options as FieldOptionsLongText
                  )?.minWord;

                  const isTrue =
                    wordLength < minimalRequirement && minimalRequirement
                      ? false
                      : true;
                  return (
                    isTrue || `Input at least ${minimalRequirement} character`
                  );
                }
              },
              maximal: (value: string) => {
                if (value) {
                  const wordLength = value ? value.split(" ").length : 0;
                  const maximalRequirement = (
                    field.options as FieldOptionsLongText
                  )?.maxWord;

                  const isTrue =
                    wordLength > maximalRequirement && maximalRequirement
                      ? false
                      : true;
                  return (
                    isTrue ||
                    `Input less or equal to ${maximalRequirement} character`
                  );
                }
              },
            }
          : field?.type === "number"
          ? {
              isNumber: (value: number | string) => {
                const newValue: string = value && value.toString();

                if (newValue) {
                  const isNegative = (field.options as FieldOptionsNumber)
                    ?.negative;

                  if (!isNegative && newValue[0] === "-") {
                    return false || "Cannot use negative value";
                  }

                  switch ((field.options as FieldOptionsNumber)?.format) {
                    case "decimal":
                      if (isNaN(Number(newValue))) {
                        return false || "Invalid value";
                      }
                      break;

                    case "integer":
                      // Digit must 0-9
                      if (newValue.includes(".")) {
                        return false || "Invalid value, cannot accept decimal";
                      }

                      if (isNaN(Number(newValue)) && !/^\d+$/.test(newValue)) {
                        return false || "Invalid integer";
                      }
                      break;
                  }
                }
              },
            }
          : field?.type === "duration"
          ? {
              isDuration: (value: string | number) => {
                if (!value) return;
                if (isNaN(+value)) return false || "Invalid format";
              },
            }
          : field?.type === "currency" || field?.type === "percent"
          ? {
              isNumber: (value: number | string) => {
                const newValue: string = value && value.toString();

                if (newValue) {
                  const isNegative =
                    field?.type === "currency"
                      ? (field.options as FieldOptionsCurrency)
                          ?.allowNegativeNumber
                      : (field.options as FieldOptionsPercent)
                          ?.allowNegativeNumber;

                  if (!isNegative && newValue[0] === "-") {
                    return false || "Cannot use negative value";
                  }

                  if (isNaN(Number(newValue))) {
                    return false || "Invalid decimal";
                  }
                }
              },
            }
          : field?.type === "multiSelect"
          ? {
              isValid: (value: string[]) => {
                if (value) {
                  const min = (field.options as FieldOptionsSelect)
                    ?.minSelection;
                  const max = (field.options as FieldOptionsSelect)
                    ?.maxSelection;

                  if (value.length > max && max) {
                    return false || `You can pick maximal ${max} options`;
                  }

                  if (value.length < min && min) {
                    return false || `Pick at least ${min} options`;
                  }
                }
              },
            }
          : field?.type === "phoneNumber"
          ? {
              isNumber: (value: string) => {
                if (value) {
                  const numberedValue = Number(value);

                  if (isNaN(numberedValue)) {
                    return false || "Invalid number format";
                  }

                  if (value.length < 7) {
                    return false || "Input at least 7 digits number";
                  }

                  if (value.length > 15) {
                    return false || "Input less or equal to 15 digits number";
                  }
                }
              },
            }
          : field?.type === "email"
          ? {
              isEmail: (value: string) => {
                if (value) {
                  const isEmail =
                    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value); // eslint-disable-line

                  if (!isEmail) {
                    return false || "Invalid email format";
                  }
                }
              },
            }
          : field?.type === "date"
          ? {
              isDate: (value: Date) => {
                if (value) {
                  const parsedValue = new Date(value);
                  const isItNaN = isNaN(parsedValue.getDate());
                  if (isItNaN) {
                    return false || "Invalid date";
                  }
                }
              },
            }
          : field?.type === "linkToRecord"
          ? {
              isMultiple: (value: LinkToRecordObjectInput[]) => {
                const options = field?.options as FieldOptionsLinkToRecord;

                if (options?.relationship === "one" && value?.length > 1) {
                  return false || "Cannot link with more than 1 record";
                }
              },
            }
          : undefined,
    };
  }, [field, name]);

  return {
    rules: rules as unknown as Omit<
      RegisterOptions<T, Path<T>>,
      "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
    >,
  };
};
