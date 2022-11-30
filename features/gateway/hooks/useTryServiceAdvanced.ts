/* eslint-disable @typescript-eslint/ban-ts-comment */
import Axios from "axios";
import FormData from "form-data";
import { useRouter } from "next/router";
import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { useGetRecords } from "@/api";
import { useGetApiKeys } from "@/api/features/apiKeys/hooks/useGetApiKeys";
import { useCopy } from "@/hooks/useCopy";
import { usePrevious } from "@/hooks/usePrevious";
import { useStore } from "@/hooks/useStore";
import { axiosWithTime } from "@/lib";
import { AxiosMethod, Row } from "@/types";
import { getKeyValuePairs } from "@/utils/misc";
import { prettyJson } from "@/utils/string";

import type {
  FormTryServiceAdvanced,
  TryServiceAdvancedStates,
  TryServiceModeProps,
} from "../types";

export const useTryServiceAdvanced = ({
  database,
  service,
  method,
}: TryServiceModeProps) => {
  const router = useRouter();
  const { __gwurl } = router.query;
  const apiResponse = useStore((state) => state.apiResponse);
  const setApiResponse = useStore((state) => state.setApiResponse);
  const { isCopy, handleCopy } = useCopy();
  const methodId = method.id;
  const previousMethodId = usePrevious<string>(methodId);
  const [loadingSendRequest, setLoadingSendRequest] = React.useState(false);
  const [methodFormValues, setMethodFormValues] = React.useState<
    TryServiceAdvancedStates[]
  >([]);
  const databaseId = database?.id;

  const { data: apiKeysData } = useGetApiKeys({
    databaseId,
    enabled: !!databaseId,
  });

  const isGetRecordIsEnabled = Boolean(
    databaseId && methodId.includes("register") && service.properties?.tableId
  );
  const {
    data: dataRecords,
    isLoading: loadingGetRecords,
    refetch: refetchGetRecords,
  } = useGetRecords({
    customQueryName: "getRecordsTryService",
    dbId: databaseId,
    query: "",
    tableId: service.properties.tableId,
    enabled: isGetRecordIsEnabled,
  });

  const methods = useForm<FormTryServiceAdvanced>({
    defaultValues: {
      headers: [],
      advancedParams: [],
      body: {},
      advancedBody: "",
    },
  });
  const { control, handleSubmit, reset, setValue } = methods;
  const {
    fields: headersFields,
    append: appendHeader,
    remove: removeHeader,
  } = useFieldArray({ control, name: "headers" });
  const {
    fields: advancedParamsFields,
    append: appendAdvancedParam,
    remove: removeAdvancedParam,
  } = useFieldArray({ control, name: "advancedParams" });

  React.useEffect(() => {
    reset({ headers: [], advancedParams: [], body: {}, advancedBody: "" });
    setMethodFormValues([]);
    setApiResponse(null);
  }, [database?.projectUrl, reset, setApiResponse]);

  React.useEffect(() => {
    if (methodId) {
      if (methodId !== previousMethodId) {
        if (previousMethodId) {
          const newMethodFormValues = methodFormValues.slice();
          const methodIndex = methodFormValues.findIndex(
            (item) => item.id === previousMethodId
          );

          if (methodIndex > -1) {
            newMethodFormValues[methodIndex] = {
              id: previousMethodId,
              apiResponse,
              formData: { ...methods.getValues() },
            };
          } else {
            newMethodFormValues.push({
              id: previousMethodId,
              apiResponse,
              formData: { ...methods.getValues() },
            });
          }

          setMethodFormValues(newMethodFormValues);
        }

        const savedMethodFormValues = methodFormValues.find(
          (item) => item.id === methodId
        );

        if (savedMethodFormValues) {
          reset({ ...savedMethodFormValues.formData });
          setApiResponse(savedMethodFormValues.apiResponse);
        } else {
          reset({
            headers: [],
            advancedParams: [],
            body: {},
            advancedBody: "",
          });
          setApiResponse(null);
        }
      }
    }
  }, [
    apiResponse,
    methodFormValues,
    methodId,
    methods,
    previousMethodId,
    reset,
    setApiResponse,
  ]);

  const apiKey = React.useMemo(() => {
    if (apiKeysData?.length > 0) {
      return apiKeysData[0];
    }

    return null;
  }, [apiKeysData]);

  const queryURL = database?.projectUrl
    ? `${database.projectUrl}/api/v1`
    : __gwurl ?? (process.env.NEXT_PUBLIC_QUERY_URL as string);
  let responseURL = `${queryURL}/${apiKey?.token ?? ":apiKey"}`;
  const methodLabel = method.label;
  const methodType = method.type ?? "find";
  let methodPath = method.path ?? "/";

  if (methodPath === "/") {
    methodPath = "";
  }

  if (apiResponse?.responseURL) {
    responseURL = `${apiResponse.responseURL}`;
  } else if (method.isUser) {
    if (methodId.includes("User")) {
      responseURL = `${responseURL}/auth/user`;
    } else {
      const methodIdArray = methodId.split("-");
      methodIdArray.splice(0, 1);

      responseURL = `${responseURL}/auth/${methodIdArray.join("-")}`;
    }

    if (
      methodId.includes("reset-password") ||
      methodId.includes("verify-email")
    ) {
      responseURL = `${responseURL}/:token`;
    }
  } else if (method.isFile) {
    responseURL = `${responseURL}/storage`;

    if (methodLabel === "POST") {
      responseURL = `${responseURL}/upload`;
    } else if (methodLabel === "DELETE") {
      responseURL = `${responseURL}/:id`;
    }
  } else if (method.type === "external") {
    responseURL = `${responseURL}/${
      service.title?.[0]?.[0] ?? "Unknown Service"
    }${methodPath}`;
  } else {
    responseURL = `${responseURL}${methodPath}`;
  }

  const handleCopyResponseURL = React.useCallback(() => {
    handleCopy(responseURL);
  }, [handleCopy, responseURL]);

  const handleAddHeader = React.useCallback(() => {
    // @ts-ignore
    appendHeader({ key: undefined, value: undefined });
  }, [appendHeader]);

  const handleAddAdvancedParam = React.useCallback(() => {
    // @ts-ignore
    appendAdvancedParam({ key: undefined, value: undefined });
  }, [appendAdvancedParam]);

  const handleRemoveHeader = React.useCallback(
    (index: number) => {
      removeHeader(index);
    },
    [removeHeader]
  );

  const handleRemoveAdvancedParam = React.useCallback(
    (index: number) => {
      removeAdvancedParam(index);
    },
    [removeAdvancedParam]
  );

  const urlParams = React.useMemo(() => {
    if (method && method.type === "external") {
      const paths = method.path.split("/");

      const paramPaths = paths.filter((item) => item.startsWith(":"));

      return paramPaths.map((item) => item.replace(":", ""));
    }

    return [];
  }, [method]);

  const handleSendRequest = React.useCallback(
    async (data: FormTryServiceAdvanced) => {
      if (!apiKey?.token || !service.title?.[0]?.[0]) {
        return;
      }

      const getJsonBody = (body: string) => {
        try {
          return JSON.parse(body);
        } catch (error) {
          return null;
        }
      };

      try {
        setLoadingSendRequest(true);

        let url = `${queryURL}/${apiKey.token}`;

        if (method.isUser) {
          url = `${url}/auth`;

          if (
            (methodId.includes("reset-password") ||
              methodId.includes("verify-email")) &&
            data.body.token
          ) {
            url = `${url}${methodPath.replace(":token", data.body.token)}`;
            delete data.body.token;
          } else {
            url = `${url}${methodPath}`;
          }
        } else if (method.isFile) {
          url = `${url}/storage`;

          if (methodLabel === "DELETE" && data.body.id) {
            url = `${url}${methodPath.replace(":id", data.body.id)}`;
            delete data.body.id;
          } else {
            url = `${url}${methodPath}`;
          }
        } else if (method.type === "external") {
          if (urlParams.length > 0) {
            let params = methodPath;

            urlParams.forEach((item) => {
              params = params.replace(`:${item}`, data.body[item]);
            });

            url = `${url}/${service.title[0][0]}${params}`;
          } else {
            url = `${url}/${service.title[0][0]}${methodPath}`;
          }
        } else if (
          (methodLabel === "PATCH" ||
            methodLabel === "DELETE" ||
            methodLabel === "LINK" ||
            methodLabel === "UNLINK" ||
            methodType === "get") &&
          data.body.id
        ) {
          url = `${url}${methodPath.replace(":id", data.body.id)}`;
          delete data.body.id;
        } else {
          url = `${url}${methodPath}`;
        }

        let body = getJsonBody(data.advancedBody) ?? {};

        Object.keys(body).forEach((key) => {
          if (body[key] === undefined) {
            delete body[key];
          }
        });

        if (method.isFile && data.body.file?.[0]?.form) {
          body = data.body.file[0].form;
        }

        const response = await axiosWithTime({
          method: methodLabel as AxiosMethod,
          url,
          headers: getKeyValuePairs(data.headers),
          params: getKeyValuePairs(data.advancedParams),
          data: body,
        });
        type ResponseWithDuration = typeof response & { duration: number };
        const isFirstRegister =
          methodId.includes("register") && !dataRecords?.length;

        if (isFirstRegister) {
          refetchGetRecords();
        }

        setApiResponse({
          data: prettyJson(response.data),
          status: response.status,
          duration: (response as ResponseWithDuration).duration,
          responseURL: response.request?.responseURL,
        });
      } catch (error) {
        if (Axios.isAxiosError(error) && error.response) {
          type ErrorWithDuration = typeof error & { duration: number };

          setApiResponse({
            data: prettyJson(error.response.data),
            duration: (error as ErrorWithDuration).duration,
            responseURL: error.response.request?.responseURL,
            status: error.response.status,
          });
        }
      } finally {
        setLoadingSendRequest(false);
      }
    },
    [
      apiKey?.token,
      dataRecords?.length,
      method.isFile,
      method.isUser,
      method.type,
      methodId,
      methodLabel,
      methodPath,
      methodType,
      queryURL,
      refetchGetRecords,
      service.title,
      setApiResponse,
      urlParams,
    ]
  );

  const handleAttachFile = React.useCallback(
    (files: FileList, fieldName: string) => {
      const attachments = [];

      for (let i = 0; i < files.length; i++) {
        const form = new FormData();
        const file = files.item(i);

        if (!file) {
          continue;
        }

        form.append("file", file);
        attachments.push({ form, fileName: file.name });
      }

      setValue(`body.${fieldName}`, attachments);
    },
    [setValue]
  );

  const records = React.useMemo(() => {
    let data: Row[] = [];

    if (dataRecords) {
      data = dataRecords.slice(0);
    }

    return data;
  }, [dataRecords]);

  const loadingGet = loadingGetRecords && isGetRecordIsEnabled;

  return {
    advancedParamsFields,
    headersFields,
    isCopy,
    loadingGet,
    loadingSendRequest,
    methods,
    records,
    responseURL,
    urlParams,
    handleAddAdvancedParam,
    handleAddHeader,
    handleAttachFile,
    handleCopyResponseURL,
    handleRemoveAdvancedParam,
    handleRemoveHeader,
    handleSendRequest,
    handleSubmit,
  };
};
