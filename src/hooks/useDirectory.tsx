import { useContext } from "react";
import DirectoryContext from "../context/DirectoryContext";

export function useDirectory() {
  const context = useContext(DirectoryContext);

  return context;
}
