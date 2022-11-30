import { useRouter } from "next/router";
import * as React from "react";

import { usePreviewPageStore } from "@/features/preview";
import { getSDK } from "@/lib";
import type { ExplorerParams, SDKClient } from "@/types";

import {
  ClassicSubProps,
  DateTimeSubProps,
  NewRecordSubProps,
  OtherComponentSubProps,
  ParamSubProps,
  TableSubProps,
  TextContent,
  TextInputProps,
  UserSubProps,
} from "../../types";
import { useEditorDraggableStore } from "../useEditorDraggableStore";

export const useMagicResult = (
  contents?: TextContent[],
  isUppercase?: boolean
) => {
  const { draggables } = useEditorDraggableStore();
  const { loggedUser } = usePreviewPageStore();

  // SDK
  const router = useRouter();
  const { databaseId } = router.query as ExplorerParams;
  const sdk = React.useCallback((): void | Promise<SDKClient> => {
    if (!databaseId) {
      return;
    }

    return getSDK({ projectId: databaseId });
  }, [databaseId]);

  const [output, setOutput] = React.useState<string[]>([]);

  const stringifiedOutput = React.useMemo(() => {
    return output.join("    ");
  }, [output]);

  // Functions
  const getDateString = React.useCallback((textContent: TextContent) => {
    const subType = (textContent.subProps as DateTimeSubProps).subType;

    switch (subType) {
      case "NONE":
        return "";

      case "CURRENT_TIME":
        return new Date().toString();

      case "1_YEAR_AGO":
        return "A year ago";

      case "START_OF_TODAY":
        return `${new Date().getHours()} hours ago`;
    }
  }, []);

  const getUserString = React.useCallback(
    (textContent: TextContent) => {
      const subType = (textContent.subProps as UserSubProps).subType;

      switch (subType) {
        case "EMAIL":
          return loggedUser?.email ?? "Unknown Email";
          break;

        case "FIRST_NAME":
          return loggedUser?.firstName ?? "Unknown First Name";
          break;

        case "LAST_NAME":
          return loggedUser?.lastName ?? "Unknown Last Name";
          break;

        case "PHONE_NUMBER":
          return loggedUser?.phoneNumber ?? "Unknown Phone Number";
      }
    },
    [
      loggedUser?.email,
      loggedUser?.firstName,
      loggedUser?.lastName,
      loggedUser?.phoneNumber,
    ]
  );

  const getClassicString = React.useCallback((textContent: TextContent) => {
    return (textContent.subProps as ClassicSubProps).text;
  }, []);

  const getOtherComponentString = React.useCallback(
    (textContent: TextContent) => {
      return (
        (
          draggables?.filter(
            (draggable) =>
              draggable.id ===
              (textContent.subProps as OtherComponentSubProps)?.draggableId
          )[0]?.props as TextInputProps
        )?.value ?? ""
      );
    },
    [draggables]
  );

  const getParamValue = React.useCallback(
    (textContent: TextContent) => {
      return router.query[
        (textContent.subProps as ParamSubProps).stringifiedKey
      ];
    },
    [router.query]
  );

  // Main
  const getCombinedString = React.useCallback(
    async (textContents: TextContent[]) => {
      const connector = await sdk();
      if (!connector) {
        return;
      }

      let isNumberFormatted = false;

      const promisedTextContent = await Promise.all(
        textContents.map(async (text) => {
          if (text.format === "NUMBER") {
            isNumberFormatted = true;
          }

          try {
            if (text.type === "CLASSIC") {
              return getClassicString(text);
            } else if (text.type === "USER") {
              // if (isNumberFormatted) return;
              return getUserString(text);
            } else if (text.type === "DATE_TIME") {
              return getDateString(text);
            } else if (text.type === "OTHER_COMPONENTS") {
              return getOtherComponentString(text);
            } else if (text.type === "PARAM") {
              return getParamValue(text);
            } else if (text.type === "TABLE") {
              const { data, error } = await connector
                .service((text.subProps as TableSubProps).tableId)
                .count();

              if (error) {
                throw new Error(error.message);
              }
              return data.count;
            } else if (text.type === "NEW_RECORD") {
              const recordId = (text.subProps as NewRecordSubProps).recordId;
              const tableId = (text.subProps as NewRecordSubProps).tableId;
              const fieldName = (text.subProps as NewRecordSubProps).fieldName;

              if (recordId == "undefined" || !recordId) {
                return " ";
              }

              const { data, error } = await connector
                .service(tableId)
                .getById(recordId);

              if (error) {
                throw new Error(error.message);
              }

              return data[fieldName];
            }
          } catch (err) {
            console.log(err);
          }
        })
      );

      return isNumberFormatted
        ? Number(promisedTextContent.join(""))
        : promisedTextContent.join(" ");
    },
    [
      sdk,
      getClassicString,
      getUserString,
      getDateString,
      getOtherComponentString,
      getParamValue,
    ]
  ); // if you want string format

  const processStringify = React.useCallback(
    async (contents: TextContent[]) => {
      if (!contents || contents.length === 0) {
        return;
      }

      const newOutput = [];

      // INIT CONNECTOR
      const connector = await sdk();
      if (!connector) {
        return;
      }

      // PROCESS
      let i = 0;

      do {
        const textContent = contents[i];

        switch (textContent.type) {
          case "DATE_TIME":
            newOutput.push(getDateString(textContent));
            break;

          case "USER":
            newOutput.push(getUserString(textContent));
            break;

          case "CLASSIC":
            newOutput.push(getClassicString(textContent));
            break;

          case "OTHER_COMPONENTS":
            newOutput.push(getOtherComponentString(textContent));
            break;

          case "PARAM":
            newOutput.push(getParamValue(textContent));
            break;
        }

        if (textContent.type === "TABLE") {
          const { data, error } = await connector
            .service((textContent.subProps as TableSubProps).tableId)
            .count();

          if (error) {
            throw new Error(error.message);
          }

          const count = data.count;
          newOutput.push(count);
        }

        if (textContent.type === "NEW_RECORD") {
          const recordId = (textContent.subProps as NewRecordSubProps).recordId;
          const tableId = (textContent.subProps as NewRecordSubProps).tableId;
          const fieldName = (textContent.subProps as NewRecordSubProps)
            .fieldName;

          if (recordId == "undefined" || !recordId) {
            return " ";
          }

          const { data, error } = await connector
            .service(tableId)
            .getById(recordId);

          if (error) {
            throw new Error(error.message);
          }

          newOutput.push(data[fieldName]);
        }

        i++;
      } while (i < contents.length);

      setOutput(newOutput);
    },
    [
      sdk,
      getDateString,
      getUserString,
      getClassicString,
      getOtherComponentString,
      getParamValue,
    ]
  ); // if you want state format

  // useEffects
  React.useEffect(() => {
    if (contents) {
      processStringify(contents);
    }
  }, [contents, processStringify]);

  return {
    stringifiedOutput: isUppercase
      ? stringifiedOutput.toUpperCase()
      : stringifiedOutput,
    getCombinedString,
    getDateString,
    getUserString,
    getClassicString,
    getOtherComponentString,
    sdk,
  };
};
