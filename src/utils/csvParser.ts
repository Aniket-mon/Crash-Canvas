import Papa from "papaparse";

export async function fetchAndParseCSV(url: string): Promise<any[]> {
  const response = await fetch(url);
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: reject
    });
  });
}
