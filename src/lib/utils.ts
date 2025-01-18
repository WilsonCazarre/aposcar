import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Unpacked<T> =
  T extends Array<infer U> ? U : T extends Set<infer U> ? U : T;
