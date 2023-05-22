import { useState } from "react";
import { entries } from "./files.json";
import TopNav from "./components/TopNav";
import SideNav from "./components/SideNav";
import FileList from "./components/FileList";
// import Routes from "./Routes";

export interface Entry {
  name: string;
  parent: string;
  sizeInBytes: number;
  lastModified: string;
  type: string; //"folder" or "file"
  entries: Entry[] | null;
}

function App() {
  const [files, setFiles] = useState<Entry[]>(entries);

  return (
    <>
      {files && (
        <div className="flex">
          <SideNav entries={files} />
          <section id="files" className="w-full">
            <TopNav />
            <FileList files={files} title={"All Files"} />
          </section>
        </div>
      )}
    </>
  );
}

export default App;
