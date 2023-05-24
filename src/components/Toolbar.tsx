import { Entry } from "../App";

interface Props {
  selectedEntries: number[];
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  entries: Entry[] | null;
}

function Toolbar(props: Props) {
  function deleteEntries() {
    for (const entryId of props.selectedEntries)
      props.setEntries((prevState) =>
        prevState.filter((entry, i) => i === entryId)
      );
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
        onClick={deleteEntries}
        className="cursor-pointer material-symbols-rounded text-gray-300 hover:bg-orange-100 p-1 rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="22"
          viewBox="0 96 960 960"
          width="22"
        >
          <path d="M261 936q-24 0-42-18t-18-42V306h-11q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T190 246h158q0-13 8.625-21.5T378 216h204q12.75 0 21.375 8.625T612 246h158q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T770 306h-11v570q0 24-18 42t-42 18H261Zm0-630v570h438V306H261Zm106 454q0 12.75 8.675 21.375 8.676 8.625 21.5 8.625 12.825 0 21.325-8.625T427 760V421q0-12.75-8.675-21.375-8.676-8.625-21.5-8.625-12.825 0-21.325 8.625T367 421v339Zm166 0q0 12.75 8.675 21.375 8.676 8.625 21.5 8.625 12.825 0 21.325-8.625T593 760V421q0-12.75-8.675-21.375-8.676-8.625-21.5-8.625-12.825 0-21.325 8.625T533 421v339ZM261 306v570-570Z" />
        </svg>
      </a>
      <a className="cursor-pointer material-symbols-rounded hover:bg-blue-600 p-1 rounded-full text-gray-300">
        download
      </a>
    </div>
  );
}

export default Toolbar;
