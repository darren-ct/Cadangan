import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { FormProvider } from "react-hook-form";

import { Button, Form } from "@/components/Elements";
import { ExplorerSidebar } from "@/features/explorer";

import { useAddTable } from "../hooks/useAddTable";

export const Main = styled("main")(() => ({}));

export const AddTable = React.memo(function AddTable() {
  const {
    loadingCreateService,
    methods,
    handleAddTable,
    handleCancel,
    handleSubmit,
  } = useAddTable();

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flex: 1,
        overflow: "hidden",
      }}
    >
      <ExplorerSidebar />

      <Main
        sx={(theme) => ({
          display: "flex",
          flexGrow: 1,
          overflow: "auto",
          backgroundColor: theme.palette.grey["A100"],
        })}
      >
        <Box
          sx={() => ({
            width: "100%",
            paddingY: 20,
            overflow: "auto",
          })}
        >
          <Container maxWidth="md">
            <Card>
              <FormProvider {...methods}>
                <Form onSubmit={handleSubmit(handleAddTable)}>
                  <CardContent>
                    <Stack gap={3.75}>
                      <Typography sx={{ fontSize: 18, fontWeight: 500 }}>
                        Create a new table
                      </Typography>

                      <Grid container>
                        <Grid item xs={3} sx={{ paddingTop: 1 }}>
                          <Typography sx={{ fontWeight: 500 }}>Name</Typography>
                        </Grid>

                        <Grid item xs={9}>
                          <TextField
                            sx={{ marginBottom: 1.25 }}
                            placeholder="Table name"
                            fullWidth
                            autoFocus
                            size="small"
                            {...methods.register("databaseName")}
                          />
                          <Typography color="GrayText">
                            What`s the name of your table?
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
                      disabled={loadingCreateService}
                      type="submit"
                      variant="contained"
                      startIcon={
                        loadingCreateService ? (
                          <CircularProgress size={14} />
                        ) : null
                      }
                    >
                      Create Table
                    </Button>
                  </CardActions>
                </Form>
              </FormProvider>
            </Card>
          </Container>
        </Box>
      </Main>
    </Box>
  );
});
