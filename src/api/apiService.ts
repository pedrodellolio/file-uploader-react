import axios, { AxiosResponse } from "axios";
import { Entry } from "../routes/Root";

interface Metadata {
  filename: string;
  totalChunks: number;
}

const BASE_URL = "https://localhost:7245/api";

export async function createEntry(file: File, directoryPath: string) {
  const chunkSize = 524288; // Tamanho de cada parte em bytes (512 KB)
  const totalChunks = Math.ceil(file.size / chunkSize); // Total de partes
  const metadata = {
    filename: file.name,
    size: file.size,
    lastModified: file.lastModified,
    type: file.type,
    parent: directoryPath,
    totalChunks: totalChunks,
  } as Metadata;

  let response: AxiosResponse | undefined = undefined;
  // Dividir o arquivo em partes e enviá-las separadamente
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("metadata", JSON.stringify(metadata));
    formData.append("chunk", chunk);

    try {
      response = await axios.post(`${BASE_URL}/file/Entry`, formData);
      console.log(response);
      console.log(`Parte ${i + 1} de ${totalChunks} enviada com sucesso!`);
    } catch (error) {
      console.error(`Erro ao enviar parte ${i + 1}:`, error);
      // Lidar com erros de envio, se necessário
    }
  }
  return response;
}

export async function getChildrenEntries(path: string) {
  console.log(path);
  const response = await axios.get(
    `${BASE_URL}/file/GetEntryChildren?path=${path}`
  );
  return response.data as Entry[];
}

export async function getAllEntries(onlyFolders: boolean) {
  const response = await axios.get(
    `${BASE_URL}/file/Entry?onlyFolders=${onlyFolders}`
  );
  return response.data as Entry[];
}

export async function getEntry(path: string) {
  const response = await axios.get(`${BASE_URL}/file/Entry/${path}`);
  return response.data as Entry;
}

export async function getEntryFullPath(entry: Entry) {
  const response = await axios.get(
    `${BASE_URL}/file/EntryFullPath/${entry.id}`
  );
  return response.data as string;
}

export async function deleteEntry(entry: Entry) {
  const response = await axios.delete(`${BASE_URL}/file/Entry`, {
    data: entry,
  });
  return response;
}

export async function editEntry(entry: Entry) {
  console.log(entry);
  const response = await axios.put(`${BASE_URL}/file/Entry`, { data: entry });
  return response;
}
