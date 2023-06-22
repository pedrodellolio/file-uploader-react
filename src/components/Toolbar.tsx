import { deleteEntry } from "../api/apiService";
import JSZip from "jszip";
import { addFolderToZip, base64ToBlob } from "../utils/utils";
import { useDirectory } from "../hooks/useDirectory";
import { Entry, EntryType } from "../routes/Root";

interface Props {
  selectedEntries: Entry[];
  isEditingEntry: boolean;
  setIsEditingEntry: React.Dispatch<React.SetStateAction<boolean>>;
}

function Toolbar(props: Props) {
  const directoryContext = useDirectory();

  async function handleDelete() {
    for (const selectedEntry of props.selectedEntries) {
      const res = await deleteEntry(selectedEntry);
      if (res.status === 200) {
        const entries = directoryContext.currentEntryChildren.filter(
          (entry) => entry.id !== selectedEntry.id
        );
        directoryContext.setCurrentEntryChildren(entries);
      }
    }
  }

  async function downloadFiles(selectedEntries: Entry[]) {
    if (selectedEntries.length === 1) {
      const entry = selectedEntries[0];
      const { content, name } = entry;
      if (content) {
        const blob = base64ToBlob(content, "application/octet-stream");
        redirectDownload(blob, name);
      }
    } else {
      const zip = new JSZip();

      for (const entry of selectedEntries) {
        if (entry.type === EntryType.Folder) {
          await addFolderToZip(zip, entry);
        } else {
          const { content, name } = entry;
          if (content) {
            const blob = base64ToBlob(content, "application/octet-stream");
            zip.file(name, blob);
          }
        }
      }

      zip.generateAsync({ type: "blob" }).then(function (content) {
        redirectDownload(content, "files.zip");
      });
    }
  }

  function redirectDownload(content: Blob, name: string) {
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div
      className={`${
        props.selectedEntries.length === 0 && "invisible"
      } toolbar px-3 flex flex-row items-center gap-4`}
    >
      <p className="font-semibold text-white">
        {props.selectedEntries.length} selected
      </p>
      <a
        onClick={handleDelete}
        className="cursor-pointer material-symbols-rounded text-gray-300 hover:bg-orange-100 p-1 rounded-full"
      >
        delete
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          height="22"
          viewBox="0 96 960 960"
          width="22"
        >
          <path d="M261 936q-24 0-42-18t-18-42V306h-11q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T190 246h158q0-13 8.625-21.5T378 216h204q12.75 0 21.375 8.625T612 246h158q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T770 306h-11v570q0 24-18 42t-42 18H261Zm0-630v570h438V306H261Zm106 454q0 12.75 8.675 21.375 8.676 8.625 21.5 8.625 12.825 0 21.325-8.625T427 760V421q0-12.75-8.675-21.375-8.676-8.625-21.5-8.625-12.825 0-21.325 8.625T367 421v339Zm166 0q0 12.75 8.675 21.375 8.676 8.625 21.5 8.625 12.825 0 21.325-8.625T593 760V421q0-12.75-8.675-21.375-8.676-8.625-21.5-8.625-12.825 0-21.325 8.625T533 421v339ZM261 306v570-570Z" />
        </svg> */}
      </a>
      <a
        onClick={() => downloadFiles(props.selectedEntries)}
        className="cursor-pointer material-symbols-rounded hover:bg-blue-600 p-1 rounded-full text-gray-300"
      >
        download
      </a>
      {/* <a
        onClick={() => props.setIsEditingEntry(true)}
        className="cursor-pointer material-symbols-rounded hover:bg-blue-600 p-1 rounded-full text-gray-300"
      >
        edit
      </a> */}
    </div>
  );
}

export default Toolbar;
