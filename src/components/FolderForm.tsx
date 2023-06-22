import { useState } from "react";
import { Entry, EntryType } from "../App";
import { useDirectory } from "../hooks/useDirectory";
import { createEntry } from "../api/apiService";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function FolderForm(props: Props) {
  const directoryContext = useDirectory();
  const [newEntryName, setNewEntryName] = useState("");

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = (
      event.currentTarget.elements.namedItem("itemName") as HTMLInputElement
    ).value;

    const fileData = new Blob([], { type: "" });
    const file = new File([fileData], name === "" ? "New folder" : name);

    await createEntry(file, directoryContext.currentDirectoryPath);
    props.setIsOpen(false);
  }

  return props.isOpen ? (
    <tr className="bg-gray-800">
      <td className="py-3 px-3 text-black flex items-center gap-3">
        <span className="text-blue-100 material-symbols-rounded text-md">
          folder
        </span>
        <form
          className="flex flex-row items-center gap-4"
          onSubmit={(e) => handleFormSubmit(e)}
        >
          <input
            className="rounded-sm bg-blue-800 text-white p-1"
            type="text"
            name="itemName"
            id="itemName"
            onChange={(e) => setNewEntryName(e.target.value)}
          />
          <button
            type="submit"
            className="text-gray-300 hover:text-gray-400"
            disabled={
              directoryContext.currentEntryChildren
                ?.find(
                  (entry) =>
                    entry.name === directoryContext.currentDirectoryPath
                )
                ?.entries?.find((e) => e.name === newEntryName) != undefined
            }
          >
            Create
          </button>
          <button
            type="button"
            className="text-gray-300 hover:text-gray-400"
            onClick={() => props.setIsOpen(false)}
          >
            Cancel
          </button>
        </form>
      </td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  ) : (
    <tr></tr>
  );
}

export default FolderForm;
