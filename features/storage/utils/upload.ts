import Axios from "axios";

import { ApiKey, StorageObject } from "@/api/types";

export interface UploadParams {
  apiKey: ApiKey;
  apiUrl: string;
  file?: File;
  folders: StorageObject[];
  index: number;
  onError?: (error: string) => void;
  onSuccess?: () => void;
  onUploadProgress?: (progressEvent: ProgressEvent) => void;
}

interface Error {
  message?: string;
}

export const upload = ({
  apiKey,
  apiUrl,
  file,
  folders,
  onError,
  onSuccess,
  onUploadProgress,
}: UploadParams) => {
  if (!apiKey?.token) {
    return;
  }

  const folderPaths = folders.slice(1).map((item) => item.name);
  const form = new FormData();

  form.append("file", file);
  form.append("path", folderPaths.join("/"));

  return Axios.post(`${apiUrl}/${apiKey.token}/storage/upload`, form, {
    onUploadProgress,
  })
    .then(onSuccess)
    .catch((err) => {
      if (Axios.isAxiosError(err)) {
        if (err.response) {
          onError(
            (err.response.data as Error).message || err.response.data.toString()
          );
          return;
        }
      }

      onError(err.toString());
    });
};
