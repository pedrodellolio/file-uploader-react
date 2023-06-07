import { useState } from "react";
import { entries as json } from "./files.json";
import TopNav from "./components/TopNav";
import SideNav from "./components/SideNav";
import FileList from "./components/FileList";
// import Routes from "./Routes";

export interface Entry {
  name: string;
  parent: string;
  sizeInBytes: number;
  lastModified: string;
  content?: string;
  type: string; //"folder" or "file"
  entries: Entry[] | null;
}

function App() {
  const [entries, setEntries] = useState<Entry[]>(json);

  function downloadFile(base64: string, fileName: string, contentType: string) {
    const url = URL.createObjectURL(base64ToBlob(base64, contentType));
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  function base64ToBlob(base64String: string, contentType: string) {
    const byteCharacters = atob(base64String);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  return (
    <>
      {entries && (
        <div draggable={false} className="flex">
          <SideNav entries={entries} />
          <div className="w-full bg-blue-700">
            <TopNav entries={entries} />
            <section draggable={false} id="files">
              <FileList
                entries={entries}
                title={"All Files"}
                setEntries={setEntries}
              />
            </section>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
