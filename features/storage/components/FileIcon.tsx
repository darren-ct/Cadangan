import { SvgIconProps } from "@mui/material/SvgIcon";
import * as React from "react";

import {
  AudioIcon,
  DocumentIcon,
  FileIcon as DefaultIcon,
  FolderIcon,
  ImageIcon,
  VideoIcon,
} from "@/assets/icons";

interface Props extends SvgIconProps {
  mimeType: string;
}

export const FileIcon = React.memo(function FileIcon({
  mimeType,
  ...props
}: Props) {
  const getIcon = React.useCallback(() => {
    if (mimeType.includes("folder")) {
      return <FolderIcon {...props} />;
    } else if (mimeType.includes("image")) {
      return <ImageIcon color="success" {...props} />;
    } else if (mimeType.includes("audio")) {
      return <AudioIcon color="error" {...props} />;
    } else if (mimeType.includes("video")) {
      return <VideoIcon color="primary" {...props} />;
    } else if (mimeType.includes("document")) {
      return <DocumentIcon color="primary" {...props} />;
    } else {
      return <DefaultIcon color="disabled" {...props} />;
    }
  }, [mimeType, props]);

  return <>{getIcon()}</>;
});
