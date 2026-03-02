import Papa from "papaparse";
import type { PlayerStatRow } from "../types/stats";

self.onmessage = (e: MessageEvent<{ file: File }>) => {
  const { file } = e.data;

  self.postMessage({ type: "progress", message: "Parsing CSV… this may take 30–60s for 300 MB" });

  Papa.parse<PlayerStatRow>(file, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    complete(results) {
      self.postMessage({ type: "complete", rows: results.data });
    },
    error(err) {
      self.postMessage({ type: "error", message: err.message });
    },
  });
};