/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios from "axios";
import FormData from "form-data";
import { useRouter } from "next/router";
import qs from "qs";
import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { useGetDatabaseConfig, useGetFields, useGetRecords } from "@/api";
import { useGetApiKeys } from "@/api/features/apiKeys/hooks/useGetApiKeys";
import { useDisclose } from "@/hooks";
import { useAuthProjectStore } from "@/hooks/useAuthProjectStore";
import { useCopy } from "@/hooks/useCopy";
import { usePrevious } from "@/hooks/usePrevious";
import { useStore } from "@/hooks/useStore";
import { axiosWithTime } from "@/lib";
import {
  Authentication,
  AxiosMethod,
  Field,
  FieldOptionsLinkToRecord,
  FieldOptionsSelect,
  RoleType,
  Row,
  SelectOption,
} from "@/types";
import { getKeyValuePairs } from "@/utils/misc";
import { prettyJson } from "@/utils/string";
import { dayjs } from "@/utils/time";

import {
  Condition,
  DateTimeMode,
  FormTryServiceSimple,
  InputType,
  LookupOption,
  QueryFieldType,
  SortCondition,
  TryServiceModeProps,
  TryServiceSimpleStates,
} from "../types";

const equalityConditions: Condition[] = [
  {
    id: "1",
    name: "equal",
  },
  {
    id: "2",
    name: "not equal",
    qs: "$ne",
  },
];
const containConditions: Condition[] = [
  {
    id: "3",
    name: "contains",
    qs: "$contains",
  },
  {
    id: "4",
    name: "not contains",
    qs: "$notContains",
  },
];
// const includeConditions: Condition[] = [
//   {
//     id: "5",
//     name: "include",
//     qs: "$in",
//   },
//   {
//     id: "6",
//     name: "not include",
//     qs: "$nin",
//   },
// ];
const numericConditions: Condition[] = [
  {
    id: "7",
    name: "greater than",
    qs: "$gt",
  },
  {
    id: "8",
    name: "greater than equal",
    qs: "$gte",
  },
  {
    id: "9",
    name: "lower than",
    qs: "$lt",
  },
  {
    id: "10",
    name: "lower than equal",
    qs: "$lte",
  },
];
const sortConditions: SortCondition[] = [
  {
    id: "1",
    name: "ascending",
  },
  {
    id: "2",
    name: "descending",
  },
];
const inputType: InputType = {
  stringInput: ["email", "username", "phoneNumber", "singleLineText", "url"],
  numberInput: ["number", "currency", "percent"],
  unsupportedInput: [
    "autoNumber",
    "barcode",
    "collaborator",
    "count",
    "lookup",
    "formula",
  ],
  automatedInput: ["createdAt", "createdBy", "updatedAt", "updatedBy"],
};

