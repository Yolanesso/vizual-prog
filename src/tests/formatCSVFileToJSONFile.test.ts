import { describe, it, expect, vi, beforeEach } from "vitest";
import { formatCSVFileToJSONFile } from "../functions/formatCSVFileToJSONFile";

vi.mock("node:fs/promises", () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
}));

import { readFile, writeFile } from "node:fs/promises";

describe("formatCSVFileToJSONFile", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("должен читать CSV файл и записывать JSON файл", async () => {
    const mockCSVContent = "name;age;city\nИван;25;Москва\nМария;30;СПб";
    vi.mocked(readFile).mockResolvedValue(mockCSVContent);

    await formatCSVFileToJSONFile("input.csv", "output.json", ";");

    expect(readFile).toHaveBeenCalledTimes(1);
    expect(readFile).toHaveBeenCalledWith("input.csv", "utf-8");

    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith(
      "output.json",
      JSON.stringify(
        [
          { name: "Иван", age: 25, city: "Москва" },
          { name: "Мария", age: 30, city: "СПб" },
        ],
        null,
        2,
      ),
      "utf-8",
    );
  });

  it("должен обрабатывать числа в CSV правильно", async () => {
    const mockCSVContent = "id;value;price\n1;42;99.99\n2;3.14;100.50";
    vi.mocked(readFile).mockResolvedValue(mockCSVContent);

    await formatCSVFileToJSONFile("input.csv", "output.json", ";");

    expect(writeFile).toHaveBeenCalledWith(
      "output.json",
      JSON.stringify(
        [
          { id: 1, value: 42, price: 99.99 },
          { id: 2, value: 3.14, price: 100.5 },
        ],
        null,
        2,
      ),
      "utf-8",
    );
  });

  it("должен выбрасывать ошибку при пустом файле", async () => {
    vi.mocked(readFile).mockResolvedValue("");

    await expect(
      formatCSVFileToJSONFile("empty.csv", "output.json", ";"),
    ).rejects.toThrow("Ошибка при обработке файла: Файл пуст");

    expect(writeFile).not.toHaveBeenCalled();
  });

  it("должен выбрасывать ошибку при некорректном CSV", async () => {
    const mockCSVContent = "name;age\nИван;25;Москва";
    vi.mocked(readFile).mockResolvedValue(mockCSVContent);

    await expect(
      formatCSVFileToJSONFile("bad.csv", "output.json", ";"),
    ).rejects.toThrow(
      "Ошибка при обработке файла: Несоответствие количества полей в строке 2: ожидалось 2, получено 3",
    );

    expect(writeFile).not.toHaveBeenCalled();
  });

  it("должен обрабатывать ошибки чтения файла", async () => {
    vi.mocked(readFile).mockRejectedValue(new Error("Файл не найден"));

    await expect(
      formatCSVFileToJSONFile("missing.csv", "output.json", ";"),
    ).rejects.toThrow("Ошибка при обработке файла: Файл не найден");

    expect(writeFile).not.toHaveBeenCalled();
  });

  it("должен обрабатывать ошибки записи файла", async () => {
    const mockCSVContent = "name;age\nИван;25";
    vi.mocked(readFile).mockResolvedValue(mockCSVContent);

    vi.mocked(writeFile).mockRejectedValue(new Error("Нет прав на запись"));

    await expect(
      formatCSVFileToJSONFile(
        "input.csv",
        "/system/protected/output.json",
        ";",
      ),
    ).rejects.toThrow("Ошибка при обработке файла: Нет прав на запись");
  });
});
