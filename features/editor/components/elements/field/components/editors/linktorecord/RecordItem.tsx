import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import { green } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { AccountIcon } from "@/assets/icons/Account";
import { Image } from "@/components/Elements";
import type {
  Field,
  FieldOptionsCurrency,
  FieldOptionsPercent,
  FileObject,
  LinkToRecordObjectInput,
  Row,
  SelectOption,
} from "@/widgets/types";

interface Props {
  fields: Field[];
  primaryField: string;
  item: Row;
  onClickItem?: (item: LinkToRecordObjectInput) => void;
}

export const RecordItem = React.memo(function RecordItem({
  fields,
  item,
  onClickItem,
  primaryField,
}: Props) {
  const handleClick = React.useCallback(() => {
    if (onClickItem) {
      const newObject = {
        _id: item._id,
        primaryCol: item[primaryField],
      };

      onClickItem(newObject);
    }
  }, [item, onClickItem, primaryField]);

  return (
    <Box
      sx={(theme) => ({
        marginTop: 1,
        padding: 1,
        border: `2px solid ${theme.palette.grey[300]}`,
        borderRadius: "4px",
        cursor: "pointer",
        position: "relative",
        "&:hover": {
          border: `2px solid ${theme.palette.primary.main}`,
        },
      })}
      key={item._id as string}
      onClick={handleClick}
    >
      {/* Title */}
      <Typography
        sx={(theme) => ({
          color: item[primaryField]
            ? theme.palette.common.black
            : theme.palette.grey[700],
          fontWeight: 500,
          letterSpacing: theme.typography.button.letterSpacing,
        })}
      >
        {((item[primaryField]
          ? (item[primaryField] as React.ReactNode)
          : item[primaryField]) as React.ReactNode) || "Unnamed record"}
      </Typography>

      {/* Other contents */}
      <Box sx={{ marginTop: 1, display: "flex" }}>
        {fields
          ?.filter(
            (fieldItem) =>
              !fieldItem?.isPrimary && fieldItem.type !== "linkToRecord"
          )
          .slice(0, 4)
          .map((val) => (
            <Box sx={{ width: `25%` }} key={val.id}>
              <Typography
                sx={(theme) => ({
                  color: theme.palette.grey[700],
                  fontSize: "0.65rem",
                })}
                variant="caption"
              >
                {val.name.toUpperCase()}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  marginTop: 5,
                  width: "100%",
                  height: 24,
                  overflow: "hidden",
                }}
              >
                {item[val.name] !== null ? (
                  Array.isArray(item[val.name]) &&
                  (item[val.name] as unknown[]).length > 0 ? (
                    val.type === "attachment" ? (
                      (item[val.name] as FileObject[])
                        .slice(0, 1)
                        .map((img: FileObject, index: number) => (
                          <Box
                            sx={(theme) => ({
                              height: "100%",
                              border: `2px solid ${theme.palette.grey[300]}`,
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            })}
                            key={index}
                          >
                            <Image
                              sx={{ maxHeight: "100%" }}
                              src={img.url}
                              alt={img.fileName}
                            />
                          </Box>
                        ))
                    ) : val.type === "multiSelect" ? (
                      (item[val.name] as SelectOption[]).map(
                        (opt: SelectOption, index: number) => (
                          <Chip
                            sx={{ marginLeft: index > 0 ? 0.5 : 0 }}
                            key={index}
                            size="small"
                            color="primary"
                            label={opt.value as string}
                          />
                        )
                      )
                    ) : (
                      <Box
                        sx={{
                          marginTop: 0.5,
                          fontSize: "0.875rem",
                          width: "100%",
                        }}
                      >
                        {(item[val.name] as string[]).map(
                          (record: string, index: number) => (
                            <Typography key={index}>
                              {record.slice(0, 10).trim() + "..."}
                            </Typography>
                          )
                        )}
                      </Box>
                    )
                  ) : val.type === "createdBy" || val.type === "updatedBy" ? (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AccountIcon
                        sx={(theme) => ({
                          fontSize: theme.typography.h6.fontSize,
                          color: green[500],
                        })}
                      />
                      <Typography sx={{ marginLeft: 0.5 }}>
                        {Object(item[val.name])?.firstName}
                      </Typography>
                    </Box>
                  ) : val.type === "singleSelect" ? (
                    Object(item[val.name])?.value ? (
                      <Chip
                        size="small"
                        label={Object(item[val.name]).value}
                        color="primary"
                      />
                    ) : null
                  ) : val.type === "checkBox" ? (
                    <Checkbox
                      sx={{ padding: 0 }}
                      checked={!!item[val.name]}
                      size="small"
                      color="primary"
                    />
                  ) : val.type === "currency" ? (
                    <Typography>
                      {(val?.options as FieldOptionsCurrency)?.currencySymbol}
                      {(item[val.name] as number).toFixed(
                        (val?.options as FieldOptionsCurrency)
                          ?.precision as number
                      )}
                    </Typography>
                  ) : val.type === "percent" ? (
                    <Typography>
                      {((item[val.name] as number) * 100).toFixed(
                        (val?.options as FieldOptionsPercent)
                          .precision as number
                      )}
                      %
                    </Typography>
                  ) : typeof item[val.name] === "string" ? (
                    <Typography>
                      {`${item[val.name]}`.length > 10
                        ? `${item[val.name]}`.slice(0, 10).trim() + "..."
                        : `${item[val.name]}`}
                    </Typography>
                  ) : null
                ) : null}
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
  );
});
