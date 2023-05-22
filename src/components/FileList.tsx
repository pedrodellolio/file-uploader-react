import { ChangeEvent, useState } from "react";
import { Entry } from "../App";
import Button from "./Button";

interface Props {
  title: string;
  files: Entry[] | null;
}

function FileList(props: Props) {
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [showingCheckbox, setShowingCheckbox] = useState(-1);
  const [selectedEntries, setSelectedEntries] = useState<number[]>([]);
  const [currentDirectoryPath, setCurrentDirectoryPath] = useState("/root");

  function formatBytes(bytes: number, dp = 1) {
    const threshold = 1000;
    if (Math.abs(bytes) < threshold) return bytes + " B";

    const units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let u = -1;
    const r = 10 ** dp;

    do {
      bytes /= threshold;
      ++u;
    } while (
      Math.round(Math.abs(bytes) * r) / r >= threshold &&
      u < units.length - 1
    );

    return bytes.toFixed(dp) + " " + units[u];
  }

  function handleCheckboxChange(
    event: ChangeEvent<HTMLInputElement>,
    entryId: number
  ) {
    if (event.target.checked) setSelectedEntries([...selectedEntries, entryId]);
    else setSelectedEntries(selectedEntries.filter((id) => id !== entryId));
  }

  function handleCreatingFolder() {
    setCreatingFolder(true);
    setSelectedEntries([]);
  }

  function handleEntryClick(path: string) {
    const entry = getEntryByPath(path);
    if (entry && entry.type === "folder") {
      setCurrentDirectoryPath(path);
    }
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

      if (!entry) return undefined; // Entrada não encontrada

      currentDirectory = entry;
    }

    return currentDirectory;
  }

  return (
    <div className="container mx-auto mt-10">
      {selectedEntries.length > 0 && (
        <div className="toolbar px-3 flex flex-row items-center gap-4">
          <p className="font-semibold text-gray-700">
            {selectedEntries.length} selected
          </p>
          <a className="cursor-pointer material-symbols-rounded text-gray-300 hover:bg-orange-100 p-1 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="22"
              viewBox="0 96 960 960"
              width="22"
            >
              <path d="M261 936q-24 0-42-18t-18-42V306h-11q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T190 246h158q0-13 8.625-21.5T378 216h204q12.75 0 21.375 8.625T612 246h158q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T770 306h-11v570q0 24-18 42t-42 18H261Zm0-630v570h438V306H261Zm106 454q0 12.75 8.675 21.375 8.676 8.625 21.5 8.625 12.825 0 21.325-8.625T427 760V421q0-12.75-8.675-21.375-8.676-8.625-21.5-8.625-12.825 0-21.325 8.625T367 421v339Zm166 0q0 12.75 8.675 21.375 8.676 8.625 21.5 8.625 12.825 0 21.325-8.625T593 760V421q0-12.75-8.675-21.375-8.676-8.625-21.5-8.625-12.825 0-21.325 8.625T533 421v339ZM261 306v570-570Z" />
            </svg>
          </a>
          <a className="cursor-pointer material-symbols-rounded hover:bg-orange-100 p-1 rounded-full">
            download
          </a>
        </div>
      )}
      <div className="flex flex-row justify-between items-center px-3 pt-3">
        <h1 className="font-semibold">{props.title}</h1>
        <Button
          text="Create"
          iconName="create_new_folder"
          handleFolderState={handleCreatingFolder}
        />
      </div>
      <table className="table-fixed mt-4 w-full">
        <thead className="font-medium text-sm text-left text-gray-500 border-b border-gray-200">
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
          {creatingFolder && (
            <tr className="bg-gray-100">
              <td className="py-3 px-3 text-black flex items-center gap-3">
                <span className="text-orange-400 material-symbols-rounded text-md">
                  folder
                </span>
                <input
                  className="rounded-sm"
                  type="text"
                  name="itemName"
                  id="itemName"
                />
              </td>
              <td></td>
              <td></td>
              <td>
                <a
                  onClick={() => setCreatingFolder(false)}
                  className="cursor-pointer material-symbols-rounded text-gray-500 mt-1"
                >
                  close
                </a>
              </td>
            </tr>
          )}

          {getEntryByPath(currentDirectoryPath)?.entries?.map((file, i) => {
            return (
              <tr
                key={i}
                className="cursor-pointer hover:bg-gray-50"
                onMouseOver={() => setShowingCheckbox(i)}
                onMouseOut={() => setShowingCheckbox(-1)}
                onClick={() =>
                  handleEntryClick(`${currentDirectoryPath}/${file.name}`)
                }
              >
                <td className="py-3 px-3 text-black flex items-center gap-3 h-14">
                  {showingCheckbox === i || selectedEntries.includes(i) ? (
                    <input
                      type="checkbox"
                      name="selectEntry"
                      id="selectEntry"
                      className="w-4 ml-1 mr-2"
                      onChange={(e) => handleCheckboxChange(e, i)}
                    />
                  ) : (
                    <span className="w-4 mr-3 text-orange-400 material-symbols-rounded text-2xl">
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
