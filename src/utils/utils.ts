import JSZip from "jszip";
import { Entry, EntryType } from "../routes/Root";

export function formatBytes(bytes: number, dp = 1) {
  const threshold = 1000;
  if (Math.abs(bytes) < threshold) return bytes + " B";

  const units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= threshold;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= threshold &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

export function base64ToBlob(base64String: string, contentType: string) {
  const byteCharacters = atob(base64String);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: contentType });
}

export function formatDate(date: Date) {
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function addFolderToZip(zip: JSZip, folderEntry: Entry) {
  const { name, entries } = folderEntry;
  const folder = zip.folder(name);

  if (entries) {
    for (const entry of entries) {
      if (entry.type === EntryType.Folder) {
        await addFolderToZip(folder!, entry);
      } else {
        const { content, name } = entry;
        if (content) {
          const blob = base64ToBlob(content, "application/octet-stream");
          folder?.file(name, blob);
        }
      }
    }
  }
}
