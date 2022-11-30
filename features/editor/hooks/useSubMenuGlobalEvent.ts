import { useRouter } from "next/router";
import * as React from "react";

import { getSDK } from "@/lib";
import type { ExplorerParams, SDKClient } from "@/types";
import {
  AttachmentUploadResponse,
  Field,
  ForeignField,
  Row,
  Table,
  WidgetAuthBody,
  WidgetAuthSignupBody,
  WidgetCreateRecordBody,
  WidgetDeleteRecordBody,
  WidgetLinkToRecordBody,
  WidgetOnAttachmentUpload,
  WidgetOnGetTables,
  WidgetRowOnChangeParams,
  WidgetUpdateRecordBody,
} from "@/widgets/types";

export const useSubMenuGlobalEvent = () => {
  const router = useRouter();
  const { databaseId } = router.query as ExplorerParams;

  const sdk = React.useCallback((): void | Promise<SDKClient> => {
    if (!databaseId) {
      return;
    }

    return getSDK({ projectId: databaseId, onlyGateway: false });
  }, [databaseId]);

  const onGetTables: WidgetOnGetTables = React.useCallback(async () => {
    const connector = await sdk();

    if (!connector) {
      return;
    }

    const { data, error } = await connector.table.find();

    if (error) throw new Error(error.message);

    return data as Table[];
  }, [sdk]);

  const onGetFields = React.useCallback(
    async (table: Table) => {
      const connector = await sdk();

      if (!connector) {
        return;
      }

      const { data, error } = await connector
        .service(table.id as string)
        .field.find();

      if (error) throw new Error(error.message);

      return data as unknown as Field[];
    },
    [sdk]
  );

  const onGetForeignFields = React.useCallback(
    async (table: Table): Promise<ForeignField> => {
      const data = await onGetFields(table);

      return {
        table,
        fields: data as unknown as Field[],
      };
    },
    [onGetFields]
  );

  const onUploadAttachment: WidgetOnAttachmentUpload = React.useCallback(
    async (file) => {
      const connector = await sdk();

      if (!connector) {
        return;
      }

      const { data, error } = await connector.storage.upload(file as File);

      if (error) throw new Error(error.message);

      return data as AttachmentUploadResponse;
    },
    [sdk]
  );

  const onGetForeignRecords = React.useCallback(
    async (table: Table, query: Record<string, unknown>): Promise<Row[]> => {
      const connector = await sdk();

      if (!connector) {
        return;
      }

      const { data, error } = await connector.service(table.id).find(query);

      if (error) throw new Error(error.message);

      return data as Row[];
    },
    [sdk]
  );

  const onCreateRecord = React.useCallback(
    async (
      table: Table,
      { body }: WidgetRowOnChangeParams<WidgetCreateRecordBody>
    ) => {
      const connector = await sdk();

      if (!connector) {
        return;
      }

      const { data, error } = await connector
        .service(table.id)
        .create(body as Partial<Row>);

      if (error) throw new Error(error.message);

      return data as Row;
    },
    [sdk]
  );

  const onUpdateRecord = React.useCallback(
    async (
      table: Table,
      { recordId, body }: WidgetRowOnChangeParams<WidgetUpdateRecordBody>
    ) => {
      const connector = await sdk();

      if (!connector) {
        return;
      }

      const { data, error } = await connector
        .service(table.id)
        .updateById(recordId as string, body as Partial<Row>);

      if (error) throw new Error(error.message);

      return data as Row;
    },
    [sdk]
  );

  const onLinkToRecord = React.useCallback(
    async (
      table: Table,
      { recordId, body }: WidgetRowOnChangeParams<WidgetLinkToRecordBody>
    ) => {
      const connector = await sdk();

      if (!connector) {
        return;
      }

      const { data, error } = await connector
        .service(table.id)
        .link(
          recordId as string,
          body.foreignField.table.id,
          body.foreignRecordId,
          {
            localField: body.localField.id,
            foreignField: body.foreignField.id,
          }
        );

      if (error) throw new Error(error.message);

      return data as Row;
    },
    [sdk]
  );

  const onUnlinkToRecord = React.useCallback(
    async (
      table: Table,
      { recordId, body }: WidgetRowOnChangeParams<WidgetLinkToRecordBody>
    ) => {
      const connector = await sdk();

      if (!connector) {
        return;
      }

      const { data, error } = await connector
        .service(table.id)
        .unlink(
          recordId as string,
          body.foreignField.table.id,
          body.foreignRecordId,
          {
            localField: body.localField.id,
            foreignField: body.foreignField.id,
          }
        );

      if (error) throw new Error(error.message);

      return data as Row;
    },
    [sdk]
  );

  const onDeleteRecord = React.useCallback(
    async (
      table: Table,
      { body }: WidgetRowOnChangeParams<WidgetDeleteRecordBody>
    ) => {
      const connector = await sdk();

      if (!connector) {
        return;
      }

      const data = await Promise.all(
        body.map(async (id) => {
          const { data: deleted, error } = await connector
            .service(table.id)
            .deleteById(id);

          if (error) throw new Error(error.message);

          return deleted;
        })
      );

      return data as Row[];
    },
    [sdk]
  );

  const onAuthLogin = React.useCallback(
    async ({ body }: WidgetRowOnChangeParams<WidgetAuthBody>) => {
      const connector = await sdk();

      if (!connector) {
        return;
      }

      const { user, error } = await connector.auth.login(body);

      if (error) throw new Error(error.message);

      return user as Row;
    },
    [sdk]
  );

  const onAuthSignup = React.useCallback(
    async ({ body }: WidgetRowOnChangeParams<WidgetAuthSignupBody>) => {
      const connector = await sdk();

      if (!connector) {
        return;
      }

      const { user, error } = await connector.auth.register(body);

      if (error) throw new Error(error.message);

      return user as Row;
    },
    [sdk]
  );

  const onRowChange = React.useCallback(
    async (table: Table, params): Promise<Row | Row[]> => {
      switch (params.event) {
        case "CREATE_RECORD":
          return onCreateRecord(table, params);

        case "UPDATE_RECORD":
          return onUpdateRecord(table, params);

        case "LINK_RECORD":
          onLinkToRecord(table, params);
          break;

        case "UNLINK_RECORD":
          return onUnlinkToRecord(table, params);

        case "DELETE_RECORD":
          return onDeleteRecord(table, params);

        case "AUTH_LOGIN":
          return onAuthLogin(params);

        case "AUTH_SIGNUP":
          return onAuthSignup(params);

        default:
          return {} as Promise<Row>;
      }
    },
    [
      onAuthLogin,
      onAuthSignup,
      onUpdateRecord,
      onLinkToRecord,
      onUnlinkToRecord,
      onDeleteRecord,
      onCreateRecord,
    ]
  );

  return {
    onGetTables,
    onUploadAttachment,
    onRowChange,
    onGetFields,
    onGetForeignRecords,
    onGetForeignFields,
  };
};
