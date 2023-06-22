import React, { createContext, useEffect, useState } from "react";
import { getChildrenEntries, getEntry } from "../api/apiService";
import { Entry } from "../routes/Root";

interface DirectoryContextData {
  rootPath: string;
  currentEntryChildren: Entry[];
  setCurrentEntryChildren: React.Dispatch<React.SetStateAction<Entry[]>>;
  currentEntry?: Entry;
  setCurrentEntry: React.Dispatch<React.SetStateAction<Entry | undefined>>;
  currentDirectoryPath: string;
  setCurrentDirectoryPath: React.Dispatch<React.SetStateAction<string>>;
}

interface Props {
  children: React.ReactNode;
}

const DirectoryContext = createContext<DirectoryContextData>(
  {} as DirectoryContextData
);

export const DirectoryProvider = ({ children }: Props) => {
  let [rootPath, setRootPath] = useState("root");
  let [currentEntryChildren, setCurrentEntryChildren] = useState<Entry[]>([]);
  let [currentEntry, setCurrentEntry] = useState<Entry>();
  let [currentDirectoryPath, setCurrentDirectoryPath] = useState("root");

  useEffect(() => {
    getEntry(currentDirectoryPath).then((res) => {
      setCurrentEntry(res);
    });

    getChildrenEntries(currentDirectoryPath).then((res) => {
      setCurrentEntryChildren(res);
    });
  }, [currentDirectoryPath]);

  return (
    <DirectoryContext.Provider
      value={{
        rootPath,
        currentEntryChildren,
        setCurrentEntryChildren,
        currentEntry,
        setCurrentEntry,
        currentDirectoryPath,
        setCurrentDirectoryPath,
      }}
    >
      {children}
    </DirectoryContext.Provider>
  );
};

export default DirectoryContext;
