import { ChangeEvent, useEffect, useState } from "react";
import { Entry } from "../App";
import Button from "./Button";
import Toolbar from "./Toolbar";
import FolderForm from "./FolderForm";
import { formatBytes } from "../utils/utils";
import { getEntries, sendFile } from "../api/apiService";

interface Props {
  title: string;
  entries: Entry[] | null;
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
}

function FileList(props: Props) {
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [showingCheckbox, setShowingCheckbox] = useState(-1);
  const [selectedEntries, setSelectedEntries] = useState<number[]>([]);
  const [currentDirectoryPath, setCurrentDirectoryPath] = useState("root");
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  useEffect(() => {
    getEntries(currentDirectoryPath).then((res) => props.setEntries(res));
  }, []);

  function handleCheckboxChange(
    event: ChangeEvent<HTMLInputElement>,
    entryId: number
  ) {
    if (event.target.checked) setSelectedEntries([...selectedEntries, entryId]);
    else setSelectedEntries(selectedEntries.filter((id) => id !== entryId));
  }

  function handleEntryDoubleClick(path: string) {
    const entry = getEntryByPath(path);
    if (entry && entry.type === "folder") {
      setCurrentDirectoryPath(path);
    }
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDraggingFile(true);
  }

  function formatDate(date: Date) {
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function handleDropFiles(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    const files = Array.from(event.dataTransfer.files);

    for (const file of files) {
      await sendFile(file, currentDirectoryPath);
    }

    const entries: Entry[] = files.map((file) => ({
      name: file.name,
      parent: currentDirectoryPath,
      sizeInBytes: file.size,
      type: "file",
      entries: null,
      lastModified: formatDate(new Date()),
    }));

    const currentDirectory = getEntryByPath(currentDirectoryPath);
    if (currentDirectory) {
      currentDirectory.entries = currentDirectory.entries
        ? [...currentDirectory.entries, ...entries]
        : entries;
      props.setEntries((prevState) => [...prevState]);
    }

    setIsDraggingFile(false);
  }

  function handleEntrySingleClick(entryId: number) {
    selectedEntries.includes(entryId)
      ? selectedEntries.splice(selectedEntries.indexOf(entryId), 1)
      : setSelectedEntries((prevState) => [...prevState, entryId]);

    (document.getElementById("selectEntry") as HTMLInputElement).checked =
      selectedEntries.includes(entryId);
  }

  function getEntryByPath(path: string): Entry | undefined {
    if (path === "/root")
      return props.entries?.find((entry) => entry.name === "root");

    const segments = path.split("/").filter((segment) => segment !== "");
    let currentDirectory: Entry | undefined = props.entries?.find(
      (entry) => entry.name === "root"
    );

    for (let i = 1; i < segments.length; i++) {
      const entry = currentDirectory?.entries?.find(
        (entry) => entry.name === segments[i]
      );

      if (!entry) return undefined;

      currentDirectory = entry;
    }

    return currentDirectory;
  }

  return (
    <div className="container mx-auto mt-10">
      <Toolbar
        selectedEntries={selectedEntries}
        entries={props.entries}
        setEntries={props.setEntries}
      />

      <div className="flex flex-row justify-between items-center px-3 pt-3">
        <h1 className="font-semibold text-white">{props.title}</h1>
        <Button
          text="Create"
          iconName="create_new_folder"
          handleFolderState={() => {
            setCreatingFolder(true);
            setSelectedEntries([]);
          }}
        />
      </div>

      <div
        className={`dropZone p-4 border-2 border-blue-700 ${
          isDraggingFile && "bg-blue-400 border-blue-300 rounded-lg"
        }`}
        onDragOver={(e) => handleDragOver(e)}
        onDragLeave={() => setIsDraggingFile(false)}
        onDrop={(e) => handleDropFiles(e)}
      >
        <table className="table-fixed mt-4 w-full">
          <thead className="font-medium text-sm text-left text-gray-500 border-b border-blue-600">
            <tr>
              <th className="p-3 w-644" scope="col">
                Name
              </th>
              <th scope="col">File size</th>
              <th className="w-32" scope="col">
                Last modified
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody className="font-medium text-sm">
            <FolderForm
              isOpen={creatingFolder}
              setIsOpen={setCreatingFolder}
              currentDirectoryPath={currentDirectoryPath}
              entries={props.entries}
              setEntries={props.setEntries}
            />

            {props.entries?.map((file, i) => {
              return (
                <tr
                  key={i}
                  className={`${
                    selectedEntries.includes(i)
                      ? "bg-blue-500 hover:bg-blue-500"
                      : "  hover:bg-blue-800"
                  } select-none cursor-pointer`}
                  // onMouseOver={() => setShowingCheckbox(i)}
                  // onMouseOut={() => setShowingCheckbox(-1)}
                  onClick={() => handleEntrySingleClick(i)}
                  onDoubleClick={() =>
                    handleEntryDoubleClick(
                      `${currentDirectoryPath}/${file.name}`
                    )
                  }
                >
                  <td className="py-3 px-3 text-white flex items-center gap-3 h-14">
                    {showingCheckbox === i || selectedEntries.includes(i) ? (
                      <input
                        type="checkbox"
                        name="selectEntry"
                        id="selectEntry"
                        className="w-4 ml-1 mr-2 bg-blue-600"
                        checked={selectedEntries.includes(i)}
                        onChange={(e) => handleCheckboxChange(e, i)}
                      />
                    ) : (
                      <span className="w-4 mr-3 text-blue-100 material-symbols-rounded text-2xl">
                        {file.type === "folder" ? "folder" : "description"}
                      </span>
                    )}

                    {file.name}
                  </td>
                  <td className="text-gray-500">
                    {formatBytes(file.sizeInBytes)}
                  </td>
                  <td className="text-gray-500">
                    {new Date(file.lastModified).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="text-right">
                    <a
                      href="#"
                      className="material-symbols-rounded hover:bg-gray-100 rounded-full p-1"
                    >
                      more_vert
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FileList;
