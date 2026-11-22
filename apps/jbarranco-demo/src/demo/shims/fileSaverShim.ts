import { registerDemoBlobUrl } from "../demoStorage";

export function saveAs(blob: Blob, filename: string): void {
  if (typeof document === "undefined") return;
  const url = registerDemoBlobUrl(URL.createObjectURL(blob));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

export default { saveAs };
