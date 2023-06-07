import axios, { AxiosResponse } from "axios";

interface Metadata {
  filename: string;
  totalChunks: number;
}

const BASE_URL = "https://localhost:7245/api";

export async function sendFile(file: File, directoryPath: string) {
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
  // Dividir o arquivo em partes e enviá-las separadamente
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("metadata", JSON.stringify(metadata));
    formData.append("chunk", chunk);

    try {
      await axios.post(`${BASE_URL}/file`, formData);
      console.log(`Parte ${i + 1} de ${totalChunks} enviada com sucesso!`);
    } catch (error) {
      console.error(`Erro ao enviar parte ${i + 1}:`, error);
      // Lidar com erros de envio, se necessário
    }
  }
}

export async function getEntries(path?: string) {
  let response: AxiosResponse;

  if (!path) response = await axios.get(`${BASE_URL}/file/GetEntries`);
  else response = await axios.get(`${BASE_URL}/file/GetEntries?path=${path}`);
  console.log(response.data);
  return response.data;
}
