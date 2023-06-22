import { useEffect, useState } from "react";
import { getEntryFullPath } from "../api/apiService";
import { Link, useNavigate } from "react-router-dom";
import { Entry, EntryType } from "../routes/Root";

interface FolderItemProps {
  folder: Entry;
  level?: number;
}
interface SideNavProps {
  entries: Entry[];
}

function SideNav(props: SideNavProps) {
  return (
    <nav className="border-r border-blue-800 h-screen w-[270px] text-blue-200 bg-blue-800 py-8 px-4">
      <div>
        <h1 className="font-medium text-white">Explorer</h1>
        <ul className="mt-3">
          {props.entries.map((item) => (
            <li key={item.id}>
              {item.type === EntryType.Folder && (
                <FolderItem folder={item} level={0} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function FolderItem(props: FolderItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [folderFullPath, setFolderFullPath] = useState("");
  const { folder, level = 0 } = props;

  useEffect(() => {
    getEntryFullPath(folder).then((path) => {
      setFolderFullPath(path.replace(/\//g, "%"));
    });
  }, []);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const hasSubFolders = folder.entries?.some(
    (item) => item.type === EntryType.Folder
  );

  const indentLevel = level * 35;

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <span
          onClick={hasSubFolders ? toggleOpen : undefined}
          style={{ paddingLeft: `${indentLevel}px` }}
          className="flex flex-row items-center text-sm"
        >
          <Link
            to={folderFullPath}
            className={`cursor-pointer flex flex-row items-center gap-1 hover:text-white`}
          >
            {hasSubFolders ? (
              <a className="material-symbols-rounded text-blue-100 text-xl">
                {isOpen ? "expand_more" : "chevron_right"}
              </a>
            ) : (
              ""
            )}
            <span className="material-symbols-rounded text-blue-100 text-xl mr-1">
              {isOpen ? "folder_open" : "folder"}
            </span>
            {folder.name}
          </Link>
        </span>
        {/* <a className="cursor-pointer material-symbols-rounded text-sm hover:bg-blue-600 p-1">
          more_horiz
        </a> */}
      </div>
      {isOpen && (
        <ul>
          {folder.entries?.map((item) => (
            <li key={item.id}>
              {item.type === EntryType.Folder && (
                <FolderItem folder={item} level={level + 1} />
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default SideNav;
