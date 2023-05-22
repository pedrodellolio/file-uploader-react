import { useState } from "react";
import { Entry } from "../App";

interface SideNavProps {
  entries: Entry[];
}

interface FolderItemProps {
  folder: Entry;
  level?: number;
}

function SideNav(props: SideNavProps) {
  return (
    <nav className="border-r h-screen w-[250px] py-8 px-4">
      <div>
        <h1 className="font-medium">Explorer</h1>
        <ul className="mt-3">
          {props.entries.map((item, index) => (
            <li key={index}>
              {item.type === "folder" && <FolderItem folder={item} level={0} />}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function FolderItem(props: FolderItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { folder, level = 0 } = props;

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const hasSubFolders = folder.entries?.some((item) => item.type === "folder");

  const indentLevel = level * 35;

  return (
    <>
      <span
        onClick={hasSubFolders ? toggleOpen : undefined}
        style={{ paddingLeft: `${indentLevel}px` }}
        className="flex flex-row items-center text-sm"
      >
        {hasSubFolders ? (
          <a className="cursor-pointer material-symbols-rounded text-orange-400 text-xl">
            {isOpen ? "expand_more" : "chevron_right"}
          </a>
        ) : (
          ""
        )}
        <span className="material-symbols-rounded text-orange-400 text-xl mr-1">
          {isOpen ? "folder_open" : "folder"}
        </span>
        {folder.name}
      </span>
      {isOpen && (
        <ul>
          {folder.entries?.map((item, index) => (
            <li key={index}>
              {item.type === "folder" && (
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
