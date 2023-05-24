import { ChangeEvent, useState } from "react";
import { Entry } from "../App";
import Button from "./Button";
import Toolbar from "./Toolbar";
import FolderForm from "./FolderForm";
import { formatBytes } from "../utils/utils";

interface Props {
  title: string;
  files: Entry[] | null;
  setFiles: React.Dispatch<React.SetStateAction<Entry[]>>;
}

function FileList(props: Props) {
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [showingCheckbox, setShowingCheckbox] = useState(-1);
  const [selectedEntries, setSelectedEntries] = useState<number[]>([]);
  const [currentDirectoryPath, setCurrentDirectoryPath] = useState("root");

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

  function handleEntrySingleClick(entryId: number) {
    selectedEntries.includes(entryId)
      ? selectedEntries.splice(selectedEntries.indexOf(entryId), 1)
      : setSelectedEntries((prevState) => [...prevState, entryId]);

      (document.getElementById("selectEntry") as HTMLInputElement).checked = selectedEntries.includes(entryId);
  }

  function getEntryByPath(path: string): Entry | undefined {
    if (path === "/root")
      return props.files?.find((entry) => entry.name === "root");

    const segments = path.split("/").filter((segment) => segment !== "");
    let currentDirectory: Entry | undefined = props.files?.find(
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
      <Toolbar selectedEntries={selectedEntries} entries={props.files} setEntries={props.setFiles} />

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

      <table className="table-fixed mt-4 w-full">
        <thead className="font-medium text-sm text-left text-gray-500 border-b border-blue-600">
          <tr>
            <th className="p-3 w-44" scope="col">
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
            entries={props.files}
            setEntries={props.setFiles}
          />

          {getEntryByPath(currentDirectoryPath)?.entries?.map((file, i) => {
            return (
              <tr
                key={i}
                className={`${
                  selectedEntries.includes(i) && "bg-blue-600 hover:bg-blue-600"
                } select-none cursor-pointer bg-blue-700 hover:bg-blue-800`}
                onMouseOver={() => setShowingCheckbox(i)}
                onMouseOut={() => setShowingCheckbox(-1)}
                onClick={() => handleEntrySingleClick(i)}
                onDoubleClick={() =>
                  handleEntryDoubleClick(`${currentDirectoryPath}/${file.name}`)
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
  );
}

export default FileList;
