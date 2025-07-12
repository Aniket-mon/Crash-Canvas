import Papa from "papaparse";

export function parseCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (err: Error) => reject(err)
    });
  });
}

export async function fetchAndParseCSV(url: string): Promise<any[]> {
  const response = await fetch(url);
  const csvText = await response.text();
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (err: any) => reject(err)
    });
  });
}
