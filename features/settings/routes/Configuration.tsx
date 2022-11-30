import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { Scrollbars } from "rc-scrollbars";
import * as React from "react";
import { FormProvider } from "react-hook-form";

import { OpenExternalLinkIcon } from "@/assets/icons";

import { InputIdentityField } from "../components/InputIdentityField";
import { InputNumber } from "../components/InputNumber";
import { InputString } from "../components/InputString";
import { useConfigurations } from "../hooks/useConfigurations";
import { useDatabaseCluster } from "../hooks/useDatabaseCluster";

export const ConfigurationPage = () => {
  const { databases } = useDatabaseCluster();
  const {
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
  } = useConfigurations({ databases });

  return (
    <Box
      sx={(theme) => ({
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.grey[100],
      })}
    >
      {loadingGet ? (
        <Stack sx={{ flex: 1 }} alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      ) : (
        <Stack sx={{ flex: 1 }}>
          <Scrollbars>
            <Stack sx={{ p: 6 }}>
              <FormProvider {...methods}>
                <Stack spacing={2}>
                  <Stack
                    sx={(theme) => ({
                      backgroundColor: "white",
                      borderRadius: "12px",
                      boxShadow: theme.shadows[2],
                    })}
                  >
                    <Typography
                      sx={{
                        px: 2.5,
                        py: 1.5,
                      }}
                      fontSize="1.5em"
                      fontWeight={700}
                    >
                      Configuration
                    </Typography>
                    <Divider />
                    <Stack sx={{ p: 2.5 }} p="5" spacing={3}>
                      <Stack spacing={1.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography
                            sx={{
                              flex: 1,
                            }}
                            fontWeight={600}
                          >
                            Email verification enabled
                          </Typography>
                          <Box flex="2">
                            <Switch
                              checked={emailVerifEnabled === "true"}
                              onChange={handleToggleEmailVerify}
                            />
                          </Box>
                        </Stack>
                        {emailVerifEnabled === "true" && (
                          <Stack spacing={1}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Typography
                                sx={{
                                  flex: 1,
                                }}
                                fontWeight={600}
                              >
                                Redirect verification URL
                              </Typography>
                              <Box flex="2">
                                <InputString
                                  w="100%"
                                  name="config.redirectVerifyEmailURL"
                                  placeholder="http://localhost:3000"
                                />
                              </Box>
                            </Stack>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Box flex="1" />
                              <Typography
                                sx={(theme) => ({
                                  flex: 2,
                                  color: theme.palette.grey[500],
                                })}
                                fontSize="0.875em"
                              >
                                Redirect URL for accessing email verification
                                token.
                              </Typography>
                            </Stack>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Typography
                                sx={{
                                  flex: 1,
                                }}
                                fontWeight={600}
                              >
                                Email verification expiry
                              </Typography>
                              <Box flex="2">
                                <InputNumber
                                  w="100%"
                                  defaultValue={
                                    projectConfig.emailVerificationExpiredTimeMillis
                                  }
                                  name="config.emailVerificationExpiredTimeMillis"
                                />
                              </Box>
                            </Stack>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Box flex="1" />
                              <Typography
                                sx={(theme) => ({
                                  flex: 2,
                                  color: theme.palette.grey[500],
                                })}
                                fontSize="0.875em"
                              >
                                How long verification emails are valid for, in
                                milliseconds. Defaults to 86400000 (1 day).
                              </Typography>
                            </Stack>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Typography
                                sx={{
                                  flex: 1,
                                }}
                                fontWeight={600}
                              >
                                Resend email verification timeout
                              </Typography>
                              <Box flex="2">
                                <InputNumber
                                  w="100%"
                                  defaultValue={
                                    projectConfig.resendEmailVerificationTimeout
                                  }
                                  name="config.resendEmailVerificationTimeout"
                                />
                              </Box>
                            </Stack>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Box flex="1" />
                              <Typography
                                sx={(theme) => ({
                                  flex: 2,
                                  color: theme.palette.grey[500],
                                })}
                                fontSize="0.875em"
                              >
                                How long the timeout of resend email
                                verification, in milliseconds. Defaults to 60000
                                (1 minute).
                              </Typography>
                            </Stack>
                          </Stack>
                        )}
                      </Stack>
                      <Divider />
                      <Stack spacing={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography
                            sx={{
                              flex: 1,
                            }}
                            fontWeight={600}
                          >
                            Redirect forget password URL
                          </Typography>
                          <Box flex="2">
                            <InputString
                              w="100%"
                              name="config.redirectForgetPasswordURL"
                              placeholder="http://localhost:3000"
                            />
                          </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box flex="1" />
                          <Typography
                            sx={(theme) => ({
                              flex: 2,
                              color: theme.palette.grey[500],
                            })}
                            fontSize="0.875em"
                          >
                            Redirect URL for accessing reset password token.
                            Email will be expired in 1 day.
                          </Typography>
                        </Stack>
                      </Stack>
                      <Divider />
                      <Stack spacing={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography
                            sx={{
                              flex: 1,
                            }}
                            fontWeight={600}
                          >
                            Token expiry
                          </Typography>
                          <Box flex="2">
                            <InputNumber
                              w="100%"
                              defaultValue={
                                projectConfig.accessTokenExpiredTimeMillis
                              }
                              name="config.accessTokenExpiredTimeMillis"
                            />
                          </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box flex="1" />
                          <Typography
                            sx={(theme) => ({
                              flex: 2,
                              color: theme.palette.grey[500],
                            })}
                            fontSize="0.875em"
                          >
                            How long tokens are valid for, in milliseconds.
                            Defaults to 86400000 (1 day).
                          </Typography>
                        </Stack>
                      </Stack>
                      <Divider />
                      <Stack spacing={1.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography
                            sx={{
                              flex: 1,
                            }}
                            fontWeight={600}
                          >
                            Refresh token enabled
                          </Typography>
                          <Stack
                            direction="row"
                            flex="2"
                            alignItems="center"
                            spacing={3}
                          >
                            <Switch
                              checked={refreshTokenEnabled === "true"}
                              onChange={handleToggleRefreshToken}
                            />
                          </Stack>
                        </Stack>
                        {refreshTokenEnabled === "true" && (
                          <Stack spacing={1}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Typography
                                sx={{
                                  flex: 1,
                                }}
                                fontWeight={600}
                              >
                                Refresh token expiry
                              </Typography>
                              <Box flex="2">
                                <InputNumber
                                  w="100%"
                                  defaultValue={
                                    projectConfig.refreshTokenExpiredTimeMillis
                                  }
                                  name="config.refreshTokenExpiredTimeMillis"
                                />
                              </Box>
                            </Stack>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Box flex="1" />
                              <Typography
                                sx={(theme) => ({
                                  flex: 2,
                                  color: theme.palette.grey[500],
                                })}
                                fontSize="0.875em"
                              >
                                How long tokens are valid for, in milliseconds.
                                Defaults to 604800000 (1 week).
                              </Typography>
                            </Stack>
                          </Stack>
                        )}
                      </Stack>
                      <Divider />
                      <Stack spacing={1} zIndex="1">
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          zIndex="1"
                        >
                          <Typography
                            sx={{
                              flex: 1,
                            }}
                            fontWeight={600}
                          >
                            User identity field
                          </Typography>
                          <Box flex="2">
                            <InputIdentityField
                              name="config.userIdentityField"
                              fields={unqiueUsersFields}
                              onSelect={handleSelectUserIdentifyField}
                            />
                          </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box flex="1" />
                          <Typography
                            sx={(theme) => ({
                              flex: 2,
                              color: theme.palette.grey[500],
                            })}
                            fontSize="0.875em"
                          >
                            Which field used to identify user on login. Field
                            must have unique option, defaults to email.
                          </Typography>
                        </Stack>
                      </Stack>
                      <Divider />
                      <Typography
                        sx={(theme) => ({
                          flex: 1,
                          color: theme.palette.grey[500],
                        })}
                        fontWeight={600}
                      >
                        External OAuth Providers
                      </Typography>
                      <Stack spacing={1.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography
                            sx={{
                              flex: 1,
                            }}
                            fontWeight={600}
                          >
                            Facebook enabled
                          </Typography>
                          <Stack
                            direction="row"
                            flex="2"
                            alignItems="center"
                            spacing={3}
                          >
                            <Switch
                              checked={facebookEnabled}
                              onChange={handleToggleFacebook}
                            />
                            {facebookEnabled && (
                              <Link
                                sx={{
                                  ml: "0px !important",
                                  textDecoration: "none",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                                fontSize="0.875em"
                                href="https://developers.facebook.com"
                                target="_blank"
                              >
                                Create new credential
                                <OpenExternalLinkIcon
                                  sx={{ ml: 0.5 }}
                                  color="inherit"
                                  fontSize="small"
                                />
                              </Link>
                            )}
                          </Stack>
                        </Stack>
                        {facebookEnabled && (
                          <Stack spacing={1}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Typography
                                sx={{
                                  flex: 1,
                                }}
                                fontWeight={600}
                              >
                                Facebook client ID
                              </Typography>
                              <Box flex="2">
                                <InputString
                                  w="100%"
                                  name="config.facebookClientId"
                                />
                              </Box>
                            </Stack>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Typography
                                sx={{
                                  flex: 1,
                                }}
                                fontWeight={600}
                              >
                                Facebook secret
                              </Typography>
                              <Box flex="2">
                                <InputString
                                  w="50%"
                                  name="config.facebookClientSecret"
                                  hideText
                                />
                              </Box>
                            </Stack>
                          </Stack>
                        )}
                        <Divider />
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography
                            sx={{
                              flex: 1,
                            }}
                            fontWeight={600}
                          >
                            Google enabled
                          </Typography>
                          <Stack
                            direction="row"
                            flex="2"
                            alignItems="center"
                            spacing={3}
                          >
                            <Switch
                              checked={googleEnabled}
                              onChange={handleToggleGoogle}
                            />
                            {googleEnabled && (
                              <Link
                                sx={{
                                  ml: "0px !important",
                                  textDecoration: "none",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                                fontSize="0.875em"
                                href="https://console.cloud.google.com/apis/credentials"
                                target="_blank"
                              >
                                Create new credential
                                <OpenExternalLinkIcon
                                  sx={{ ml: 0.5 }}
                                  color="inherit"
                                  fontSize="small"
                                />
                              </Link>
                            )}
                          </Stack>
                        </Stack>
                        {googleEnabled && (
                          <Stack spacing={1}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Typography
                                sx={{
                                  flex: 1,
                                }}
                                fontWeight={600}
                              >
                                Google client ID
                              </Typography>
                              <Box flex="2">
                                <InputString
                                  w="100%"
                                  name="config.googleClientId"
                                />
                              </Box>
                            </Stack>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Typography
                                sx={{
                                  flex: 1,
                                }}
                                fontWeight={600}
                              >
                                Google secret
                              </Typography>
                              <Box flex="2">
                                <InputString
                                  w="50%"
                                  name="config.googleClientSecret"
                                  hideText
                                />
                              </Box>
                            </Stack>
                          </Stack>
                        )}
                      </Stack>

                      <Button
                        sx={{
                          alignSelf: "flex-end",
                        }}
                        variant="contained"
                        disabled={loadingUpdateProjectConfig}
                        // isLoading={loadingUpdateProjectConfig}
                        // isLoadingText="Saving..."
                        onClick={handleSubmit(handleUpdateProjectConfig)}
                      >
                        Save
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </FormProvider>
            </Stack>
          </Scrollbars>
        </Stack>
      )}
      <Snackbar
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        open={isAlertOpen}
        autoHideDuration={6000}
        onClose={onAlertClose}
      >
        <Alert severity="success">{alertMessage}</Alert>
      </Snackbar>
    </Box>
  );
};
