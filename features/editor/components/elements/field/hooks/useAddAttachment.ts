import * as React from "react";

import type { FileObjectInput } from "@/widgets/types";

interface Props {
  isOpen: boolean;
  onUpload: (values: FileObjectInput[]) => void;
}

export const useAddAttachment = ({ isOpen, onUpload }: Props) => {
  const [url, setUrl] = React.useState("");
  const [tab, setTab] = React.useState<FileObjectInput["from"]>("My Device");
  const [viewSelect, setViewSelect] = React.useState(false);
  const [findFile, setFindFile] = React.useState("");
  const [selectedFiles, setSelectedFiles] = React.useState<FileObjectInput[]>(
    []
  );

  React.useEffect(() => {
    if (!isOpen) {
      setSelectedFiles([]);
    }
  }, [isOpen]);

  const handleChangeFile = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target?.files?.[0];
      if (file) {
        setSelectedFiles([
          ...selectedFiles,
          {
            file,
            url: URL.createObjectURL(file),
            fileName: file.name,
            from: "My Device",
          },
        ]);
      }
    },
    [selectedFiles]
  );

  const handleUploadFile = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      const currentSelectedFiles = selectedFiles.slice();
      onUpload(currentSelectedFiles || []);
    },
    [onUpload, selectedFiles]
  );

  const handleAddLink = React.useCallback(() => {
    if (url) {
      const urlSplit = url.split("/");
      const fileName = urlSplit[urlSplit.length - 1];
      setSelectedFiles([...selectedFiles, { url, fileName, from: tab }]);
      setUrl("");
      setViewSelect(false);
    }
  }, [selectedFiles, setSelectedFiles, setUrl, setViewSelect, tab, url]);

  const handleUploadMore = React.useCallback(() => {
    setViewSelect(false);
  }, [setViewSelect]);

  const handleViewSelected = React.useCallback(() => {
    setViewSelect(true);
  }, [setViewSelect]);

  const handleChangeUrl = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value);
    },
    [setUrl]
  );

  const handleDeselectFiles = React.useCallback(() => {
    setSelectedFiles([]);
  }, [setSelectedFiles]);

  const handleChangeFindFile = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFindFile(e.target.value);
    },
    []
  );

  const filterFiles = React.useMemo(() => {
    if (findFile) {
      return selectedFiles.filter((item) =>
        item.fileName.toLowerCase().includes(findFile.toLocaleLowerCase())
      );
    }
    return selectedFiles;
  }, [findFile, selectedFiles]);

  return {
    filterFiles,
    findFile,
    selectedFiles,
    tab,
    url,
    viewSelect,
    handleAddLink,
    handleChangeFile,
    handleChangeFindFile,
    handleChangeUrl,
    handleDeselectFiles,
    handleUploadMore,
    handleUploadFile,
    handleViewSelected,
    setSelectedFiles,
    setTab,
    setViewSelect,
  };
};
