import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase from "@mui/material/InputBase";
import Menu from "@mui/material/Menu";
import * as React from "react";

import { SearchIcon } from "@/assets/icons";
import { Form } from "@/components/Elements";
import type { Field, LinkToRecordObjectInput, Row } from "@/widgets/types";

import { RecordList } from "./RecordList";

interface Props {
  anchorEl?: HTMLElement | null;
  fields: Field[];
  findValue: string;
  isLoading: boolean;
  isOpen: boolean;
  primaryField?: Field;
  records: Row[];
  onAddLinkToRecord: (item: LinkToRecordObjectInput) => void;
  onRemoveLinkToRecord: (item: LinkToRecordObjectInput) => void;
  onAddRecord?: () => void;
  onChangeFind: (value: string) => void;
  onClose: () => void;
  onSubmitCreateRecord?: () => void;
}

export const AddLinkToRecordMenu = React.memo(function AddLinkToRecordMenu({
  anchorEl,
  fields,
  findValue,
  isLoading,
  isOpen,
  primaryField,
  records,
  onAddLinkToRecord,
  onChangeFind,
  onClose,
  onSubmitCreateRecord,
}: Props) {
  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSubmitCreateRecord();
    },
    [onSubmitCreateRecord]
  );

  const handleChangeFind = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChangeFind(e.target.value);
    },
    [onChangeFind]
  );

  return (
    <Menu
      anchorEl={anchorEl}
      open={isOpen && Boolean(anchorEl)}
      onClose={onClose}
      variant="menu"
    >
      <Form
        sx={{ width: 600, paddingLeft: 2, paddingRight: 2 }}
        onSubmit={handleSubmit}
      >
        <Box
          sx={(theme) => ({
            paddingBottom: 1,
            borderBottom: `2px solid ${theme.palette.grey[300]}`,
          })}
        >
          <InputBase
            value={findValue}
            onChange={handleChangeFind}
            autoFocus
            fullWidth
            placeholder="Find an existing record"
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon
                  sx={(theme) => ({ color: theme.palette.grey[600] })}
                  fontSize="small"
                />
              </InputAdornment>
            }
          />
        </Box>
        <RecordList
          fields={fields}
          isLoading={isLoading}
          primaryField={primaryField?.name ?? ""}
          records={records}
          onClickItem={onAddLinkToRecord}
        />
      </Form>
    </Menu>
  );
});
