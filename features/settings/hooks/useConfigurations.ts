import * as React from "react";
import { useForm } from "react-hook-form";

import {
  useGetBlocks,
  useGetDatabaseConfig,
  useGetFields,
  useUpdateDatabaseConfig,
} from "@/api";
import { useDisclose } from "@/hooks";
import { Block, Database, Field, ProjectConfig } from "@/types";

import { FormConfiguration } from "../types";

interface Props {
  databases: Database[];
}

export const useConfigurations = ({ databases }: Props) => {
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclose();

  const [alertMessage, setAlertMessage] = React.useState("");

  const showAlert = (message: string) => {
    setAlertMessage(message);
    onAlertOpen();
  };

  const databaseId = databases[0]?.id;
  const dataQueriesBlocks = useGetBlocks({
    databases,
  });

  const getBlocks = React.useCallback((dataBlocks: Block[]) => {
    const data = dataBlocks.slice(0);
    const systemBlocks = data.filter((item) => item.isLockedBySystem);
    const usersBlocks = systemBlocks.filter(
      (item) => item.title?.[0]?.[0] === "Users"
    );

    return { blocks: dataBlocks, usersBlocks };
  }, []);

  const { usersBlocks } = React.useMemo(() => {
    const usersBlocks: Block[] = [];

    if (dataQueriesBlocks.length) {
      dataQueriesBlocks.forEach((item) => {
        if (item.data) {
          const { usersBlocks: dbUsersBlocks } = getBlocks([...item.data]);

          usersBlocks.push(...dbUsersBlocks);
        }
      });
    }

    return { usersBlocks };
  }, [dataQueriesBlocks, getBlocks]);

  const usersBlock = usersBlocks[0] ?? null;

  const { data: dataUsersFields, isLoading: loadingGetUsersFields } =
    useGetFields({
      dbId: databaseId,
      tableId: usersBlock?.properties?.tableId,
      enabled: !!usersBlock && !!databaseId,
    });

  const { data: dataProjectConfig, isLoading: loadingGetProjectConfig } =
    useGetDatabaseConfig({ databaseId, enabled: !!databaseId });

  const { mutateAsync: updateConfig, isLoading: loadingUpdateProjectConfig } =
    useUpdateDatabaseConfig({});

  const projectConfig = React.useMemo(() => {
    let data: ProjectConfig = {
      isNeedEmailVerification: "false",
      emailVerificationExpiredTimeMillis: "86400000",
      resendEmailVerificationTimeout: "60000",
      redirectVerifyEmailURL: "",
      redirectForgetPasswordURL: "",
      googleClientId: "",
      googleClientSecret: "",
      facebookClientId: "",
      facebookClientSecret: "",
      isNeedPhoneVerification: "false",
      twilioAuthToken: "",
      twilioAccountSID: "",
      twilioServiceSID: "",
      emailService: "",
      emailAddress: "",
      sendgridAPIKey: "",
      smtpUser: "",
      smtpPassword: "",
      smtpHost: "",
      smtpPort: "",
      userIdentityField: "email",
      accessTokenExpiredTimeMillis: "86400000",
      useRefreshToken: "false",
      refreshTokenExpiredTimeMillis: "604800000",
    };

    if (dataProjectConfig) {
      data = { ...dataProjectConfig };
    }

    return data;
  }, [dataProjectConfig]);

  const methods = useForm<FormConfiguration>({
    defaultValues: {
      facebookEnabled: Boolean(
        projectConfig.facebookClientId || projectConfig.facebookClientSecret
      ),
      googleEnabled: Boolean(
        projectConfig.googleClientId || projectConfig.googleClientSecret
      ),
      config: projectConfig,
    },
  });
  const { handleSubmit, reset, setValue, watch } = methods;
  const emailVerifEnabled = watch("config.isNeedEmailVerification");
  const refreshTokenEnabled = watch("config.useRefreshToken");
  const facebookEnabled = watch("facebookEnabled");
  const googleEnabled = watch("googleEnabled");

  React.useEffect(() => {
    if (projectConfig) {
      reset({
        facebookEnabled: Boolean(
          projectConfig.facebookClientId || projectConfig.facebookClientSecret
        ),
        googleEnabled: Boolean(
          projectConfig.googleClientId || projectConfig.googleClientSecret
        ),
        config: projectConfig,
      });
    }
  }, [projectConfig, reset]);

  const handleToggleEmailVerify = React.useCallback(() => {
    setValue(
      "config.isNeedEmailVerification",
      emailVerifEnabled === "true" ? "false" : "true",
      { shouldTouch: true }
    );
  }, [emailVerifEnabled, setValue]);

  const handleToggleRefreshToken = React.useCallback(() => {
    setValue(
      "config.useRefreshToken",
      refreshTokenEnabled === "true" ? "false" : "true",
      { shouldTouch: true }
    );
  }, [refreshTokenEnabled, setValue]);

  const handleSelectUserIdentifyField = React.useCallback(
    (field: Field) => {
      setValue("config.userIdentityField", field.name);
    },
    [setValue]
  );

  const handleToggleFacebook = React.useCallback(() => {
    setValue("facebookEnabled", !facebookEnabled, { shouldTouch: true });
  }, [facebookEnabled, setValue]);

  const handleToggleGoogle = React.useCallback(() => {
    setValue("googleEnabled", !googleEnabled, { shouldTouch: true });
  }, [googleEnabled, setValue]);

  const handleUpdateProjectConfig = React.useCallback(
    async ({ config }: FormConfiguration) => {
      if (!databaseId) {
        return;
      }

      try {
        const {
          isNeedEmailVerification,
          emailVerificationExpiredTimeMillis,
          resendEmailVerificationTimeout,
          redirectVerifyEmailURL,
          redirectForgetPasswordURL,
          facebookClientId,
          facebookClientSecret,
          googleClientId,
          googleClientSecret,
          userIdentityField,
          accessTokenExpiredTimeMillis,
          useRefreshToken,
          refreshTokenExpiredTimeMillis,
        } = config;
        const updatedConfig = await updateConfig({
          databaseId,
          body: {
            isNeedEmailVerification,
            emailVerificationExpiredTimeMillis: String(
              emailVerificationExpiredTimeMillis
            ),
            resendEmailVerificationTimeout: String(
              resendEmailVerificationTimeout
            ),
            redirectVerifyEmailURL,
            redirectForgetPasswordURL,
            facebookClientId: facebookEnabled ? facebookClientId : "",
            facebookClientSecret: facebookEnabled ? facebookClientSecret : "",
            googleClientId: googleEnabled ? googleClientId : "",
            googleClientSecret: googleEnabled ? googleClientSecret : "",
            userIdentityField,
            accessTokenExpiredTimeMillis: String(accessTokenExpiredTimeMillis),
            useRefreshToken,
            refreshTokenExpiredTimeMillis: String(
              refreshTokenExpiredTimeMillis
            ),
          },
        });

        reset({
          facebookEnabled: Boolean(
            updatedConfig.facebookClientId || updatedConfig.facebookClientSecret
          ),
          googleEnabled: Boolean(
            updatedConfig.googleClientId || updatedConfig.googleClientSecret
          ),
          config: updatedConfig,
        });
        showAlert("Configuration had been successfully updated.");
      } catch (error) {
        console.log(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [facebookEnabled, googleEnabled, databaseId, reset, updateConfig]
  );

  const unqiueUsersFields = React.useMemo(() => {
    let data: Field[] = [];

    if (dataUsersFields) {
      data = dataUsersFields.filter((item) => item.isUnique);
    }

    return data;
  }, [dataUsersFields]);

  const loadingGet =
    loadingGetProjectConfig ||
    loadingGetUsersFields ||
    dataProjectConfig === undefined ||
    dataUsersFields === undefined;

  return {
    alertMessage,
    emailVerifEnabled,
    facebookEnabled,
    googleEnabled,
    isAlertOpen,
    loadingGet,
    loadingUpdateProjectConfig,
    methods,
    projectConfig,
    refreshTokenEnabled,
    unqiueUsersFields,
    handleSelectUserIdentifyField,
    handleSubmit,
    handleToggleEmailVerify,
    handleToggleFacebook,
    handleToggleGoogle,
    handleToggleRefreshToken,
    handleUpdateProjectConfig,
    onAlertClose,
  };
};
