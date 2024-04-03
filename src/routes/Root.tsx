import { Outlet, useLoaderData } from "react-router-dom";
import TopNav from "../components/TopNav";
import SideNav from "../components/SideNav";
import { getAllEntries } from "../api/apiService";

export interface Entry {
  id: number;
  name: string;
  parentId?: number;
  sizeInBytes: number;
  lastModified: string;
  content?: string;
  type: EntryType;
  entries: Entry[] | null;
}

export enum EntryType {
  Folder,
  File,
}

export async function loader() {
  return await getAllEntries(true);
  // return null;
}

function Root() {
  const folders = useLoaderData() as Entry[];

  return (
    <>
      <div draggable={false} className="flex">
        <SideNav entries={folders} />
        <div className="w-full bg-blue-700">
          <TopNav />
          <Outlet />
          {/* <section draggable={false} id="files">
            <FileList title={"All Files"} />
          </section> */}
        </div>
      </div>
    </>
  );
}

export default Root;
