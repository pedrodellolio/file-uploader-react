import { Entry } from "../App";
import ComboBox from "./ComboBox";

interface Props {
  entries: Entry[];
}

function TopNav(props: Props) {
  return (
    <nav id="top__nav" className="border-b border-blue-600 w-full">
      <ComboBox entries={props.entries} />
    </nav>
  );
}

export default TopNav;