export const useTryServiceSimple = ({
  database,
  service,
  method,
}: TryServiceModeProps) => {
  const router = useRouter();
  const { __gwurl } = router.query;
  const apiResponse = useStore((state) => state.apiResponse);
  const setApiResponse = useStore((state) => state.setApiResponse);
  const addTryBlockAuth = useAuthProjectStore((state) => state.addTryBlockAuth);
  const removeTryBlockAuth = useAuthProjectStore(
    (state) => state.removeTryBlockAuth
  );
  const databaseId = database?.id;
  const auths = useAuthProjectStore(
    (state) =>
      state.authProjects.find((item) => item.projectId === databaseId)
        ?.authentications ?? []
  );
  const {
    isOpen: isListAuthsOpen,
    onOpen: onOpenListAuths,
    onClose: onCloseListAuths,
  } = useDisclose();
  const {
    isOpen: isLinkToRecordOpen,
    onOpen: onOpenLinkToRecord,
    onClose: onCloseLinkToRecord,
  } = useDisclose();
  const { isCopy, handleCopy } = useCopy();
  const methodId = method.id;
  const previousMethodId = usePrevious<string>(methodId);
  const [loadingSendRequest, setLoadingSendRequest] = React.useState(false);
  const [selectedParamIndex, setSelectedParamIndex] = React.useState(0);
  const [selectedSortIndex, setSelectedSortIndex] = React.useState(0);
  const [selectedOptionValue, setSelectedOptionValue] =
    React.useState<SelectOption[]>();
  const [selectedOptionFieldName, setSelectedOptionFieldName] =
    React.useState("");
  const [recordRelation, setRecordRelation] = React.useState("one");
  const [foreignProjectId, setForeignProjectId] = React.useState<string>();
  const [foreignTableId, setForeignTableId] = React.useState<string>();
  const [searchRecord, setSearchRecord] = React.useState("");
  const [selectedAuth, setSelectedAuth] = React.useState<Authentication>({
    identity: "Public",
    token: "",
  });
  const [searchAuth, setSearchAuth] = React.useState("");
  const [autoLookup, setAutoLookup] = React.useState(true);
  const [selectedLinkFieldName, setSelectedLinkFieldName] = React.useState("");
  const [lookupOption, setLookupOption] = React.useState<LookupOption>("all");
  const [methodFormValues, setMethodFormValues] = React.useState<
    TryServiceSimpleStates[]
  >([]);

  const { data: apiKeysData } = useGetApiKeys({
    databaseId,
    enabled: !!databaseId,
  });

  const isGetFieldEnabled = Boolean(
    databaseId && method.label !== "DELETE" && service.properties?.tableId
  );
  const { data: dataFields, isLoading: loadingFields } = useGetFields({
    dbId: databaseId,
    tableId: service?.properties?.tableId ?? "",
    enabled: isGetFieldEnabled,
  });
  const loadingGetFields = loadingFields && isGetFieldEnabled;

  const { data: dataDatabaseConfig, isLoading: loadingDatabaseConfig } =
    useGetDatabaseConfig({ databaseId, enabled: !!databaseId });
  const loadingGetDatabaseConfig = loadingDatabaseConfig && !!databaseId;

  const isGetRecordIsEnabled = Boolean(
    databaseId && methodId.includes("register") && service.properties?.tableId
  );
  const {
    data: dataRecords,
    isLoading: loadingRecords,
    refetch: refetchGetRecords,
  } = useGetRecords({
    customQueryName: "getRecordsTryService",
    dbId: databaseId,
    query: "",
    tableId: service.properties.tableId,
    enabled: isGetRecordIsEnabled,
  });
  const loadingGetRecords = loadingRecords && isGetRecordIsEnabled;

  const isGetForeignFieldsEnabled = Boolean(foreignProjectId && foreignTableId);
  const {
    data: dataForeignFields,
    isLoading: loadingForeignFields,
    refetch: refetchGetForeignFields,
  } = useGetFields({
    dbId: foreignProjectId,
    tableId: foreignTableId,
    enabled: isGetForeignFieldsEnabled,
  });
  const loadingGetForeignFields =
    isGetForeignFieldsEnabled && loadingForeignFields;

  const isGetLinkToRecordIsEnabled = Boolean(
    foreignProjectId && foreignTableId
  );
  const {
    data: dataLinkToRecords,
    isLoading: loadingLinkToRecords,
    refetch: refetchGetLinkToRecords,
  } = useGetRecords({
    customQueryName: "getRecordsTryService",
    dbId: foreignProjectId,
    query: "",
    tableId: foreignTableId,
    enabled: isGetLinkToRecordIsEnabled,
  });
  const loadingGetLinkToRecords =
    loadingLinkToRecords && isGetLinkToRecordIsEnabled;

  // TODO: add yup validation
  const methods = useForm<FormTryServiceSimple>({
    defaultValues: {
      params: [],
      selectedFields: [],
      selectedConditions: [],
      selectedLinkRecordBody: {},
      selectedLinkRecordBodyPrimary: {},
      body: {},
      sorts: [],
      selectedSortFields: [],
      selectedSortConditions: [],
      pagination: {
        limit: undefined,
        skip: undefined,
      },
      lookups: [],
      selects: [],
      selectedLinkRecordParams: [],
      selectedLinkRecordParamsPrimary: [],
    },
  });
  const { control, getValues, handleSubmit, reset, setValue } = methods;
  const {
    fields: paramsFields,
    append: appendParam,
    update: updateParam,
    remove: removeParam,
  } = useFieldArray({ control, name: "params" });
  const {
    fields: selectedFields,
    append: appendSelectedField,
    update: updateSelectedField,
    remove: removeSelectedField,
  } = useFieldArray({ control, name: "selectedFields", keyName: "formId" });

  const {
    fields: selectedConditions,
    append: appendSelectedCondition,
    update: updateSelectedCondition,
    remove: removeSelectedCondition,
  } = useFieldArray({ control, name: "selectedConditions", keyName: "formId" });
  const {
    fields: sortsFields,
    append: appendSort,
    update: updateSort,
    remove: removeSort,
  } = useFieldArray({ control, name: "sorts" });
  const {
    fields: selectedSortFields,
    append: appendSelectedSortField,
    update: updateSelectedSortField,
    remove: removeSelectedSortField,
  } = useFieldArray({ control, name: "selectedSortFields", keyName: "formId" });
  const {
    fields: selectedSortConditions,
    update: updateSelectedSortCondition,
    remove: removeSelectedSortCondition,
  } = useFieldArray({
    control,
    name: "selectedSortConditions",
    keyName: "formId",
  });

  let primaryFieldName = "Unknown Field";

  if (dataForeignFields) {
    const primaryField = dataForeignFields.find((item) => item.isPrimary);

    if (primaryField) {
      primaryFieldName = primaryField.name;
    }
  }

  React.useEffect(() => {
    reset({
      params: [],
      selectedFields: [],
      selectedConditions: [],
      selectedLinkRecordBody: {},
      selectedLinkRecordBodyPrimary: {},
      body: {},
      sorts: [],
      selectedSortFields: [],
      selectedSortConditions: [],
      pagination: {
        limit: undefined,
        skip: undefined,
      },
      lookups: [],
      selects: [],
      selectedLinkRecordParams: [],
      selectedLinkRecordParamsPrimary: [],
    });
    setSelectedLinkFieldName("");
    setMethodFormValues([]);
    setApiResponse(null);
  }, [database.projectUrl, reset, setApiResponse]);

  React.useEffect(() => {
    if (
      auths &&
      selectedAuth.identity !== "Public" &&
      !auths.find((item) => item.token === selectedAuth.token)
    ) {
      setSelectedAuth({ identity: "Public", token: "" });
    }
  }, [auths, selectedAuth.identity, selectedAuth.token]);

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
  } else {
    responseURL = `${responseURL}${methodPath}`;
  }

  const handleCopyResponseURL = React.useCallback(() => {
    handleCopy(responseURL);
  }, [handleCopy, responseURL]);

  const handleOpenListAuths = React.useCallback(() => {
    onOpenListAuths();
  }, [onOpenListAuths]);

  const handleAddParam = React.useCallback(() => {
    appendSelectedCondition({ id: "1", name: "equal" });

    if (dataFields?.[0] && !selectedFields.length) {
      appendSelectedField({ ...dataFields[0] });
      // @ts-ignore
      appendParam({ key: dataFields[0].name, value: undefined });
    } else {
      // @ts-ignore
      appendSelectedField({ name: undefined });
      // @ts-ignore
      appendParam({ key: undefined, value: undefined });
    }
  }, [
    appendParam,
    appendSelectedCondition,
    appendSelectedField,
    dataFields,
    selectedFields.length,
  ]);

  const handleRemoveParam = React.useCallback(
    (index: number) => {
      removeSelectedField(index);
      removeSelectedCondition(index);
      removeParam(index);
      setValue(`selectedLinkRecordParams.${index}`, undefined);
      setValue(`selectedLinkRecordParamsPrimary.${index}`, undefined);
    },
    [removeParam, removeSelectedCondition, removeSelectedField, setValue]
  );

  const handleOpenParam = React.useCallback((index: number) => {
    setSelectedParamIndex(index);
  }, []);

  const handleSelectField = React.useCallback(
    (field: Field) => {
      updateSelectedField(selectedParamIndex, field);

      const condition = getValues(`selectedConditions.${selectedParamIndex}`);

      if (condition) {
        // @ts-ignore
        updateParam(selectedParamIndex, {
          key: field.name,
          value: undefined,
          qs: condition.qs,
        });
      }

      setValue(`selectedLinkRecordParams.${selectedParamIndex}`, undefined);
      setValue(
        `selectedLinkRecordParamsPrimary.${selectedParamIndex}`,
        undefined
      );
    },
    [getValues, selectedParamIndex, setValue, updateParam, updateSelectedField]
  );

  const handleSelectCondition = React.useCallback(
    (condition: Condition) => {
      updateSelectedCondition(selectedParamIndex, condition);

      const key = getValues(`selectedFields.${selectedParamIndex}.name`);
      const value = getValues(`params.${selectedParamIndex}.value`);

      if (key) {
        updateParam(selectedParamIndex, { key, value, qs: condition.qs });
      }
    },
    [getValues, selectedParamIndex, updateParam, updateSelectedCondition]
  );

  const handleAddSort = React.useCallback(() => {
    // @ts-ignore
    appendSelectedSortField({ name: undefined });
    // @ts-ignore
    appendSort({ key: undefined, value: undefined });
  }, [appendSelectedSortField, appendSort]);

  const handleRemoveSort = React.useCallback(
    (index: number) => {
      removeSelectedSortField(index);
      removeSelectedSortCondition(index);
      removeSort(index);
    },
    [removeSelectedSortCondition, removeSelectedSortField, removeSort]
  );

  const handleOpenSort = React.useCallback((index: number) => {
    setSelectedSortIndex(index);
  }, []);

  const handleSelectSortField = React.useCallback(
    (field: Field) => {
      updateSelectedSortField(selectedSortIndex, field);
      // @ts-ignore
      updateSort(selectedSortIndex, {
        key: `$sort[${field.name}]`,
        value: undefined,
      });
    },
    [selectedSortIndex, updateSelectedSortField, updateSort]
  );

  const handleSelectSortCondition = React.useCallback(
    (condition: SortCondition) => {
      updateSelectedSortCondition(selectedSortIndex, condition);

      const key = getValues(`sorts.${selectedSortIndex}.key`);

      if (key) {
        updateSort(selectedSortIndex, {
          key,
          value: condition.name === "ascending" ? 1 : -1,
        });
      }
    },
    [getValues, selectedSortIndex, updateSelectedSortCondition, updateSort]
  );

  const userIdentityField = dataDatabaseConfig?.userIdentityField ?? "email";

  const fields = React.useMemo(() => {
    let data: Field[] = [];

    if (dataFields) {
      if (
        methodId.includes("login/google") ||
        methodId.includes("login/facebook")
      ) {
        const firstNameField = dataFields.find(
          (item) => item.name === "firstName"
        );

        if (firstNameField) {
          data = [
            { ...firstNameField, id: "token", name: "token", type: "longText" },
          ];
        }
      } else if (
        methodId.includes("refresh-token") ||
        methodId.includes("revoke-refresh-token")
      ) {
        const firstNameField = dataFields.find(
          (item) => item.name === "firstName"
        );

        if (firstNameField) {
          data = [{ ...firstNameField, id: "token", name: "token" }];
        }
      } else if (methodId.includes("change-password")) {
        const passwordField = dataFields.find(
          (item) => item.name === "password"
        );

        if (passwordField) {
          data = [
            { ...passwordField, id: "oldPassword", name: "oldPassword" },
            { ...passwordField, id: "newPassword", name: "newPassword" },
          ];
        }
      } else if (methodId.includes("reset-password")) {
        const passwordField = dataFields.find(
          (item) => item.name === "password"
        );

        if (passwordField) {
          data = [{ ...passwordField, id: "newPassword", name: "newPassword" }];
        }
      } else {
        data = dataFields.filter((item) => {
          const ignoreFieldsMethods = [
            "logout",
            "verify-token",
            "verify-email",
            "resend-email-verification",
          ];
          const ignoreFieldsMethodIdx = ignoreFieldsMethods.findIndex((entry) =>
            methodId.includes(entry)
          );

          if (ignoreFieldsMethodIdx !== -1) {
            return false;
          }

          if (methodId.includes("register")) {
            const blacklist = ["isEmailVerified", "role"];

            if (blacklist.includes(item.name)) {
              return false;
            }
          } else if (methodId.includes("login")) {
            const whitelist = [userIdentityField, "password"];

            if (!whitelist.includes(item.name)) {
              return false;
            }
          } else if (methodId.includes("forget-password")) {
            const whitelist = ["email"];

            if (!whitelist.includes(item.name)) {
              return false;
            }
          } else if (methodId.includes("User")) {
            const blacklist = ["email", "password", "isEmailVerified", "role"];

            if (blacklist.includes(item.name)) {
              return false;
            }
          }

          return true;
        });
      }
    }

    if (methodId.includes("login") && userIdentityField !== "email") {
      const sortList = [userIdentityField, "password"];

      data = data.sort(
        (a, b) => sortList.indexOf(a.name) - sortList.indexOf(b.name)
      );
    }

    return data;
  }, [dataFields, methodId, userIdentityField]);

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
              selectedLinkFieldName,
            };
          } else {
            newMethodFormValues.push({
              id: previousMethodId,
              apiResponse,
              formData: { ...methods.getValues() },
              selectedLinkFieldName,
            });
          }

          setMethodFormValues(newMethodFormValues);
        }

        const savedMethodFormValues = methodFormValues.find(
          (item) => item.id === methodId
        );

        if (savedMethodFormValues) {
          reset({ ...savedMethodFormValues.formData });
          setSelectedLinkFieldName(savedMethodFormValues.selectedLinkFieldName);
          setApiResponse(savedMethodFormValues.apiResponse);
        } else {
          const bodyData: any = {};

          fields.forEach((item) => {
            bodyData[item.name] = undefined;
          });
          reset({
            params: [],
            selectedFields: [],
            selectedConditions: [],
            selectedLinkRecordBody: {},
            selectedLinkRecordBodyPrimary: {},
            body: bodyData,
            sorts: [],
            selectedSortFields: [],
            selectedSortConditions: [],
            pagination: {
              limit: undefined,
              skip: undefined,
            },
            lookups: [],
            selects: [],
            selectedLinkRecordParams: [],
            selectedLinkRecordParamsPrimary: [],
          });
          setSelectedLinkFieldName("");
          setApiResponse(null);
        }
      }
    }
  }, [
    apiResponse,
    fields,
    methodFormValues,
    methodId,
    methods,
    previousMethodId,
    reset,
    selectedLinkFieldName,
    setApiResponse,
  ]);

  const lookupFields = React.useMemo(() => {
    return fields.filter((item) => item.type === "linkToRecord");
  }, [fields]);

  const selectFields = React.useMemo(() => {
    return fields.filter((item) => item.type !== "linkToRecord");
  }, [fields]);

  const handleSendRequest = React.useCallback(
    async (data: FormTryServiceSimple) => {
      if (!databaseId || !apiKey?.token || !service.title?.[0]?.[0]) {
        return;
      }

      try {
        setLoadingSendRequest(true);

        let body = { ...data.body };
        let url = `${queryURL}/${apiKey.token}`;

        if (method.isUser) {
          url = `${url}/auth`;

          if (
            (methodId.includes("reset-password") ||
              methodId.includes("verify-email")) &&
            body.token
          ) {
            url = `${url}${methodPath.replace(":token", body.token)}`;
            delete body.token;
          } else {
            url = `${url}${methodPath}`;
          }
        } else if (method.isFile) {
          url = `${url}/storage`;

          if (methodLabel === "DELETE" && body.id) {
            url = `${url}${methodPath.replace(":id", body.id)}`;
            delete body.id;
          } else {
            url = `${url}${methodPath}`;
          }
        } else if (
          (methodLabel === "PATCH" ||
            methodLabel === "DELETE" ||
            methodLabel === "LINK" ||
            methodLabel === "UNLINK" ||
            methodType === "get") &&
          body.id
        ) {
          url = `${url}${methodPath.replace(":id", body.id)}`;
          delete body.id;
        } else {
          url = `${url}${methodPath}`;
        }

        let headers = {};

        if (selectedAuth.identity !== "Public") {
          headers = { authorization: `Bearer ${selectedAuth.token}` };
        }

        if (!method.isFile) {
          const arrKeys = Object.keys(body);

          for (let i = 0; i < arrKeys.length; i++) {
            const key = arrKeys[i];

            if (!key) {
              continue;
            }

            const item = body[key];

            if (Array.isArray(item)) {
              if (item[0]?.form) {
                const uploadedFiles = await Promise.all(
                  item.map((entry) =>
                    axiosWithTime.post(
                      `${queryURL}/${apiKey.token}/storage/upload`,
                      entry.form,
                      { headers }
                    )
                  )
                );

                body[key] = uploadedFiles.map((entry) => {
                  const { fileName, url: fileUrl } = entry.data;

                  return { fileName, url: fileUrl };
                });
              } else {
                body[key] = item.map(
                  (entry) => (entry as SelectOption).id ?? entry
                );
              }
            } else if (typeof item === "object") {
              body[key] = (item as SelectOption).id ?? item;
            } else if (item === undefined) {
              delete body[key];
            }
          }
        } else if (body.file?.[0]?.form) {
          body = body.file[0].form;
        }

        let lookupParams = {};
        let selectParams = {};
        let limitParam = {};
        let skipParam = {};

        if (methodLabel === "GET" && !method.isFile && methodType !== "count") {
          if (lookupFields.length > 0) {
            let lookupKey = "$lookup";

            if (lookupOption === "id") {
              lookupKey = "$lookup[_id]";
            }

            if (autoLookup) {
              lookupParams = { [lookupKey]: "*" };
            } else {
              const lookupNames = data.lookups.map((item) => item.name);

              if (lookupNames.length > 0) {
                lookupParams = { [lookupKey]: lookupNames };
              }
            }
          }

          if (!method.isUser) {
            const selectNames = data.selects.map((item) => item.name);

            if (selectNames.length > 0) {
              selectParams = { $select: selectNames };
            }

            if (methodType !== "get") {
              const { limit, skip } = data.pagination;

              if (limit) {
                limitParam = { $limit: limit };
              }

              if (skip) {
                skipParam = { $skip: skip };
              }
            }
          }
        }

        const params = data.params.map((item) => {
          let { value } = item;

          if (Array.isArray(value)) {
            value = value.map(
              (entry) => (entry as SelectOption).value ?? entry
            );
          }

          if (typeof value === "object") {
            value = (value as SelectOption).value ?? value;
          }

          return {
            ...item,
            value: item.qs ? { [item.qs]: value } : value,
          };
        });

        const response = await axiosWithTime({
          method: methodLabel as AxiosMethod,
          url,
          headers,
          params: {
            ...lookupParams,
            ...selectParams,
            ...getKeyValuePairs(params, true),
            ...getKeyValuePairs(data.sorts),
            ...limitParam,
            ...skipParam,
          },
          paramsSerializer: (paramsObj) => {
            return qs.stringify(paramsObj, { encode: false });
          },
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

        if (methodId.includes("register") || methodId.includes("login")) {
          addTryBlockAuth({
            projectId: databaseId,
            auth: {
              token: response.data.token,
              identity: response.data.user[userIdentityField],
            },
          });
          setSelectedAuth({
            identity: response.data.user[userIdentityField],
            token: response.data.token,
          });
        } else if (
          methodId.includes("logout") ||
          methodId.includes("change-password")
        ) {
          const authToken =
            selectedAuth.identity !== "Public" ? selectedAuth.token : null;

          if (authToken) {
            removeTryBlockAuth({ projectId: databaseId, token: authToken });
            setSelectedAuth({ identity: "Public", token: null });
          }
        }
      } catch (error) {
        if (Axios.isAxiosError(error) && error.response) {
          type ErrorWithDuration = typeof error & { duration: number };

          setApiResponse({
            data: prettyJson(error.response.data),
            status: error.response.status,
            duration: (error as ErrorWithDuration).duration,
            responseURL: error.response.request?.responseURL,
          });
        }
      } finally {
        setLoadingSendRequest(false);
      }
    },
    [
      databaseId,
      apiKey,
      service,
      queryURL,
      method,
      methodLabel,
      methodType,
      selectedAuth,
      methodId,
      dataRecords,
      setApiResponse,
      methodPath,
      lookupFields,
      lookupOption,
      autoLookup,
      refetchGetRecords,
      addTryBlockAuth,
      userIdentityField,
      removeTryBlockAuth,
    ]
  );

  const handleShowSelectOption = React.useCallback(
    (field: Field, index?: number) => {
      if (field.options) {
        setSelectedOptionValue((field.options as FieldOptionsSelect).options);
      }

      setSelectedOptionFieldName(field.name);

      if (method.label === "GET" && index !== undefined) {
        setSelectedParamIndex(index);
      }
    },
    [method?.label]
  );

  const handleSelectOption = React.useCallback(
    (option: SelectOption, isMultiSelect: boolean) => {
      let value: SelectOption | SelectOption[] = option;

      if (isMultiSelect) {
        const options = getValues(
          method?.label === "GET"
            ? `params.${selectedParamIndex}.value`
            : `body.${selectedOptionFieldName}`
        ) as SelectOption[] | undefined;

        value = [option];

        if (options && options.length > 0) {
          const selectedIdx = options.findIndex(
            (item) => item.value === option.value
          );

          if (selectedIdx !== -1) {
            options.splice(selectedIdx, 1);
            value = [...options];
          } else {
            value = [...options, option];
          }
        }
      }

      if (method.label === "GET") {
        const key = getValues(`params.${selectedParamIndex}.key`);

        if (key) {
          updateParam(selectedParamIndex, { key, value });
        }
      } else {
        setValue(`body.${selectedOptionFieldName}`, value);
      }
    },
    [
      getValues,
      method.label,
      selectedOptionFieldName,
      selectedParamIndex,
      setValue,
      updateParam,
    ]
  );

  const handleShowDatePicker = React.useCallback(
    (fieldName: string, index?: number) => {
      if (method.label === "GET" && index !== undefined) {
        setSelectedParamIndex(index);
      }

      setSelectedOptionFieldName(fieldName);
    },
    [method.label]
  );

  const handleSelectDate = React.useCallback(
    (date: Date, mode: DateTimeMode) => {
      if (method.label === "GET") {
        const key = getValues(`params.${selectedParamIndex}.key`);

        if (key) {
          updateParam(selectedParamIndex, {
            key,
            value:
              mode === "date"
                ? dayjs(date).format("YYYY-MM-DD")
                : dayjs(date).toISOString(),
          });
        }
      } else {
        setValue(
          `body.${selectedOptionFieldName}`,
          mode === "date"
            ? dayjs(date).format("YYYY-MM-DD")
            : dayjs(date).toISOString()
        );
      }
    },
    [
      getValues,
      method.label,
      selectedOptionFieldName,
      selectedParamIndex,
      setValue,
      updateParam,
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

  const handleShowLinkToRecord = React.useCallback(
    (field: Field, index?: number) => {
      if (method.label === "GET" && index !== undefined) {
        setSelectedParamIndex(index);
      }

      const {
        foreignProjectId: selectedForeignProjectId,
        foreignTableId: selectedForeignTableId,
        relationship,
      } = field.options as FieldOptionsLinkToRecord;

      setSelectedOptionFieldName(field.name);
      setRecordRelation(relationship);
      setForeignProjectId(selectedForeignProjectId);
      setForeignTableId(selectedForeignTableId);
    },
    [method.label]
  );

  const handleSelectLinkToRecord = React.useCallback(
    (record: Row) => {
      const recordOptions =
        method.label === "GET"
          ? getValues(`params.${selectedParamIndex}.value`)
          : getValues(`body.${selectedOptionFieldName}`);
      const linkRecordOptions =
        method.label === "GET"
          ? getValues(`selectedLinkRecordParams.${selectedParamIndex}`)
          : getValues(`selectedLinkRecordBody.${selectedOptionFieldName}`);
      let listRecordIds = [record._id];
      let listRecords = [record];

      if (
        recordRelation === "many" &&
        Array.isArray(recordOptions) &&
        recordOptions.length > 0
      ) {
        const recordIdx = recordOptions.findIndex(
          (item) => item === record._id
        );

        if (recordIdx !== -1) {
          recordOptions.splice(recordIdx, 1);
          listRecordIds = [...recordOptions];
          linkRecordOptions.splice(recordIdx, 1);
          listRecords = [...linkRecordOptions];
        } else {
          listRecordIds = [...recordOptions, record._id];
          listRecords = [...linkRecordOptions, record];
        }
      }

      if (method.label === "GET") {
        const key = getValues(`params.${selectedParamIndex}.key`);

        if (key) {
          updateParam(selectedParamIndex, {
            key,
            // @ts-ignore
            value: recordRelation === "many" ? listRecordIds : listRecordIds[0],
          });
        }

        setValue(`selectedLinkRecordParams.${selectedParamIndex}`, listRecords);
        setValue(
          `selectedLinkRecordParamsPrimary.${selectedParamIndex}`,
          primaryFieldName
        );
      } else {
        setValue(`body.${selectedOptionFieldName}`, listRecordIds);
        setValue(
          `selectedLinkRecordBody.${selectedOptionFieldName}`,
          listRecords
        );
        setValue(
          `selectedLinkRecordBodyPrimary.${selectedOptionFieldName}`,
          primaryFieldName
        );
      }
    },
    [
      getValues,
      method.label,
      primaryFieldName,
      recordRelation,
      selectedOptionFieldName,
      selectedParamIndex,
      setValue,
      updateParam,
    ]
  );

  const handleSearchRecord = React.useCallback((text: string) => {
    setSearchRecord(text);
  }, []);

  const handleSelectAuth = React.useCallback(
    (auth: Authentication) => {
      setSelectedAuth(auth);
      onCloseListAuths();
    },
    [onCloseListAuths]
  );

  const handleSearchAuth = React.useCallback((text: string) => {
    setSearchAuth(text);
  }, []);

  const handleSelectQueryField = React.useCallback(
    (field: Field, type: QueryFieldType) => {
      const queryFields =
        type === "lookup" ? getValues("lookups") : getValues("selects");
      let value = [field];

      if (queryFields.length > 0) {
        const selectedIdx = queryFields.findIndex(
          (item) => item.name === field.name
        );

        if (selectedIdx !== -1) {
          queryFields.splice(selectedIdx, 1);
          value = [...queryFields];
        } else {
          value = [...queryFields, field];
        }
      }

      setValue(type === "lookup" ? "lookups" : "selects", value);
    },
    [getValues, setValue]
  );

  const handleToggleAutoLookup = React.useCallback(() => {
    setAutoLookup((prev) => !prev);
  }, []);

  const handleSelectLinkField = React.useCallback(
    (field: Field) => {
      const {
        foreignProjectId: selectedForeignProjectId,
        foreignTableId: selectedForeignTableId,
      } = field.options as FieldOptionsLinkToRecord;

      setValue(`selectedLinkRecordBody.${selectedLinkFieldName}`, undefined);
      setSelectedLinkFieldName(field.name);
      setForeignProjectId(selectedForeignProjectId);
      setForeignTableId(selectedForeignTableId);
    },
    [selectedLinkFieldName, setValue]
  );

  const handleShowLinkRecord = React.useCallback(() => {
    refetchGetForeignFields();
    refetchGetLinkToRecords();
  }, [refetchGetForeignFields, refetchGetLinkToRecords]);

  const handleSelectLinkRecord = React.useCallback(
    (record: Row) => {
      const body = getValues("body");

      Object.keys(body).forEach((key) => {
        if (key !== "id") {
          delete body[key];
        }
      });
      body[selectedLinkFieldName] = record._id;
      setValue("body", body);
      setValue(`selectedLinkRecordBody.${selectedLinkFieldName}`, record);
    },
    [getValues, selectedLinkFieldName, setValue]
  );

  const handleSelectLookupOption = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLookupOption(e.target.value as LookupOption);
    },
    []
  );

  const handleSelectRole = React.useCallback(
    (type: RoleType, isMultiSelect: boolean) => {
      let value: RoleType[] = [type];

      if (isMultiSelect) {
        const types = getValues(
          method?.label === "GET"
            ? `params.${selectedParamIndex}.value`
            : `body.${selectedOptionFieldName}`
        ) as RoleType[] | undefined;

        if (types && types.length > 0) {
          const selectedIdx = types.findIndex((item) => item === type);

          if (selectedIdx !== -1) {
            types.splice(selectedIdx, 1);
            value = [...types];
          } else {
            value = [...types, type];
          }
        }
      }

      if (method.label === "GET") {
        const key = getValues(`params.${selectedParamIndex}.key`);

        if (key) {
          updateParam(selectedParamIndex, { key, value });
        }
      } else {
        setValue(`body.${selectedOptionFieldName}`, value);
      }
    },
    [
      getValues,
      method.label,
      selectedOptionFieldName,
      selectedParamIndex,
      setValue,
      updateParam,
    ]
  );

  const selectedParamConditions = React.useMemo(() => {
    let data: Condition[] = [...equalityConditions, ...containConditions];

    if (selectedFields.length > 0) {
      const selectedParamField = selectedFields[selectedParamIndex];

      if (selectedParamField) {
        const { type } = selectedParamField;

        if (
          type === "number" ||
          type === "currency" ||
          type === "percent" ||
          type === "duration" ||
          type === "rating" ||
          type === "date" ||
          type === "createdAt" ||
          type === "updatedAt"
        ) {
          data = [...equalityConditions, ...numericConditions];
        } else if (
          type === "linkToRecord" ||
          type === "singleSelect" ||
          type === "multiSelect"
        ) {
          data = [...equalityConditions];
        } else if (type === "checkBox") {
          data = equalityConditions.filter((item) => item.name === "equal");
        }
      }
    }

    return data;
  }, [selectedFields, selectedParamIndex]);

  const memoizedAuths = React.useMemo(() => {
    const data: Authentication[] = [
      {
        identity: "Public",
        token: null,
      },
      ...auths,
    ];

    if (!searchAuth) {
      return data;
    }

    return data.filter((item) =>
      item.identity.toLowerCase().includes(searchAuth.toLowerCase())
    );
  }, [auths, searchAuth]);

  const linkToRecords = React.useMemo(() => {
    let data: Row[] = [];

    if (dataLinkToRecords) {
      data = dataLinkToRecords.slice(0);
    }

    if (!searchRecord) {
      return data;
    }

    return data.filter((item) => {
      // @ts-ignore
      const value = item[primaryFieldName] as string | null | undefined;

      return (!value ? "Unnamed Record" : value)
        .toLowerCase()
        .includes(searchRecord.toLowerCase());
    });
  }, [dataLinkToRecords, primaryFieldName, searchRecord]);

  const loadingGet =
    loadingGetFields || loadingGetDatabaseConfig || loadingGetRecords;
  const loadingGetLinkToRecord =
    loadingGetForeignFields || loadingGetLinkToRecords;
  const recordsLength = dataRecords?.length;

  return {
    autoLookup,
    fields,
    inputType,
    isCopy,
    isLinkToRecordOpen,
    isListAuthsOpen,
    linkToRecords,
    loadingGet,
    loadingGetLinkToRecord,
    loadingSendRequest,
    lookupFields,
    lookupOption,
    memoizedAuths,
    methods,
    paramsFields,
    primaryFieldName,
    recordsLength,
    responseURL,
    selectedAuth,
    selectedConditions,
    selectedFields,
    selectedLinkFieldName,
    selectedOptionValue,
    selectedParamConditions,
    selectedSortConditions,
    selectedSortFields,
    selectFields,
    sortsFields,
    sortConditions,
    handleAddParam,
    handleAddSort,
    handleAttachFile,
    handleCopyResponseURL,
    handleOpenListAuths,
    handleOpenParam,
    handleOpenSort,
    handleRemoveParam,
    handleRemoveSort,
    handleSelectAuth,
    handleSelectCondition,
    handleSelectDate,
    handleSelectField,
    handleSelectLinkField,
    handleSelectLinkRecord,
    handleSelectLinkToRecord,
    handleSelectLookupOption,
    handleSelectOption,
    handleSelectQueryField,
    handleSelectRole,
    handleSelectSortCondition,
    handleSelectSortField,
    handleSearchAuth,
    handleSearchRecord,
    handleSendRequest,
    handleShowDatePicker,
    handleShowLinkRecord,
    handleShowLinkToRecord,
    handleShowSelectOption,
    handleSubmit,
    handleToggleAutoLookup,
    onCloseListAuths,
    onCloseLinkToRecord,
    onOpenLinkToRecord,
  };
};
