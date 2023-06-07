import { useState } from "react";
import { Entry } from "../App";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentDirectoryPath: string;
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  entries: Entry[] | null;
}

function FolderForm(props: Props) {
  const [newEntryName, setNewEntryName] = useState("");

  function addEntryByPath(path: string, newEntry: Entry) {
    props.setEntries((prevState) => {
      // Divida o caminho do diretório em uma lista de diretórios
      const directories = path.split("/").filter((dir) => dir !== "");

      // Função auxiliar recursiva para percorrer as entradas
      const addRecursive = (
        entries: Entry[],
        directoriesToAdd: string[]
      ): Entry[] => {
        if (directoriesToAdd.length === 0) {
          // Se não houver mais diretórios para percorrer, adicione a nova entrada ao diretório atual
          return [...entries, newEntry];
        }

        const [currentDirectory, ...remainingDirectories] = directoriesToAdd;
        const directoryIndex = entries.findIndex(
          (entry) => entry.name === currentDirectory
        );

        // if (directoryIndex === -1) {
        //   // Se o diretório não existir, crie um novo diretório e continue percorrendo
        //   const newDirectory: Entry = {
        //     name: currentDirectory,
        //     parent: '', // Defina o diretório pai conforme necessário
        //     sizeInBytes: 0,
        //     lastModified: '', // Defina a data de modificação conforme necessário
        //     type: 'folder',
        //     entries: [],
        //   };
        //   const updatedEntries = [...entries, newDirectory];
        //   return addRecursive(updatedEntries, remainingDirectories);
        // }

        // Se o diretório existir, atualize as entradas internas chamando a função recursivamente
        const updatedEntries = [...entries];
        updatedEntries[directoryIndex].entries = addRecursive(
          updatedEntries[directoryIndex].entries!,
          remainingDirectories
        );
        return updatedEntries;
      };

      // Chame a função auxiliar para adicionar a nova entrada pelo caminho do diretório
      return addRecursive(prevState, directories);
    });
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = (
      event.currentTarget.elements.namedItem("itemName") as HTMLInputElement
    ).value;

    const newEntry: Entry = {
      name: name === "" ? "New folder" : name,
      sizeInBytes: 0,
      parent: props.currentDirectoryPath,
      entries: [],
      type: "folder",
      lastModified: new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    addEntryByPath(props.currentDirectoryPath, newEntry);
    props.setIsOpen(false);
  }

  return props.isOpen ? (
    <tr className="bg-gray-800">
      <td className="py-3 px-3 text-black flex items-center gap-3">
        <span className="text-blue-100 material-symbols-rounded text-md">
          folder
        </span>
        <form
          className="flex flex-row items-center gap-4"
          onSubmit={(e) => handleFormSubmit(e)}
        >
          <input
            className="rounded-sm bg-blue-800 text-white p-1"
            type="text"
            name="itemName"
            id="itemName"
            onChange={(e) => setNewEntryName(e.target.value)}
          />
          <button
            type="submit"
            className="text-gray-300 hover:text-gray-400"
            disabled={
              props.entries
                ?.find((entry) => entry.name === props.currentDirectoryPath)
                ?.entries?.find((e) => e.name === newEntryName) != undefined
            }
          >
            Create
          </button>
          <button
            type="button"
            className="text-gray-300 hover:text-gray-400"
            onClick={() => props.setIsOpen(false)}
          >
            Cancel
          </button>
        </form>
      </td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  ) : (
    <tr></tr>
  );
}

export default FolderForm;
