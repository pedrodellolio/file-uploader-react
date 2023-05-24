import { Combobox, Transition } from "@headlessui/react";
import { useState, Fragment } from "react";
import { Entry } from "../App";

interface Props {
  entries: Entry[];
}

function ComboBox(props: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<Entry>();

  const filteredEntries = searchTerm
    ? filterEntriesByName(props.entries, searchTerm)
    : [];
    
  function filterEntriesByName(entries: Entry[], searchTerm: string) {
    const filtered: Entry[] = [];

    for (const entry of entries) {
      if (entry.name.toLowerCase().startsWith(searchTerm.toLowerCase())) {
        filtered.push(entry);
      }

      if (entry.entries) {
        const subEntries = filterEntriesByName(entry.entries, searchTerm);
        filtered.push(...subEntries);
      }
    }

    return filtered;
  }

  return (
    <Combobox value={selectedEntry} onChange={setSelectedEntry}>
      <div className="relative w-96 m-3 border border-blue-800 rounded-full cursor-default overflow-hidden bg-blue-800 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
        <label className="relative text-gray-400 focus-within:text-gray-600 block">
          <span className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-4 material-symbols-rounded">
            search
          </span>
          <Combobox.Input
            placeholder="Search here"
            className="w-full border-none py-2 pl-12 pr-10 text-sm leading-5 text-white bg-blue-800 focus:ring-0"
            // displayValue={(entry) => entry.}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>

        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
          {/* <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              /> */}
        </Combobox.Button>
      </div>

      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        afterLeave={() => setSearchTerm("")}
      >
        <Combobox.Options className="mx-3 mt-0 absolute max-h-60 w-96 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredEntries.length === 0 && searchTerm !== "" ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
              Nothing found.
            </div>
          ) : (
            filteredEntries.map((entry, i) => (
              <Combobox.Option
                key={i}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-teal-600 text-white" : "text-gray-900"
                  }`
                }
                value={entry}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {entry.name}
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? "text-white" : "text-teal-600"
                        }`}
                      >
                        {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                      </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Transition>
    </Combobox>
  );
}

export default ComboBox;
