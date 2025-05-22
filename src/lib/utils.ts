import type { FieldType } from "~/types/sqlite";
import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSqliteType(type: string): FieldType {
  if (type === "INT") {
    return "INTEGER";
  }

  const h = type.substring(0, 4);

  switch (h) {
    case "CHAR":
    case "CLOB":
    case "TEXT":
    case "VARC":
      return "TEXT";
    case "BLOB":
      return "BLOB";
    case "REAL":
    case "FLOA":
    case "DOUB":
      return "REAL";
    case "INTE":
    case "BIGI":
    case "SMAL":
    case "TINY":
    case "NUMB":
    case "DECI":
    case "UNSI":
      return "INTEGER";
  }

  return "NUMERIC";
}
