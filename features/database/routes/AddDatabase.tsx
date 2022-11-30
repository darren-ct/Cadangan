import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { FormProvider } from "react-hook-form";

import { Button, Form } from "@/components/Elements";

import { useAddDatabase } from "../hooks/useAddDatabase";

export const AddDatabasePage = React.memo(function AddDatabasePage() {
  const {
    loadingAddProject,
    isClusterReady,
    methods,
    handleAddDatabase,
    handleCancel,
    handleSubmit,
  } = useAddDatabase();

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.grey["A100"],
        height: "100vh",
        paddingTop: 12,
        paddingBottom: 12,
        overflow: "auto",
      })}
    >
      <Container maxWidth="md">
        <Card>
          {!isClusterReady ? (
            <Stack
              sx={{
                height: "250px",
              }}
              alignItems="center"
              justifyContent="center"
              spacing={2}
            >
              <CircularProgress />
              <Typography variant="h6">Setting up cluster</Typography>
            </Stack>
          ) : (
            <FormProvider {...methods}>
              <Form onSubmit={handleSubmit(handleAddDatabase)}>
                <CardContent>
                  <Stack gap={3.75}>
                    <Typography sx={{ fontSize: 18, fontWeight: 500 }}>
                      Create a new Database
                    </Typography>

                    <Typography color="GrayText">
                      To get started, please create database name!
                    </Typography>

                    <Grid container>
                      <Grid item xs={3} sx={{ paddingTop: 1 }}>
                        <Typography sx={{ fontWeight: 500 }}>Name</Typography>
                      </Grid>

                      <Grid item xs={9}>
                        <TextField
                          placeholder="Database name"
                          fullWidth
                          size="small"
                          sx={{ marginBottom: 1.25 }}
                          {...methods.register("databaseName")}
                        />
                        <Typography color="GrayText">
                          {"What's the name of your database?"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Stack>
                </CardContent>

                <Divider />

                <CardActions
                  sx={{ justifyContent: "space-between", py: 2, px: 2 }}
                >
                  <Button variant="outlined" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    disabled={loadingAddProject}
                    type="submit"
                    variant="contained"
                    startIcon={
                      loadingAddProject ? <CircularProgress size={14} /> : null
                    }
                  >
                    Create Database
                  </Button>
                </CardActions>
              </Form>
            </FormProvider>
          )}
        </Card>
      </Container>
    </Box>
  );
});
