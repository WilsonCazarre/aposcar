export type CategoryType = "main" | "regular" | "secondary";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  type: CategoryType;
}
