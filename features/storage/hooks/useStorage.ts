import { useRouter } from "next/router";
import * as React from "react";

import { useGetApiKey, useGetStorageTree } from "@/api";
import { StorageObject } from "@/api/types";
import { DatabasesParams } from "@/types";

import { ProgressInfo } from "../types";
import { upload } from "../utils/upload";

export const useStorage = () => {
  const router = useRouter();
  const { databaseId } = router.query as unknown as DatabasesParams;
  const [folders] = React.useState<StorageObject[]>([]);
  const [selectedFolder, setSelectedFolder] = React.useState<StorageObject[]>([
    { name: "root", type: "folder" },
  ]);
  const [selectedObject, setSelectedObject] =
    React.useState<StorageObject | null>(null);
  const [progressInfos, setProgressInfos] = React.useState<ProgressInfo[]>([]);

  const progressInfosRef = React.useRef<ProgressInfo[] | null>(null);

  const { data: apiKeyData, isLoading: isLoadingGetApiKey } =
    useGetApiKey(databaseId);

  const {
    data: dataStorages,
    isLoading: isLoadingGetStorage,
    refetch: refetchGetStorages,
  } = useGetStorageTree(router.query?.databaseId as string);

  const handleObjectClick = React.useCallback((objectData: StorageObject) => {
    if (objectData.type === "folder") {
      setSelectedFolder((prev) => [...prev, objectData]);
      return;
    }

    setSelectedObject(objectData);
  }, []);

  const handleNavigateFolder = React.useCallback((index: number) => {
    setSelectedFolder((prev) => prev.slice(0, index + 1));
  }, []);

  const handleNewFolder = React.useCallback(() => {
    if (selectedFolder[selectedFolder.length - 1].type === "input") {
      return;
    }

    setSelectedFolder((prev) => [
      ...prev,
      { name: "", type: "input", children: [] },
    ]);
  }, [selectedFolder]);

  const handleSaveFolder = React.useCallback(
    (value: string) => {
      const folders = [...selectedFolder];

      if (value === "") {
        folders.pop();
      } else {
        folders[folders.length - 1] = {
          name: value,
          type: "folder",
          children: [],
        };
      }

      setSelectedFolder(folders);
    },
    [selectedFolder]
  );

  const apiKey = React.useMemo(
    () => apiKeyData && apiKeyData.length && apiKeyData[0],
    [apiKeyData]
  );
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const apiUrl = process.env.NEXT_PUBLIC_QUERY_URL as string;

  const handleUpload = React.useCallback(
    async (index: number, file: File) => {
      const _progressInfos = [...progressInfosRef.current];

      return upload({
        apiKey,
        apiUrl,
        file,
        folders: selectedFolder,
        index,
        onError: (err: string) => {
          _progressInfos[index].error = err;
          setProgressInfos([..._progressInfos]);
        },
        onSuccess: () => {
          _progressInfos[index].isFinished = true;
          setProgressInfos([..._progressInfos]);
        },
        onUploadProgress: (event: ProgressEvent) => {
          _progressInfos[index].percentage = Math.round(
            (100 * event.loaded) / event.total
          );
          setProgressInfos([..._progressInfos]);
        },
      });
    },
    [apiKey, apiUrl, selectedFolder]
  );

  const handleUploadFiles = React.useCallback(
    async (selectedFiles: FileList) => {
      const files = Array.from(selectedFiles);

      const _progressInfos: ProgressInfo[] = files.map((file) => ({
        fileName: file.name,
        percentage: 0,
        mimeType: file.type,
      }));

      progressInfosRef.current = _progressInfos;

      try {
        const uploadPromises = files.map((file, i) => handleUpload(i, file));

        await Promise.all(uploadPromises);
        refetchGetStorages();
      } catch (error) {
        console.log(error);
      }
    },
    [refetchGetStorages, handleUpload]
  );

  const clearFilesUpload = React.useCallback(() => {
    setProgressInfos([]);
    progressInfosRef.current = null;
  }, []);

  const isLoading = isLoadingGetApiKey || isLoadingGetStorage;

  const storageObjects = React.useMemo(() => {
    let data: StorageObject[] = [];

    if (!dataStorages) {
      return data;
    }

    const rootChildrends = [...folders, ...dataStorages.slice(0)].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    data = rootChildrends;

    selectedFolder[0].children = rootChildrends;

    if (selectedFolder.length > 1) {
      let filesToCheck = selectedFolder.length;

      let currFolder = selectedFolder[selectedFolder.length - 1];
      if (currFolder.type === "input") {
        filesToCheck -= 1;
        currFolder = selectedFolder[selectedFolder.length - 2];
      }

      let files: StorageObject[] = rootChildrends;
      for (let i = 1; i < filesToCheck; i++) {
        files =
          files.find(
            (f) => f.name === selectedFolder[i].name && f.type === "folder"
          )?.children ?? [];
      }

      data = files?.slice(0) ?? [];
    }

    return data;
  }, [dataStorages, folders, selectedFolder]);

  return {
    folders,
    isLoading,
    progressInfos,
    selectedFolder,
    selectedObject,
    storageObjects,
    clearFilesUpload,
    handleNavigateFolder,
    handleNewFolder,
    handleObjectClick,
    handleSaveFolder,
    handleUploadFiles,
    refetchGetStorages,
    setSelectedObject,
  };
};
