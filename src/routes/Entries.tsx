import { useLoaderData } from "react-router-dom";
import { getChildrenEntries } from "../api/apiService";
import FileList from "../components/FileList";
import { Entry } from "./Root";


export async function entriesLoader({params}: any) {
  return await getChildrenEntries(params.path);
}

function Entries() {
  const entries = useLoaderData() as Entry[];
  return (
    <section draggable={false} id="files">
      <FileList entries={entries} title="All Files" />
    </section>
  );
}

export default Entries;
