import { ChangeEvent, useState } from "react";
import Button from "./Button";
import Toolbar from "./Toolbar";
import FolderForm from "./FolderForm";
import { formatBytes, formatDate } from "../utils/utils";
import { createEntry, getEntry } from "../api/apiService";
import { useDirectory } from "../hooks/useDirectory";
import { Entry, EntryType } from "../routes/Root";

interface Props {
  title: string;
  entries: Entry[];
}

function FileList(props: Props) {
  const {
    setCurrentDirectoryPath,
    currentDirectoryPath,
    setCurrentEntryChildren,
    currentEntryChildren,
  } = useDirectory();
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState<Entry[]>([]);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isEditingEntry, setIsEditingEntry] = useState(false);
  // const [showingCheckbox, setShowingCheckbox] = useState(-1);

  function handleCheckboxChange(
    event: ChangeEvent<HTMLInputElement>,
    entry: Entry
  ) {
    if (event.target.checked) setSelectedEntries([...selectedEntries, entry]);
    else setSelectedEntries(selectedEntries.filter((id) => id !== entry));
  }

  function handleEntryDoubleClick(path: string) {
    const entry = getEntryByPath(path);
    if (entry && entry.type === EntryType.Folder) {
      setCurrentDirectoryPath(path);
    }
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDraggingFile(true);
  }

  async function handleDropFiles(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    const files = Array.from(event.dataTransfer.files);

    for (const file of files) {
      const res = await createEntry(file, currentDirectoryPath);
      if (res && res.data) {
        setCurrentEntryChildren((prevState) => [...prevState, res.data]);
      }
    }

    const parent = await getEntry(currentDirectoryPath);
    const entries: Entry[] = files.map((file) => ({
      id: 0, //TODO - preencher com id definido no insert na tabela
      name: file.name,
      parentId: parent.id,
      sizeInBytes: file.size,
      type: EntryType.File,
      entries: null,
      lastModified: formatDate(new Date()),
    }));

    const currentDirectory = getEntryByPath(currentDirectoryPath);
    if (currentDirectory) {
      currentDirectory.entries = currentDirectory.entries
        ? [...currentDirectory.entries, ...entries]
        : entries;
    }
    setIsDraggingFile(false);
  }

  function handleEntrySingleClick(entry: Entry) {
    selectedEntries.includes(entry)
      ? selectedEntries.splice(selectedEntries.indexOf(entry), 1)
      : setSelectedEntries((prevState) => [...prevState, entry]);

    (document.getElementById("selectEntry") as HTMLInputElement).checked =
      selectedEntries.includes(entry);
  }

  function getEntryByPath(path: string): Entry | undefined {
    if (path === "/root")
      return currentEntryChildren.find((entry) => entry.name === "root");

    const segments = path.split("/").filter((segment) => segment !== "");
    let currentDirectory: Entry | undefined = currentEntryChildren.find(
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

  // async function editEntries(event: React.FormEvent<HTMLFormElement>) {
  //   //edit action is only allowed when there is just ONE entry selected
  //   event.preventDefault();
  //   setSelectedEntries((prevState) => {
  //     return prevState.map((obj) => {
  //       return {
  //         ...obj,
  //         name: (
  //           event.currentTarget.elements.namedItem(
  //             "itemName"
  //           ) as HTMLInputElement
  //         ).value,
  //       };
  //     });
  //   });
  //   const res = await editEntry(selectedEntries[0]);
  //   if (res.status === 200) {
  //     directoryContext.setCurrentEntryChildren((prevState) => {
  //       return prevState.map((obj) => {
  //         if (obj.id === selectedEntries[0].id) {
  //           return { ...obj, name: selectedEntries[0].name };
  //         }
  //         return obj;
  //       });
  //     });
  //     setIsEditingEntry(false);
  //   }
  // }
  // console.log(selectedEntries);
  return (
    <div className="container mx-auto mt-10">
      <Toolbar
        selectedEntries={selectedEntries}
        isEditingEntry={isEditingEntry}
        setIsEditingEntry={setIsEditingEntry}
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
            <FolderForm isOpen={creatingFolder} setIsOpen={setCreatingFolder} />

            {props.entries.map((file) => {
              return (
                <tr
                  key={file.id}
                  className={`${
                    selectedEntries.includes(file)
                      ? "bg-blue-500 hover:bg-blue-500"
                      : "  hover:bg-blue-800"
                  } select-none cursor-pointer`}
                  // onMouseOver={() => setShowingCheckbox(i)}
                  // onMouseOut={() => setShowingCheckbox(-1)}
                  onClick={() => handleEntrySingleClick(file)}
                  onDoubleClick={() =>
                    handleEntryDoubleClick(
                      `${currentDirectoryPath}/${file.name}`
                    )
                  }
                >
                  <td className="py-3 px-3 text-white flex items-center gap-3 h-14">
                    {selectedEntries.includes(file) ? (
                      <input
                        type="checkbox"
                        name="selectEntry"
                        id="selectEntry"
                        className="w-4 ml-1 mr-2 bg-blue-600"
                        checked={selectedEntries.includes(file)}
                        onChange={(e) => handleCheckboxChange(e, file)}
                      />
                    ) : (
                      <span className="w-4 mr-3 text-blue-100 material-symbols-rounded text-2xl">
                        {file.type === EntryType.Folder
                          ? "folder"
                          : "description"}
                      </span>
                    )}
                    {isEditingEntry ? (
                      // <form
                      //   className="flex flex-row items-center gap-4"
                      //   // onSubmit={(e) => editEntries(e)}
                      // >
                      //   <input
                      //     className="rounded-sm bg-blue-800 text-white p-1"
                      //     type="text"
                      //     name="itemName"
                      //     id="itemName"
                      //     autoFocus
                      //     // onChange={(e) => setNewEntryName(e.target.value)}
                      //   />
                      //   <button
                      //     type="submit"
                      //     className="text-gray-300 hover:text-gray-400"
                      //     // disabled={
                      //     //   directoryContext.currentEntryChildren
                      //     //     ?.find(
                      //     //       (entry) =>
                      //     //         entry.name ===
                      //     //         directoryContext.currentDirectoryPath
                      //     //     )
                      //     //     ?.entries?.find((e) => e.name === newEntryName) !=
                      //     //   undefined
                      //     // }
                      //   >
                      //     Create
                      //   </button>
                      //   <button
                      //     type="button"
                      //     className="text-gray-300 hover:text-gray-400"
                      //     onClick={() => setIsEditingEntry(false)}
                      //   >
                      //     Cancel
                      //   </button>
                      // </form>
                      <form></form>
                    ) : (
                      file.name
                    )}
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
