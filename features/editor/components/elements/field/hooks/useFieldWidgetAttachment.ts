import * as React from "react";

import { useDisclose } from "@/widgets/hooks";
import { FileObject, WidgetAttachmentParams } from "@/widgets/types";

interface Props {
  onChange?: (value: FileObject[]) => void;
}

export const useFieldWidgetAttachment = ({ onChange }: Props) => {
  const {
    isOpen: isFileModalOpen,
    onOpen: onFileModalOpen,
    onClose: onFileModalClose,
  } = useDisclose();

  const [currentAttachmentUrl, setCurrentAttachmentUrl] = React.useState<
    string | undefined
  >();

  const handleFileModalOpen = React.useCallback(
    (value: FileObject) => {
      setCurrentAttachmentUrl(value.url);
      onFileModalOpen();
    },
    [onFileModalOpen]
  );

  const handleFileModalClose = React.useCallback(() => {
    setCurrentAttachmentUrl("");
    onFileModalClose();
  }, [onFileModalClose]);

  const handleAttachmentChange = React.useCallback(
    ({ attachments }: WidgetAttachmentParams) => {
      onChange(attachments);
    },
    [onChange]
  );

  return {
    isFileModalOpen,
    currentAttachmentUrl,
    handleAttachmentChange,
    handleFileModalOpen,
    handleFileModalClose,
    setCurrentAttachmentUrl,
  };
};
