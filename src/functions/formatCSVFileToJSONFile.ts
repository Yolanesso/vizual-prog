import { readFile, writeFile } from "node:fs/promises";
import { csvToJSON } from "./csvToJSON.js";

export async function formatCSVFileToJSONFile(
  input: string,
  output: string,
  delimiter: string,
): Promise<void> {
  try {
    const fileContent = await readFile(input, "utf-8");

    if (!fileContent) {
      throw new Error("Файл пуст");
    }

    const lines = fileContent
      .split("\n")
      .filter((line) => line && line.trim() !== "");

    if (lines.length === 0) {
      throw new Error("Файл не содержит данных");
    }

    const jsonData = csvToJSON(lines, delimiter);

    await writeFile(output, JSON.stringify(jsonData, null, 2), "utf-8");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Ошибка при обработке файла: ${error.message}`);
    }
    throw error;
  }
}
